import React from 'react';
import { LogOut, Bell, ExternalLink } from 'lucide-react';
import { LeedoLogo } from './LeedoLogo';
import { UserSession } from '../types';

interface NavbarProps {
  session: UserSession;
  isHr: boolean;
  logoSrc?: string | null;
  onLogout: () => void;
  onOpenProfile: () => void;
  onScrollToNotices: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  isHr,
  logoSrc,
  onLogout,
  onOpenProfile,
  onScrollToNotices,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Left: Organization Branding */}
        <div className="flex items-center gap-3">
          <LeedoLogo size="sm" layout="horizontal" showSubtitle={false} logoSrc={logoSrc} />
        </div>

        {/* Center: Clean general links */}
        <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-600">
          <button
            onClick={onScrollToNotices}
            className="flex items-center gap-1.5 hover:text-[#0f5b87] transition-colors py-1 cursor-pointer"
          >
            <Bell size={15} className="text-[#0f5b87]" />
            <span>Notice Board</span>
          </button>

          <a
            href="https://leedobd.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#0f5b87] transition-colors py-1 cursor-pointer"
          >
            <ExternalLink size={14} className="text-slate-500" />
            <span>LEEDO Website</span>
          </a>
        </div>

        {/* Right: User Profile & Log Out */}
        <div className="flex items-center gap-3">
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
            className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
