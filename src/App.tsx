import React, { useState, useEffect } from 'react';
import { GeometricBackground } from './components/GeometricBackground';
import { LoginForm } from './components/LoginForm';
import { Navbar } from './components/Navbar';
import { AppCard } from './components/AppCard';
import { NoticeBoard } from './components/NoticeBoard';
import { FirstTimePasswordModal } from './components/FirstTimePasswordModal';
import { MyProfileModal } from './components/MyProfileModal';
import { AddAppModal } from './components/AddAppModal';
import { EditAppModal } from './components/EditAppModal';
import { HrAdminPanel } from './components/HrAdminPanel';
import { BackgroundSettingsModal } from './components/BackgroundSettingsModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { LogoManagerModal } from './components/LogoManagerModal';
import { storage } from './services/storage';
import { AppItem, Notice, UserSession, BackgroundConfig, AppCategory } from './types';
import {
  Plus,
  ExternalLink,
  Edit3,
  Image as ImageIcon,
  Shield,
  Layers,
  Folder,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Requirement: "surutei jeno login chay sei bebosta rakun"
  // Default to null so user MUST log in each time they open the application
  const [session, setSession] = useState<UserSession | null>(null);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<AppCategory[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>(storage.getBackgroundConfig());
  const [customLogo, setCustomLogo] = useState<string | null>(storage.getCustomLogo());

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [isFirstTimeModalOpen, setIsFirstTimeModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [isHrPanelOpen, setIsHrPanelOpen] = useState(false);
  const [isBgSettingsOpen, setIsBgSettingsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  // HR quick edit mode for dashboard cards
  const [editMode, setEditMode] = useState(false);

  const [redirectToast, setRedirectToast] = useState<{
    title: string;
    url: string;
  } | null>(null);

  // Initialize apps, categories and notices on mount & subscribe to Firestore cloud updates
  useEffect(() => {
    const syncData = () => {
      setApps(storage.getApps());
      setCategories(storage.getCategories());
      setNotices(storage.getNotices());
      setBgConfig(storage.getBackgroundConfig());
      setCustomLogo(storage.getCustomLogo());
    };

    syncData();
    const unsubscribe = storage.subscribe(syncData);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (newSession: UserSession, isFirstTime: boolean) => {
    setSession(newSession);
    setApps(storage.getApps());
    setCategories(storage.getCategories());
    setNotices(storage.getNotices());
    setCustomLogo(storage.getCustomLogo());

    if (isFirstTime) {
      setIsFirstTimeModalOpen(true);
    }
  };

  const handleLogout = () => {
    storage.saveSession(null);
    setSession(null);
    setEditMode(false);
    setIsFirstTimeModalOpen(false);
    setIsProfileModalOpen(false);
    setIsAddAppModalOpen(false);
    setIsHrPanelOpen(false);
    setIsCategoryModalOpen(false);
    setIsBgSettingsOpen(false);
    setIsLogoModalOpen(false);
    setEditingApp(null);
  };

  const handlePasswordChanged = (updatedSession: UserSession) => {
    setSession(updatedSession);
    setIsFirstTimeModalOpen(false);
  };

  // Opening an app link:
  // "normal users link e click kore direct redirect hobe."
  const handleOpenApp = (app: AppItem) => {
    setRedirectToast({ title: app.title, url: app.url });

    try {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } catch {
      // In case popup is blocked, the user can click the toast fallback
    }

    setTimeout(() => {
      setRedirectToast((curr) => (curr?.url === app.url ? null : curr));
    }, 4500);
  };

  // HR Add App
  const handleAddApp = (newApp: Omit<AppItem, 'id' | 'createdAt'>) => {
    storage.addApp(newApp);
    setApps(storage.getApps());
  };

  // HR Edit App
  const handleSaveEditedApp = (appId: string, updated: Partial<AppItem>) => {
    storage.updateApp(appId, updated);
    setApps(storage.getApps());
    setEditingApp(null);
  };

  // HR Delete App
  const handleDeleteApp = (appId: string) => {
    storage.deleteApp(appId);
    setApps(storage.getApps());
  };

  // Category management handlers
  const handleAddCategory = (name: string) => {
    storage.addCategory(name);
    setCategories(storage.getCategories());
  };

  const handleRenameCategory = (id: string, newName: string) => {
    storage.renameCategory(id, newName);
    setCategories(storage.getCategories());
    setApps(storage.getApps());
  };

  const handleDeleteCategory = (id: string) => {
    storage.deleteCategory(id);
    setCategories(storage.getCategories());
    setApps(storage.getApps());
  };

  const handleResetCategories = () => {
    storage.resetAppsToDefault();
    setCategories(storage.getCategories());
    setApps(storage.getApps());
  };

  // Background config update
  const handleSaveBgConfig = (newConfig: BackgroundConfig) => {
    storage.saveBackgroundConfig(newConfig);
    setBgConfig(newConfig);
  };

  // Logo update handler
  const handleSaveLogo = (logoDataUrl: string | null) => {
    storage.saveCustomLogo(logoDataUrl);
    setCustomLogo(logoDataUrl);
  };

  // Notices
  const handleAddNotice = (title: string, content: string, isImportant: boolean) => {
    if (!session) return;
    const authorName = `${session.name} (${session.designation})`;
    storage.addNotice(title, content, authorName, isImportant);
    setNotices(storage.getNotices());
  };

  const handleDeleteNotice = (id: string) => {
    storage.deleteNotice(id);
    setNotices(storage.getNotices());
  };

  const handleScrollToNotices = () => {
    const el = document.getElementById('notice-board-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isHr = session?.role === 'admin';

  // Grouped apps calculation based on categories
  const displayedCategories =
    selectedCategory === 'all'
      ? categories
      : categories.filter((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());

  // If not logged in, ALWAYS show Login Screen
  if (!session) {
    return (
      <GeometricBackground config={bgConfig}>
        <LoginForm onLoginSuccess={handleLoginSuccess} logoSrc={customLogo} />
      </GeometricBackground>
    );
  }

  return (
    <GeometricBackground config={bgConfig}>
      {/* Top Navbar: Clean & Uncluttered for all users */}
      <Navbar
        session={session}
        isHr={isHr}
        logoSrc={customLogo}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onScrollToNotices={handleScrollToNotices}
      />

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Personalized Greeting banner matching Screenshot 2 */}
        <div className="mb-6 text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Hello {session.name}. {getGreeting()}!
          </h1>
          <p className="text-white/85 text-xs sm:text-sm mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Welcome to the LEEDO Employee Portal. Click any application icon to launch.
          </p>
        </div>

        {/* Unified, Single HR Management Bar (Only 1 place for each option!) */}
        {isHr && (
          <div className="mb-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f5b87] text-white flex items-center justify-center font-bold shadow-xs">
                HR
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span>HR Administrator Controls</span>
                  {editMode && (
                    <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">
                      Edit Mode Active
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-600">
                  Manage app links, rename categories, delete apps, and customize logo or cover photo.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => setIsAddAppModalOpen(true)}
                className="px-3 py-1.5 bg-[#0f5b87] hover:bg-[#0b486b] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Add App</span>
              </button>

              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                title="Rename and manage categories"
              >
                <Layers size={13} className="text-[#0f5b87]" />
                <span>Rename Categories</span>
              </button>

              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  editMode
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Edit3 size={13} />
                <span>{editMode ? 'Finish Editing' : 'Edit / Delete Apps'}</span>
              </button>

              <button
                onClick={() => setIsLogoModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                title="Change or upload organization logo"
              >
                <Sparkles size={13} className="text-[#0f5b87]" />
                <span>Change Logo</span>
              </button>

              <button
                onClick={() => setIsBgSettingsOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                title="Change cover photo and blur effect"
              >
                <ImageIcon size={13} className="text-[#0f5b87]" />
                <span>Cover Photo</span>
              </button>

              <button
                onClick={() => setIsHrPanelOpen(true)}
                className="px-3 py-1.5 bg-[#0b486b] hover:bg-[#07324c] text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Shield size={13} className="text-amber-300" />
                <span>HR Hub</span>
              </button>
            </div>
          </div>
        )}

        {/* Category Filter Pills Bar (Clean, no duplicate buttons) */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#0f5b87] shadow-lg ring-2 ring-white/60'
                  : 'bg-white/40 hover:bg-white/60 text-white backdrop-blur-xs'
              }`}
            >
              <span>সকল অ্যাপস (All Apps)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === 'all'
                    ? 'bg-blue-100 text-[#0f5b87]'
                    : 'bg-black/20 text-white'
                }`}
              >
                {apps.length}
              </span>
            </button>

            {categories.map((cat) => {
              const catAppsCount = apps.filter((a) => a.category === cat.name).length;
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-[#0f5b87] shadow-lg ring-2 ring-white/60'
                      : 'bg-white/40 hover:bg-white/60 text-white backdrop-blur-xs'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-blue-100 text-[#0f5b87]'
                        : 'bg-black/20 text-white'
                    }`}
                  >
                    {catAppsCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categorized Apps Sections */}
        <div className="space-y-10">
          {displayedCategories.map((cat) => {
            const catApps = apps.filter(
              (a) => (a.category || 'General').toLowerCase() === cat.name.toLowerCase()
            );

            // If selected 'all' and a category has 0 apps and user is not in edit mode, hide empty section
            if (selectedCategory === 'all' && catApps.length === 0 && !editMode) {
              return null;
            }

            return (
              <section
                key={cat.id}
                className="bg-black/15 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-white/20 shadow-md animate-fadeIn"
              >
                {/* Clean Category Header (No duplicate buttons) */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                      <Folder size={17} />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm tracking-wide">
                        {cat.name}
                      </h2>
                      <span className="text-xs bg-white/30 text-white font-mono px-2 py-0.5 rounded-full font-semibold">
                        {catApps.length} {catApps.length === 1 ? 'app' : 'apps'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid of Apps in this Category */}
                {catApps.length === 0 ? (
                  <div className="py-8 text-center text-white/70 text-xs italic">
                    এই ক্যাটাগরিতে এখনও কোনো অ্যাপ নেই (No apps in this category yet).
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-8 gap-x-6 sm:gap-x-10 justify-items-center">
                    {catApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        isHr={isHr}
                        editMode={editMode}
                        onOpenApp={handleOpenApp}
                        onEditApp={isHr ? (a) => setEditingApp(a) : undefined}
                        onDeleteApp={isHr ? handleDeleteApp : undefined}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Notice Board Section matching Screenshot 2 */}
        <NoticeBoard
          notices={notices}
          isHr={isHr}
          onAddNotice={isHr ? handleAddNotice : undefined}
          onDeleteNotice={isHr ? handleDeleteNotice : undefined}
        />
      </main>

      {/* Footer Branding */}
      <footer className="py-6 text-center text-xs text-white/85 border-t border-white/10 select-none">
        <p className="font-semibold drop-shadow-xs">
          LEEDO - Local Education and Economic Development Organization
        </p>
        <p className="text-white/65 text-[11px] mt-0.5">
          Empowering Street Children & Marginalized Communities in Bangladesh
        </p>
      </footer>

      {/* Direct Redirect Toast notification */}
      {redirectToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn max-w-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ExternalLink size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">
              Opening {redirectToast.title}...
            </div>
            <div className="text-[11px] text-slate-300 font-mono truncate">
              {redirectToast.url}
            </div>
          </div>
          <a
            href={redirectToast.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold underline shrink-0 cursor-pointer"
          >
            Open now
          </a>
        </div>
      )}

      {/* Mandatory First-Time Password Change Modal */}
      {isFirstTimeModalOpen && session && (
        <FirstTimePasswordModal
          session={session}
          onPasswordChanged={handlePasswordChanged}
        />
      )}

      {/* My Profile Modal (Private to the user) */}
      {isProfileModalOpen && session && (
        <MyProfileModal
          session={session}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onPasswordUpdated={(updated) => setSession(updated)}
        />
      )}

      {/* HR Add App Modal */}
      {isHr && (
        <AddAppModal
          isOpen={isAddAppModalOpen}
          onClose={() => setIsAddAppModalOpen(false)}
          categories={categories}
          onAddApp={handleAddApp}
        />
      )}

      {/* HR Edit App Modal */}
      {isHr && (
        <EditAppModal
          app={editingApp}
          isOpen={!!editingApp}
          onClose={() => setEditingApp(null)}
          categories={categories}
          onSave={handleSaveEditedApp}
        />
      )}

      {/* HR Category Manager Modal */}
      {isHr && (
        <CategoryManagerModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          apps={apps}
          onAddCategory={handleAddCategory}
          onRenameCategory={handleRenameCategory}
          onDeleteCategory={handleDeleteCategory}
          onResetCategories={handleResetCategories}
        />
      )}

      {/* HR Logo Manager Modal (HR Only) */}
      {isHr && (
        <LogoManagerModal
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
          currentLogo={customLogo}
          onSaveLogo={handleSaveLogo}
        />
      )}

      {/* Background Settings Modal (HR Only) */}
      {isHr && (
        <BackgroundSettingsModal
          isOpen={isBgSettingsOpen}
          onClose={() => setIsBgSettingsOpen(false)}
          config={bgConfig}
          onSaveConfig={handleSaveBgConfig}
        />
      )}

      {/* HR Control Hub */}
      {isHr && (
        <HrAdminPanel
          isOpen={isHrPanelOpen}
          onClose={() => setIsHrPanelOpen(false)}
          apps={apps}
          onOpenAddApp={() => {
            setIsHrPanelOpen(false);
            setIsAddAppModalOpen(true);
          }}
          onEditApp={(app) => {
            setIsHrPanelOpen(false);
            setEditingApp(app);
          }}
          onDeleteApp={handleDeleteApp}
          onRefreshApps={() => setApps(storage.getApps())}
        />
      )}
    </GeometricBackground>
  );
}
