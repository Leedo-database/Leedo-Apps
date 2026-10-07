import React, { useState } from 'react';
import { X, Plus, Link as LinkIcon, Type, Layers, Check, Sparkles } from 'lucide-react';
import { AppItem } from '../types';
import { AVAILABLE_ICONS, AppIcon } from './AppIcon';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (newApp: Omit<AppItem, 'id' | 'createdAt'>) => void;
}

export const AddAppModal: React.FC<AddAppModalProps> = ({
  isOpen,
  onClose,
  onAddApp,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('globe');
  const [category, setCategory] = useState('Operations');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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

    // Auto-prefix protocol if missing
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    onAddApp({
      title: trimmedTitle,
      url: trimmedUrl,
      description: description.trim() || `${trimmedTitle} Portal`,
      icon,
      category,
    });

    // Reset and close
    setTitle('');
    setUrl('');
    setDescription('');
    setIcon('globe');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0f5b87] px-6 py-4.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Plus size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base">নতুন অ্যাপ যুক্ত করুন (Add New App)</h2>
              <p className="text-[11px] text-blue-100">Only HR & Admin can add new portal applications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* App Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Type size={14} className="text-[#0f5b87]" />
              অ্যাপের নাম (App Name / Title) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Employee Attendance Portal, Shelter Inventory"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white"
              required
            />
          </div>

          {/* App URL / Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <LinkIcon size={14} className="text-[#0f5b87]" />
              ওয়েব লিংক (Target Web Link / URL) *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://attendance.leedobd.org or docs.google.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white font-mono text-xs"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              আইকনে ক্লিক করলে এই লিংকটি নতুন পেজে খুলবে।
            </p>
          </div>

          {/* Select Icon */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0f5b87]" />
                আইকন নির্বাচন করুন (Choose Icon)
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                Selected: <strong className="font-semibold text-slate-800">{icon}</strong>
              </span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl max-h-36 overflow-y-auto">
              {AVAILABLE_ICONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIcon(item.id)}
                  className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    icon === item.id
                      ? 'bg-[#0f5b87] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200'
                  }`}
                  title={item.label}
                >
                  <AppIcon name={item.id} size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Category & Description */}
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
                <option value="Operations">Operations</option>
                <option value="Admin & Finance">Admin & Finance</option>
                <option value="Program & Operation">Program & Operation</option>
                <option value="Logistics">Logistics</option>
                <option value="Resources">Resources</option>
                <option value="Security">Security</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সংক্ষিপ্ত বিবরণ (Description)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              <span>Add App to Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
