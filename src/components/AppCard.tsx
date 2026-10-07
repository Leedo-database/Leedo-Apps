import React, { useState } from 'react';
import { Edit3, Trash2, ArrowUpRight, ExternalLink } from 'lucide-react';
import { AppItem } from '../types';
import { AppIcon } from './AppIcon';

interface AppCardProps {
  app: AppItem;
  isHr: boolean;
  editMode?: boolean;
  onOpenApp: (app: AppItem) => void;
  onEditApp?: (app: AppItem) => void;
  onDeleteApp?: (appId: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  isHr,
  editMode = false,
  onOpenApp,
  onEditApp,
  onDeleteApp,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // If clicking edit or delete buttons, don't trigger app open
    if ((e.target as HTMLElement).closest('.admin-action-btn')) {
      return;
    }
    onOpenApp(app);
  };

  const showHrToolbar = isHr && (isHovered || editMode);

  return (
    <div
      className="flex flex-col items-center group relative select-none w-36 sm:w-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The White Rounded Tile with Icon */}
      <div
        onClick={handleClick}
        className={`w-24 h-24 sm:w-28 sm:h-28 bg-white hover:bg-white rounded-2xl shadow-lg hover:shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-200 transform group-hover:-translate-y-1.5 group-active:translate-y-0 border relative overflow-hidden ${
          editMode && isHr
            ? 'border-blue-400 ring-2 ring-blue-400/50'
            : 'border-white/60'
        }`}
      >
        {/* Subtle accent highlight on hover */}
        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors pointer-events-none" />

        {/* The Icon */}
        <div className="text-slate-800 group-hover:text-[#0f5b87] transition-colors flex items-center justify-center">
          <AppIcon name={app.icon} size={42} />
        </div>

        {/* External link indicator pill */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 rounded-full p-1 text-slate-500">
          <ArrowUpRight size={13} />
        </div>

        {/* HR quick badge if custom */}
        {app.isCustom && (
          <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-mono">
            CUSTOM
          </span>
        )}
      </div>

      {/* App Title underneath */}
      <div
        onClick={handleClick}
        className="mt-2.5 text-center px-1 cursor-pointer w-full"
      >
        <p className="text-white text-xs sm:text-sm font-semibold leading-tight line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] group-hover:text-blue-100 transition-colors">
          {app.title}
        </p>
      </div>

      {/* HR Admin Quick Action Toolbar */}
      {showHrToolbar && (
        <div className="absolute -top-3.5 right-1 z-30 flex items-center gap-1 bg-white p-1 rounded-xl shadow-xl border border-blue-200 admin-action-btn animate-fadeIn">
          {onEditApp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditApp(app);
              }}
              className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold"
              title="Edit App Details & Link"
            >
              <Edit3 size={13} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          {onDeleteApp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${app.title}" from dashboard?`)) {
                  onDeleteApp(app.id);
                }
              }}
              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold"
              title="Delete App"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Del</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
