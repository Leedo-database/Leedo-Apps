import { Employee, AppItem, Notice, UserSession, BackgroundConfig } from '../types';
import { INITIAL_EMPLOYEES } from '../data/employees';
import { INITIAL_APPS } from '../data/defaultApps';
import { INITIAL_NOTICES } from '../data/notices';

const STORAGE_KEYS = {
  EMPLOYEES: 'leedo_employees_v1',
  APPS: 'leedo_apps_v1',
  NOTICES: 'leedo_notices_v1',
  CURRENT_SESSION: 'leedo_current_session_v1',
  REMEMBERED_EID: 'leedo_remembered_eid_v1',
  BACKGROUND_CONFIG: 'leedo_background_config_v1',
  CUSTOM_LOGO: 'leedo_custom_logo_v1',
};

const DEFAULT_BG_CONFIG: BackgroundConfig = {
  type: 'pattern',
  imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop',
  blur: 8,
  dim: 45,
  overlayColor: '#0c354e',
};

export const storage = {
  getEmployees(): Employee[] {
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
  },

  saveEmployees(employees: Employee[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error('Error saving employees:', e);
    }
  },

  getEmployeeByEid(eid: string): Employee | undefined {
    const list = this.getEmployees();
    return list.find((emp) => emp.eid.trim().toLowerCase() === eid.trim().toLowerCase());
  },

  updateEmployeePassword(eid: string, newPassword: string): boolean {
    const employees = this.getEmployees();
    const index = employees.findIndex((emp) => emp.eid === eid);
    if (index === -1) return false;

    employees[index].password = newPassword;
    employees[index].isPasswordChanged = true;
    this.saveEmployees(employees);

    // Update active session if currently logged in
    const session = this.getSession();
    if (session && session.eid === eid) {
      session.isPasswordChanged = true;
      this.saveSession(session);
    }
    return true;
  },

  // Reset password to default EID (HR admin feature)
  resetEmployeePasswordToDefault(eid: string): boolean {
    const employees = this.getEmployees();
    const index = employees.findIndex((emp) => emp.eid === eid);
    if (index === -1) return false;

    employees[index].password = eid;
    employees[index].isPasswordChanged = false;
    this.saveEmployees(employees);
    return true;
  },

  getApps(): AppItem[] {
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
  },

  saveApps(apps: AppItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    } catch (e) {
      console.error('Error saving apps:', e);
    }
  },

  addApp(app: Omit<AppItem, 'id' | 'createdAt'>): AppItem {
    const apps = this.getApps();
    const newApp: AppItem = {
      ...app,
      id: `app-custom-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      order: apps.length + 1,
    };
    apps.push(newApp);
    this.saveApps(apps);
    return newApp;
  },

  updateApp(id: string, updated: Partial<AppItem>): boolean {
    const apps = this.getApps();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) return false;

    apps[index] = { ...apps[index], ...updated };
    this.saveApps(apps);
    return true;
  },

  deleteApp(id: string): boolean {
    const apps = this.getApps();
    const filtered = apps.filter((a) => a.id !== id);
    if (filtered.length === apps.length) return false;

    this.saveApps(filtered);
    return true;
  },

  getNotices(): Notice[] {
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
  },

  saveNotices(notices: Notice[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    } catch (e) {
      console.error('Error saving notices:', e);
    }
  },

  addNotice(title: string, content: string, author: string, isImportant = false): Notice {
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
    this.saveNotices(notices);
    return newNotice;
  },

  deleteNotice(id: string): boolean {
    const notices = this.getNotices();
    const filtered = notices.filter((n) => n.id !== id);
    if (filtered.length === notices.length) return false;
    this.saveNotices(filtered);
    return true;
  },

  getSession(): UserSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveSession(session: UserSession | null) {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  },

  getRememberedEid(): string {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EID) || '';
  },

  setRememberedEid(eid: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EID, eid);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EID);
    }
  },

  resetAppsToDefault(): AppItem[] {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(INITIAL_APPS));
    return INITIAL_APPS;
  },

  getBackgroundConfig(): BackgroundConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BACKGROUND_CONFIG);
      return data ? JSON.parse(data) : DEFAULT_BG_CONFIG;
    } catch {
      return DEFAULT_BG_CONFIG;
    }
  },

  saveBackgroundConfig(config: BackgroundConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving background config:', e);
    }
  },

  getCustomLogo(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.CUSTOM_LOGO);
    } catch {
      return null;
    }
  },

  saveCustomLogo(logoDataUrl: string | null) {
    try {
      if (logoDataUrl) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LOGO, logoDataUrl);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_LOGO);
      }
    } catch (e) {
      console.error('Error saving custom logo:', e);
    }
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(INITIAL_APPS));
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
  },
};
