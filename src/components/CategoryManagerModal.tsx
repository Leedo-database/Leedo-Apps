import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Check,
  RotateCcw,
  Layers,
  FolderPlus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { AppCategory, AppItem } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AppCategory[];
  apps: AppItem[];
  onAddCategory: (name: string) => void;
  onRenameCategory: (id: string, newName: string) => void;
  onDeleteCategory: (id: string) => void;
  onResetCategories: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  apps,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onResetCategories,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRename = (cat: AppCategory) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError(null);
  };

  const handleSaveRename = (id: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setError('ক্যাটাগরির নাম খালি রাখা যাবে না (Category name cannot be empty).');
      return;
    }
    onRenameCategory(id, trimmed);
    setEditingId(null);
    setEditingName('');
    setSuccess(`ক্যাটাগরি নাম পরিবর্তন হয়ে "${trimmed}" হয়েছে (Category renamed).`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('এই নামের ক্যাটাগরি ইতিমধ্যে রয়েছে (Category already exists).');
      return;
    }

    onAddCategory(trimmed);
    setNewCatName('');
    setError(null);
    setSuccess(`নতুন ক্যাটাগরি "${trimmed}" যুক্ত করা হয়েছে (Category added).`);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0f5b87] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">ক্যাটাগরি ব্যবস্থাপনা (Manage Categories)</h2>
              <p className="text-xs text-blue-100">
                Rename, add or delete app categories (Only HR can edit)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success/Error Alerts */}
        {success && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn shrink-0">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs text-red-700 flex items-center gap-2 animate-fadeIn shrink-0">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Add Category Form */}
          <form
            onSubmit={handleCreateCategory}
            className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2"
          >
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="নতুন ক্যাটাগরির নাম লিখুন (e.g. Accounts, Peace Home)..."
              className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#0f5b87] hover:bg-[#0b486b] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>+ Add</span>
            </button>
          </form>

          {/* Categories List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                বিদ্যমান ক্যাটাগরি তালিকা ({categories.length})
              </span>
              <span className="text-[11px] text-slate-400">
                ক্লিক করে নাম এডিট (Rename) করুন
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {categories.map((cat) => {
                const count = apps.filter((a) => a.category === cat.name).length;
                const isEditing = editingId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(cat.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={13} />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0f5b87]" />
                          <span className="font-bold text-xs sm:text-sm text-slate-800">
                            {cat.name}
                          </span>
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {count} {count === 1 ? 'app' : 'apps'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartRename(cat)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
                            title="Rename Category"
                          >
                            <Edit3 size={13} />
                            <span className="hidden sm:inline text-[11px] font-semibold">Rename</span>
                          </button>

                          {categories.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Delete "${cat.name}" category? Any apps in this category will be moved to General.`
                                  )
                                ) {
                                  onDeleteCategory(cat.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset categories back to original default list?')) {
                onResetCategories();
              }
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0f5b87] hover:bg-[#0b486b] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
