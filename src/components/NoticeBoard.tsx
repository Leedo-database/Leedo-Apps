import React, { useState } from 'react';
import { Bell, Plus, Trash2, Calendar, AlertCircle, Pin, Sparkles } from 'lucide-react';
import { Notice } from '../types';

interface NoticeBoardProps {
  notices: Notice[];
  isHr: boolean;
  onAddNotice?: (title: string, content: string, isImportant: boolean) => void;
  onDeleteNotice?: (id: string) => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  notices,
  isHr,
  onAddNotice,
  onDeleteNotice,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    if (onAddNotice) {
      onAddNotice(newTitle.trim(), newContent.trim(), isImportant);
    }
    setNewTitle('');
    setNewContent('');
    setIsImportant(false);
    setShowAddForm(false);
  };

  return (
    <div id="notice-board-section" className="w-full max-w-5xl mx-auto mt-12 mb-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/90">
        {/* Navy Header styled identically to Screenshot 2 */}
        <div className="bg-[#0b486b] text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-white/90" />
            <h2 className="font-bold text-base tracking-wide">Notice Board</h2>
          </div>

          {isHr && onAddNotice && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>{showAddForm ? 'Close' : 'Post New Notice'}</span>
            </button>
          )}
        </div>

        {/* HR Add Notice Inline Form */}
        {showAddForm && isHr && (
          <form
            onSubmit={handlePostNotice}
            className="p-5 bg-blue-50/60 border-b border-blue-200/60 space-y-3"
          >
            <div className="text-xs font-bold text-[#0b486b] uppercase tracking-wider flex items-center gap-1.5">
              <Pin size={13} />
              <span>Publish Notice for All LEEDO Staff</span>
            </div>
            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Notice headline / title"
                className="w-full px-3.5 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                required
              />
            </div>
            <div>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Detailed notice text..."
                rows={3}
                className="w-full px-3.5 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                required
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded text-[#0f5b87]"
                />
                <span className="font-medium text-red-600">Mark as Important Alert</span>
              </label>

              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0b486b] text-white rounded-lg text-xs font-semibold hover:bg-[#07324c] transition-colors cursor-pointer"
              >
                Publish Notice
              </button>
            </div>
          </form>
        )}

        {/* Notice Items Content */}
        <div className="p-6">
          {notices.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-sm italic font-normal">
              There are no notices at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-4 rounded-xl border transition-all ${
                    notice.isImportant
                      ? 'bg-red-50/40 border-red-200/80'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {notice.isImportant && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white tracking-wide uppercase">
                          Important
                        </span>
                      )}
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {notice.title}
                      </h3>
                    </div>

                    {isHr && onDeleteNotice && (
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this notice?')) {
                            onDeleteNotice(notice.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer shrink-0"
                        title="Delete notice"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                    <span className="font-medium text-slate-600">
                      Posted by: {notice.author}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar size={12} />
                      {notice.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
