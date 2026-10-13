import React, { useState, useEffect } from 'react';
import { X, Check, Link as LinkIcon, Type, Layers, Sparkles, Search } from 'lucide-react';
import { AppItem, AppCategory } from '../types';
import { AVAILABLE_ICONS, AppIcon } from './AppIcon';

interface EditAppModalProps {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
  categories: AppCategory[];
  onSave: (appId: string, updated: Partial<AppItem>) => void;
}

export const EditAppModal: React.FC<EditAppModalProps> = ({
  app,
  isOpen,
  onClose,
  categories,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('home');
  const [iconSearch, setIconSearch] = useState('');
  const [category, setCategory] = useState('Management');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (app) {
      setTitle(app.title);
      setUrl(app.url);
      setDescription(app.description || '');
      setIcon(app.icon || 'home');
      setCategory(app.category || 'Management');
      setIconSearch('');
      setError(null);
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const filteredIcons = AVAILABLE_ICONS.filter(
    (item) =>
      item.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    let trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError('অ্যাপসের নাম প্রদান করুন (Please enter app name).');
      return;
    }

    if (!trimmedUrl) {
      setError('ওয়েব লিংক প্রদান করুন (Please enter target web link).');
      return;
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    onSave(app.id, {
      title: trimmedTitle,
      url: trimmedUrl,
      description: description.trim(),
      icon,
      category,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f5b87] px-6 py-4.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <AppIcon name={icon} size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base">অ্যাপ সম্পাদনা করুন (Edit App)</h2>
              <p className="text-[11px] text-blue-100">Update app name, icon or destination link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Type size={14} className="text-[#0f5b87]" />
              অ্যাপের নাম (App Name)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <LinkIcon size={14} className="text-[#0f5b87]" />
              ওয়েব লিংক (Web Link / URL)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white font-mono text-xs"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0f5b87]" />
                আইকন নির্বাচন করুন (Icon)
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] text-slate-500">Selected:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#0f5b87] font-semibold text-[11px]">
                  <AppIcon name={icon} size={13} />
                  {AVAILABLE_ICONS.find((i) => i.id === icon)?.label || icon}
                </span>
              </div>
            </div>

            {/* Quick search */}
            <div className="relative mb-2">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Search icons (e.g. home, money, chat, food, health, book)..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0f5b87] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl max-h-40 overflow-y-auto">
              {filteredIcons.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIcon(item.id)}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    icon === item.id
                      ? 'bg-[#0f5b87] text-white shadow-sm ring-2 ring-[#0f5b87]/40 scale-105'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                  title={item.label}
                >
                  <AppIcon name={item.id} size={20} />
                  <span className="text-[9px] truncate w-full text-center leading-tight">
                    {item.id}
                  </span>
                </button>
              ))}
              {filteredIcons.length === 0 && (
                <div className="col-span-full py-4 text-center text-xs text-slate-400">
                  No matching icon found. Try another search term.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers size={14} className="text-slate-500" />
                ক্যাটাগরি (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                বিবরণ (Description)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0f5b87] hover:bg-[#0b486b] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
