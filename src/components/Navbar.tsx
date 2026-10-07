import React from 'react';
import {
  LogOut,
  User,
  Shield,
  Bell,
  ExternalLink,
  PlusCircle,
  Image as ImageIcon,
  Edit3,
} from 'lucide-react';
import { LeedoLogo } from './LeedoLogo';
import { UserSession } from '../types';

interface NavbarProps {
  session: UserSession;
  isHr: boolean;
  editMode: boolean;
  onToggleEditMode: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenAddApp?: () => void;
  onOpenHrPanel?: () => void;
  onOpenBgSettings: () => void;
  onScrollToNotices: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  isHr,
  editMode,
  onToggleEditMode,
  onLogout,
  onOpenProfile,
  onOpenAddApp,
  onOpenHrPanel,
  onOpenBgSettings,
  onScrollToNotices,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Left: Organization Branding */}
        <div className="flex items-center gap-3">
          <LeedoLogo size="sm" layout="horizontal" showSubtitle={false} />
        </div>

        {/* Center / Quick Links */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
          <button
            onClick={onScrollToNotices}
            className="flex items-center gap-1.5 hover:text-[#0f5b87] transition-colors py-1 cursor-pointer"
          >
            <Bell size={15} className="text-[#0f5b87]" />
            <span>Notice Board</span>
          </button>

          {/* Background Customizer button */}
          <button
            onClick={onOpenBgSettings}
            className="flex items-center gap-1.5 hover:text-[#0f5b87] transition-colors py-1 cursor-pointer bg-slate-100/80 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-slate-700"
            title="Change background cover photo & blur"
          >
            <ImageIcon size={14} className="text-[#0f5b87]" />
            <span>কভার ফটো (Background)</span>
          </button>

          <a
            href="https://leedobd.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#0f5b87] transition-colors py-1 cursor-pointer"
          >
            <ExternalLink size={14} className="text-slate-500" />
            <span>Website</span>
          </a>

          {isHr && onOpenAddApp && (
            <button
              onClick={onOpenAddApp}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-2.5 py-1.5 rounded-lg border border-blue-200 transition-all cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>+ Add App</span>
            </button>
          )}

          {isHr && (
            <button
              onClick={onToggleEditMode}
              className={`flex items-center gap-1.5 font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                editMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
              title="Toggle Edit / Delete buttons on all apps"
            >
              <Edit3 size={14} className={editMode ? 'text-amber-700' : 'text-slate-600'} />
              <span>{editMode ? 'Done Editing' : 'Edit Apps'}</span>
            </button>
          )}

          {isHr && onOpenHrPanel && (
            <button
              onClick={onOpenHrPanel}
              className="flex items-center gap-1.5 bg-[#0b486b] text-white hover:bg-[#07324c] font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              <Shield size={14} className="text-amber-300" />
              <span>HR Hub</span>
            </button>
          )}
        </div>

        {/* Right: User Profile, BG mobile icon & Log Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Background Settings button */}
          <button
            onClick={onOpenBgSettings}
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            title="Change background cover photo"
          >
            <ImageIcon size={16} />
          </button>

          {/* User Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors border border-slate-200 cursor-pointer group text-left"
            title="View my employee profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#0f5b87] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {session.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                <span>{session.name}</span>
                {isHr && (
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded font-mono">
                    HR
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 leading-none">
                EID: {session.eid}
              </div>
            </div>
          </button>

          {/* Log Out Button */}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-full border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
