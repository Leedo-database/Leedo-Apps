import { Employee, AppItem, Notice, UserSession, BackgroundConfig, AppCategory } from '../types';
import { INITIAL_EMPLOYEES } from '../data/employees';
import { INITIAL_APPS } from '../data/defaultApps';
import { INITIAL_NOTICES } from '../data/notices';
import { INITIAL_CATEGORIES } from '../data/defaultCategories';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';

const STORAGE_KEYS = {
  EMPLOYEES: 'leedo_employees_v1',
  APPS: 'leedo_apps_v1',
  NOTICES: 'leedo_notices_v1',
  CURRENT_SESSION: 'leedo_current_session_v1',
  REMEMBERED_EID: 'leedo_remembered_eid_v1',
  BACKGROUND_CONFIG: 'leedo_background_config_v1',
  CUSTOM_LOGO: 'leedo_custom_logo_v1',
  CATEGORIES: 'leedo_categories_v1',
};

const DEFAULT_BG_CONFIG: BackgroundConfig = {
  type: 'pattern',
  imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop',
  blur: 8,
  dim: 45,
  overlayColor: '#0c354e',
};

type StorageListener = () => void;

class StorageService {
  private listeners: Set<StorageListener> = new Set();
  private isInitialized = false;
  private unsubscribes: Unsubscribe[] = [];

  constructor() {
    // Start firestore real-time synchronization
    this.initFirestoreSync();
  }

