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
import { storage } from './services/storage';
import { AppItem, Notice, UserSession, BackgroundConfig } from './types';
import { Plus, ExternalLink, Edit3, Image as ImageIcon, RotateCcw, Shield } from 'lucide-react';

export default function App() {
  // Requirement: "surutei jeno login chay sei bebosta rakun"
  // Default to null so user MUST log in each time they open the application
  const [session, setSession] = useState<UserSession | null>(null);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>(storage.getBackgroundConfig());
  
  // Modals state
  const [isFirstTimeModalOpen, setIsFirstTimeModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [isHrPanelOpen, setIsHrPanelOpen] = useState(false);
  const [isBgSettingsOpen, setIsBgSettingsOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  
  // HR quick edit mode for dashboard cards
  const [editMode, setEditMode] = useState(false);

  const [redirectToast, setRedirectToast] = useState<{
    title: string;
    url: string;
  } | null>(null);

  // Initialize apps and notices on mount (but keep session null until user logs in)
  useEffect(() => {
    setApps(storage.getApps());
    setNotices(storage.getNotices());
    setBgConfig(storage.getBackgroundConfig());
  }, []);

  const handleLoginSuccess = (newSession: UserSession, isFirstTime: boolean) => {
    setSession(newSession);
    setApps(storage.getApps());
    setNotices(storage.getNotices());

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
    setEditingApp(null);
  };

  const handlePasswordChanged = (updatedSession: UserSession) => {
    setSession(updatedSession);
    setIsFirstTimeModalOpen(false);
  };

  // Opening an app link:
  // "jekhane apps gulor icon show korbe r icon e clinic korle or bitore ekta link thakbe, sei link diye r ekta web page open hobe."
  // "normal users link e click kore direct redirect hobe."
  const handleOpenApp = (app: AppItem) => {
    setRedirectToast({ title: app.title, url: app.url });

    // Open target link in new window/tab
    try {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } catch {
      // In case popup is blocked, the user can click the toast fallback
    }

    // Auto dismiss toast after 4.5s
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

  // HR Restore Default Apps
  const handleResetApps = () => {
    if (window.confirm('Reset all apps to original LEEDO default list?')) {
      const reset = storage.resetAppsToDefault();
      setApps(reset);
    }
  };

  // Background config update
  const handleSaveBgConfig = (newConfig: BackgroundConfig) => {
    storage.saveBackgroundConfig(newConfig);
    setBgConfig(newConfig);
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

  // Time-based greeting like screenshot 2
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isHr = session?.role === 'admin';

  // If not logged in, ALWAYS show Login Screen with background
  if (!session) {
    return (
      <GeometricBackground config={bgConfig}>
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onOpenBgSettings={() => setIsBgSettingsOpen(true)}
        />
        {/* Background Settings Modal also accessible from login page */}
        <BackgroundSettingsModal
          isOpen={isBgSettingsOpen}
          onClose={() => setIsBgSettingsOpen(false)}
          config={bgConfig}
          onSaveConfig={handleSaveBgConfig}
        />
      </GeometricBackground>
    );
  }

  return (
    <GeometricBackground config={bgConfig}>
      {/* Top Navbar */}
      <Navbar
        session={session}
        isHr={isHr}
        editMode={editMode}
        onToggleEditMode={() => setEditMode(!editMode)}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAddApp={isHr ? () => setIsAddAppModalOpen(true) : undefined}
        onOpenHrPanel={isHr ? () => setIsHrPanelOpen(true) : undefined}
        onOpenBgSettings={() => setIsBgSettingsOpen(true)}
        onScrollToNotices={handleScrollToNotices}
      />

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Personalized Greeting banner matching Screenshot 2 */}
        <div className="mb-8 text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Hello {session.name}. {getGreeting()}!
          </h1>
          <p className="text-white/85 text-xs sm:text-sm mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Welcome to the LEEDO Employee Portal. Click any application icon to launch.
          </p>
        </div>

        {/* HR Dashboard Management Bar if Admin */}
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
                  You can add new apps, change links, delete apps, and customize cover photo.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => setIsAddAppModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#0f5b87] hover:bg-[#0b486b] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Add App</span>
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

        {/* Apps Grid - styled exactly as Screenshot 2 */}
        <div className="flex-1 flex flex-col items-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-10 gap-x-6 sm:gap-x-10 max-w-5xl justify-items-center">
            {apps.map((app) => (
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

            {/* HR "+ Add App" tile inside grid */}
            {isHr && (
              <div
                onClick={() => setIsAddAppModalOpen(true)}
                className="flex flex-col items-center group select-none w-36 sm:w-40 cursor-pointer"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/80 hover:bg-white rounded-2xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center border-2 border-dashed border-white/90 transition-all duration-200 transform group-hover:-translate-y-1.5 text-[#0f5b87]">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-[#0f5b87]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold mt-1 text-[#0f5b87]">Add App</span>
                </div>
                <div className="mt-2.5 text-center px-1">
                  <p className="text-white text-xs sm:text-sm font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    + Add New App
                  </p>
                </div>
              </div>
            )}
          </div>
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
          onAddApp={handleAddApp}
        />
      )}

      {/* HR Edit App Modal */}
      {isHr && (
        <EditAppModal
          app={editingApp}
          isOpen={!!editingApp}
          onClose={() => setEditingApp(null)}
          onSave={handleSaveEditedApp}
        />
      )}

      {/* Background Settings Modal */}
      <BackgroundSettingsModal
        isOpen={isBgSettingsOpen}
        onClose={() => setIsBgSettingsOpen(false)}
        config={bgConfig}
        onSaveConfig={handleSaveBgConfig}
      />

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