  public subscribe(callback: StorageListener): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Storage subscriber error:', err);
      }
    });
  }

  public initFirestoreSync() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Apps synchronization
    try {
      const appsCol = collection(db, 'apps');
      const unsubApps = onSnapshot(
        appsCol,
        (snapshot) => {
          if (snapshot.empty) {
            // First time seed
            this.seedAppsToFirestore();
          } else {
            const remoteApps: AppItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as AppItem;
              remoteApps.push(data);
            });
            remoteApps.sort((a, b) => (a.order || 0) - (b.order || 0));
            this.saveLocalApps(remoteApps);
            this.notify();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'apps');
        }
      );
      this.unsubscribes.push(unsubApps);
    } catch (e) {
      console.warn('Apps sync error:', e);
    }

    // 2. Categories synchronization
    try {
      const catCol = collection(db, 'categories');
      const unsubCats = onSnapshot(
        catCol,
        (snapshot) => {
          if (snapshot.empty) {
            this.seedCategoriesToFirestore();
          } else {
            const remoteCats: AppCategory[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as AppCategory;
              remoteCats.push(data);
            });
            remoteCats.sort((a, b) => (a.order || 0) - (b.order || 0));
            this.saveLocalCategories(remoteCats);
            this.notify();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'categories');
        }
      );
      this.unsubscribes.push(unsubCats);
    } catch (e) {
      console.warn('Categories sync error:', e);
    }

    // 3. Notices synchronization
    try {
      const noticesCol = collection(db, 'notices');
      const unsubNotices = onSnapshot(
        noticesCol,
        (snapshot) => {
          if (snapshot.empty) {
            this.seedNoticesToFirestore();
          } else {
            const remoteNotices: Notice[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as Notice;
              remoteNotices.push(data);
            });
            this.saveLocalNotices(remoteNotices);
            this.notify();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'notices');
        }
      );
      this.unsubscribes.push(unsubNotices);
    } catch (e) {
      console.warn('Notices sync error:', e);
    }

    // 4. Portal Settings (Background and Custom Logo)
    try {
      const settingsDoc = doc(db, 'settings', 'portalConfig');
      const unsubSettings = onSnapshot(
        settingsDoc,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.backgroundConfig) {
              this.saveLocalBackgroundConfig(data.backgroundConfig as BackgroundConfig);
            }
            if (data.customLogo !== undefined) {
              this.saveLocalCustomLogo(data.customLogo as string | null);
            }
            this.notify();
          } else {
            // First time seed settings
            this.seedSettingsToFirestore();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'settings/portalConfig');
        }
      );
      this.unsubscribes.push(unsubSettings);
    } catch (e) {
      console.warn('Settings sync error:', e);
    }

    // 5. Employees password/changes synchronization
    try {
      const empCol = collection(db, 'employees');
      const unsubEmp = onSnapshot(
        empCol,
        (snapshot) => {
          if (snapshot.empty) {
            this.seedEmployeesToFirestore();
          } else {
            const currentEmployees = this.getEmployees();
            const updated = [...currentEmployees];
            let modified = false;

            snapshot.forEach((docSnap) => {
              const remoteEmp = docSnap.data() as Employee;
              const idx = updated.findIndex((e) => e.eid === remoteEmp.eid);
              if (idx !== -1) {
                if (
                  updated[idx].password !== remoteEmp.password ||
                  updated[idx].isPasswordChanged !== remoteEmp.isPasswordChanged
                ) {
                  updated[idx] = { ...updated[idx], ...remoteEmp };
                  modified = true;
                }
              } else {
                updated.push(remoteEmp);
                modified = true;
              }
            });

            if (modified) {
              this.saveLocalEmployees(updated);
              this.notify();
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'employees');
        }
      );
      this.unsubscribes.push(unsubEmp);
    } catch (e) {
      console.warn('Employees sync error:', e);
    }
  }

  // --- Seed initial data to Firestore ---
  private async seedAppsToFirestore() {
    try {
      const batch = writeBatch(db);
      for (const app of INITIAL_APPS) {
        const appRef = doc(db, 'apps', app.id);
        batch.set(appRef, app);
      }
      await batch.commit();
    } catch (err) {
      console.warn('Failed seeding apps to firestore:', err);
    }
  }

  private async seedCategoriesToFirestore() {
    try {
      const batch = writeBatch(db);
      for (const cat of INITIAL_CATEGORIES) {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(catRef, cat);
      }
      await batch.commit();
    } catch (err) {
      console.warn('Failed seeding categories to firestore:', err);
    }
  }

  private async seedNoticesToFirestore() {
    try {
      const batch = writeBatch(db);
      for (const notice of INITIAL_NOTICES) {
        const noticeRef = doc(db, 'notices', notice.id);
        batch.set(noticeRef, notice);
      }
      await batch.commit();
    } catch (err) {
      console.warn('Failed seeding notices to firestore:', err);
    }
  }

  private async seedSettingsToFirestore() {
    try {
      const settingsRef = doc(db, 'settings', 'portalConfig');
      await setDoc(settingsRef, {
        backgroundConfig: this.getBackgroundConfig(),
        customLogo: this.getCustomLogo(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Failed seeding settings to firestore:', err);
    }
  }

  private async seedEmployeesToFirestore() {
    try {
      // Seed first batch or individual admins
      const batch = writeBatch(db);
      for (const emp of INITIAL_EMPLOYEES.slice(0, 30)) {
        const ref = doc(db, 'employees', emp.eid);
        batch.set(ref, emp);
      }
      await batch.commit();

      if (INITIAL_EMPLOYEES.length > 30) {
        const batch2 = writeBatch(db);
        for (const emp of INITIAL_EMPLOYEES.slice(30)) {
          const ref = doc(db, 'employees', emp.eid);
          batch2.set(ref, emp);
        }
        await batch2.commit();
      }
    } catch (err) {
      console.warn('Failed seeding employees to firestore:', err);
    }
  }

  // --- Local getters/savers ---
  private saveLocalApps(apps: AppItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    } catch (e) {
      console.error('Error saving local apps:', e);
    }
  }

  public getApps(): AppItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(INITIAL_APPS));
        return INITIAL_APPS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_APPS;
    }
  }

  public async saveApps(apps: AppItem[]) {
    this.saveLocalApps(apps);
    this.notify();
  }

  public addApp(app: Omit<AppItem, 'id' | 'createdAt'>): AppItem {
    const apps = this.getApps();
    const newApp: AppItem = {
      ...app,
      id: `app-custom-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      order: apps.length + 1,
    };
    apps.push(newApp);
    this.saveLocalApps(apps);
    this.notify();

    // Persist to Firestore
    const appRef = doc(db, 'apps', newApp.id);
    setDoc(appRef, newApp).catch((error) => {
      handleFirestoreError(error, OperationType.CREATE, `apps/${newApp.id}`);
    });

    return newApp;
  }

  public updateApp(id: string, updated: Partial<AppItem>): boolean {
    const apps = this.getApps();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const merged = { ...apps[index], ...updated };
    apps[index] = merged;
    this.saveLocalApps(apps);
    this.notify();

    // Persist to Firestore
    const appRef = doc(db, 'apps', id);
    setDoc(appRef, merged, { merge: true }).catch((error) => {
      handleFirestoreError(error, OperationType.UPDATE, `apps/${id}`);
    });

    return true;
  }

  public deleteApp(id: string): boolean {
    const apps = this.getApps();
    const filtered = apps.filter((a) => a.id !== id);
    if (filtered.length === apps.length) return false;

    this.saveLocalApps(filtered);
    this.notify();

    // Delete in Firestore
    const appRef = doc(db, 'apps', id);
    deleteDoc(appRef).catch((error) => {
      handleFirestoreError(error, OperationType.DELETE, `apps/${id}`);
    });

    return true;
  }

  // --- Categories ---
  private saveLocalCategories(categories: AppCategory[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving local categories:', e);
    }
  }

  public getCategories(): AppCategory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public addCategory(name: string): AppCategory {
    const list = this.getCategories();
    const newCat: AppCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      order: list.length + 1,
    };
    list.push(newCat);
    this.saveLocalCategories(list);
    this.notify();

    // Firestore
    const catRef = doc(db, 'categories', newCat.id);
    setDoc(catRef, newCat).catch((error) => {
      handleFirestoreError(error, OperationType.CREATE, `categories/${newCat.id}`);
    });

    return newCat;
  }

  public renameCategory(id: string, newName: string): boolean {
    const list = this.getCategories();
    const target = list.find((c) => c.id === id);
    if (!target) return false;

    const oldName = target.name;
    target.name = newName.trim();
    this.saveLocalCategories(list);

    // Update in Firestore
    const catRef = doc(db, 'categories', id);
    setDoc(catRef, { name: newName.trim() }, { merge: true }).catch((error) => {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    });

    // Automatically update apps assigned to this category
    const apps = this.getApps();
    let updatedApps = false;
    apps.forEach((app) => {
      if (app.category === oldName) {
        app.category = newName.trim();
        updatedApps = true;
        // Update app in Firestore
        const appRef = doc(db, 'apps', app.id);
        setDoc(appRef, { category: newName.trim() }, { merge: true }).catch(() => {});
      }
    });

    if (updatedApps) {
      this.saveLocalApps(apps);
    }
    this.notify();
    return true;
  }

  public deleteCategory(id: string): boolean {
    const list = this.getCategories();
    const target = list.find((c) => c.id === id);
    if (!target) return false;

    const oldName = target.name;
    const filtered = list.filter((c) => c.id !== id);
    this.saveLocalCategories(filtered);

    // Delete in Firestore
    const catRef = doc(db, 'categories', id);
    deleteDoc(catRef).catch((error) => {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    });

    // Reassign apps of deleted category to 'General'
    const apps = this.getApps();
    let updatedApps = false;
    apps.forEach((app) => {
      if (app.category === oldName) {
        app.category = 'General';
        updatedApps = true;
        const appRef = doc(db, 'apps', app.id);
        setDoc(appRef, { category: 'General' }, { merge: true }).catch(() => {});
      }
    });

    if (updatedApps) {
      this.saveLocalApps(apps);
    }
    this.notify();
    return true;
  }

  public resetAppsToDefault(): AppItem[] {
    this.saveLocalApps(INITIAL_APPS);
    this.saveLocalCategories(INITIAL_CATEGORIES);
    this.seedAppsToFirestore();
    this.seedCategoriesToFirestore();
    this.notify();
    return INITIAL_APPS;
  }

  // --- Notices ---
  private saveLocalNotices(notices: Notice[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    } catch (e) {
      console.error('Error saving local notices:', e);
    }
  }

  public getNotices(): Notice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTICES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
        return INITIAL_NOTICES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTICES;
    }
  }

  public addNotice(title: string, content: string, author: string, isImportant = false): Notice {
    const notices = this.getNotices();
    const newNotice: Notice = {
      id: `notice-${Date.now()}`,
      title,
      content,
      author,
      isImportant,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    };
    notices.unshift(newNotice);
    this.saveLocalNotices(notices);
    this.notify();

    // Firestore
    const noticeRef = doc(db, 'notices', newNotice.id);
    setDoc(noticeRef, newNotice).catch((error) => {
      handleFirestoreError(error, OperationType.CREATE, `notices/${newNotice.id}`);
    });

    return newNotice;
  }

  public deleteNotice(id: string): boolean {
    const notices = this.getNotices();
    const filtered = notices.filter((n) => n.id !== id);
    if (filtered.length === notices.length) return false;

    this.saveLocalNotices(filtered);
    this.notify();

    // Firestore
    const noticeRef = doc(db, 'notices', id);
    deleteDoc(noticeRef).catch((error) => {
      handleFirestoreError(error, OperationType.DELETE, `notices/${id}`);
    });

    return true;
  }

  // --- Background Config ---
  private saveLocalBackgroundConfig(config: BackgroundConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving local background config:', e);
    }
  }

  public getBackgroundConfig(): BackgroundConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BACKGROUND_CONFIG);
      return data ? JSON.parse(data) : DEFAULT_BG_CONFIG;
    } catch {
      return DEFAULT_BG_CONFIG;
    }
  }

  public saveBackgroundConfig(config: BackgroundConfig) {
    this.saveLocalBackgroundConfig(config);
    this.notify();

    // Firestore
    const settingsRef = doc(db, 'settings', 'portalConfig');
    setDoc(
      settingsRef,
      {
        backgroundConfig: config,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch((error) => {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/portalConfig');
    });
  }

  // --- Custom Logo ---
  private saveLocalCustomLogo(logoDataUrl: string | null) {
    try {
      if (logoDataUrl) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LOGO, logoDataUrl);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_LOGO);
      }
    } catch (e) {
      console.error('Error saving local logo:', e);
    }
  }

  public getCustomLogo(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.CUSTOM_LOGO);
    } catch {
      return null;
    }
  }

  public saveCustomLogo(logoDataUrl: string | null) {
    this.saveLocalCustomLogo(logoDataUrl);
    this.notify();

    // Firestore
    const settingsRef = doc(db, 'settings', 'portalConfig');
    setDoc(
      settingsRef,
      {
        customLogo: logoDataUrl,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch((error) => {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/portalConfig');
    });
  }

  // --- Employees & Auth ---
  private saveLocalEmployees(employees: Employee[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error('Error saving local employees:', e);
    }
  }

  public getEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
        return INITIAL_EMPLOYEES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EMPLOYEES;
    }
  }

  public getEmployeeByEid(eid: string): Employee | undefined {
    const list = this.getEmployees();
    return list.find((emp) => emp.eid.trim().toLowerCase() === eid.trim().toLowerCase());
  }

  public updateEmployeePassword(eid: string, newPassword: string): boolean {
    const employees = this.getEmployees();
    const index = employees.findIndex((emp) => emp.eid === eid);
    if (index === -1) return false;

    employees[index].password = newPassword;
    employees[index].isPasswordChanged = true;
    this.saveLocalEmployees(employees);

    // Update active session if currently logged in
    const session = this.getSession();
    if (session && session.eid === eid) {
      session.isPasswordChanged = true;
      this.saveSession(session);
    }

    // Persist to Firestore
    const empRef = doc(db, 'employees', eid);
    setDoc(
      empRef,
      {
        password: newPassword,
        isPasswordChanged: true,
      },
      { merge: true }
    ).catch((error) => {
      handleFirestoreError(error, OperationType.UPDATE, `employees/${eid}`);
    });

    this.notify();
    return true;
  }

  public resetEmployeePasswordToDefault(eid: string): boolean {
    const employees = this.getEmployees();
    const index = employees.findIndex((emp) => emp.eid === eid);
    if (index === -1) return false;

    employees[index].password = eid;
    employees[index].isPasswordChanged = false;
    this.saveLocalEmployees(employees);

    // Persist to Firestore
    const empRef = doc(db, 'employees', eid);
    setDoc(
      empRef,
      {
        password: eid,
        isPasswordChanged: false,
      },
      { merge: true }
    ).catch((error) => {
      handleFirestoreError(error, OperationType.UPDATE, `employees/${eid}`);
    });

    this.notify();
    return true;
  }

  // --- Session Management ---
  public getSession(): UserSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public saveSession(session: UserSession | null) {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  }

  public getRememberedEid(): string {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EID) || '';
  }

  public setRememberedEid(eid: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EID, eid);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EID);
    }
  }

  public resetAllData() {
    this.saveLocalEmployees(INITIAL_EMPLOYEES);
    this.saveLocalApps(INITIAL_APPS);
    this.saveLocalNotices(INITIAL_NOTICES);
    this.saveLocalCategories(INITIAL_CATEGORIES);
    this.seedAppsToFirestore();
    this.seedCategoriesToFirestore();
    this.seedNoticesToFirestore();
    this.seedEmployeesToFirestore();
    this.notify();
  }
}

export const storage = new StorageService();
