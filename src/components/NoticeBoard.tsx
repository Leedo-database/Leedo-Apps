import React, { useState, useRef, useMemo } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Pin,
  Sparkles,
  Paperclip,
  FileText,
  File,
  Image as ImageIcon,
  Download,
  ExternalLink,
  Eye,
  X,
  Filter,
  Search,
  Tag,
  Check,
  Upload,
  Link2,
} from 'lucide-react';
import { Notice, NoticeAttachment } from '../types';

export const NOTICE_CATEGORIES = [
  'General',
  'Urgent / Emergency',
  'Meeting & Circular',
  'Policy & Rules',
  'Peace Home & Welfare',
  'Accounts & Finance',
  'Holiday & Leave',
  'Training & Workshop',
  'Event & Celebration',
  'Other',
];

interface NoticeBoardProps {
  notices: Notice[];
  isHr: boolean;
  onAddNotice?: (
    title: string,
    content: string,
    isImportant: boolean,
    category: string,
    attachment?: NoticeAttachment
  ) => void;
  onDeleteNotice?: (id: string) => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  notices,
  isHr,
  onAddNotice,
  onDeleteNotice,
}) => {
  // Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  // Attachment Form State
  const [attachmentMode, setAttachmentMode] = useState<'none' | 'file' | 'link'>('none');
  const [attachmentFile, setAttachmentFile] = useState<NoticeAttachment | null>(null);
  const [linkDocName, setLinkDocName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [attachmentError, setAttachmentError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterOnlyWithAttachment, setFilterOnlyWithAttachment] = useState(false);
  const [filterOnlyImportant, setFilterOnlyImportant] = useState(false);

  // Lightbox Preview State (for images or in-modal document viewing)
  const [previewAttachment, setPreviewAttachment] = useState<NoticeAttachment | null>(null);

  // Handle File Input Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachmentError('');

    // Check size - limit to 750KB for Base64 document storage in Firestore
    const sizeInKB = Math.round(file.size / 1024);
    if (sizeInKB > 750) {
      setAttachmentError(
        `File is ${sizeInKB} KB (exceeds 750 KB limit for direct upload). Please upload to Google Drive and use the "Cloud / Drive Link" tab instead.`
      );
      return;
    }

    const formattedSize =
      sizeInKB > 1024
        ? `${(sizeInKB / 1024).toFixed(1)} MB`
        : `${sizeInKB} KB`;

    let fileType: NoticeAttachment['type'] = 'other';
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      fileType = 'pdf';
    } else if (
      file.type.includes('word') ||
      file.type.includes('document') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.txt')
    ) {
      fileType = 'doc';
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setAttachmentFile({
        name: file.name,
        url: base64Data,
        type: fileType,
        size: formattedSize,
      });
    };
    reader.onerror = () => {
      setAttachmentError('Failed to read selected file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleClearAttachment = () => {
    setAttachmentFile(null);
    setLinkDocName('');
    setLinkUrl('');
    setAttachmentError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Notice
  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const finalCategory =
      newCategory === 'Other'
        ? customCategory.trim() || 'General'
        : newCategory;

    let finalAttachment: NoticeAttachment | undefined = undefined;

    if (attachmentMode === 'file' && attachmentFile) {
      finalAttachment = attachmentFile;
    } else if (attachmentMode === 'link' && linkUrl.trim()) {
      let linkType: NoticeAttachment['type'] = 'link';
      const lower = linkUrl.toLowerCase();
      if (lower.endsWith('.pdf')) {
        linkType = 'pdf';
      } else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
        linkType = 'image';
      } else if (lower.includes('drive.google.com') || lower.includes('docs.google.com')) {
        linkType = 'doc';
      }

      finalAttachment = {
        name: linkDocName.trim() || 'Attached Document',
        url: linkUrl.trim(),
        type: linkType,
        size: 'External Link',
      };
    }

    if (onAddNotice) {
      onAddNotice(
        newTitle.trim(),
        newContent.trim(),
        isImportant,
        finalCategory,
        finalAttachment
      );
    }

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewCategory('General');
    setCustomCategory('');
    setIsImportant(false);
    setAttachmentMode('none');
    handleClearAttachment();
    setShowAddForm(false);
  };

  // Distinct category badge styles
  const getCategoryBadgeClass = (category?: string) => {
    const cat = (category || 'General').toLowerCase();
    if (cat.includes('urgent') || cat.includes('emergency')) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (cat.includes('meeting') || cat.includes('circular')) {
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    }
    if (cat.includes('policy') || cat.includes('rule')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (cat.includes('peace') || cat.includes('welfare')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (cat.includes('account') || cat.includes('finance')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (cat.includes('holiday') || cat.includes('leave')) {
      return 'bg-teal-100 text-teal-800 border-teal-300';
    }
    if (cat.includes('training') || cat.includes('workshop')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    if (cat.includes('event') || cat.includes('celebration')) {
      return 'bg-pink-100 text-pink-800 border-pink-300';
    }
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  // Unique categories list with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notices.forEach((n) => {
      const cat = n.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [notices]);

  const activeCategories = useMemo(() => {
    const list = Object.keys(categoryCounts);
    // Sort so standard categories appear first, then any custom ones
    return list.sort();
  }, [categoryCounts]);

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      // Category filter
      if (filterCategory !== 'all') {
        const cat = (notice.category || 'General').toLowerCase();
        if (cat !== filterCategory.toLowerCase()) {
          return false;
        }
      }

      // Attachment filter
      if (filterOnlyWithAttachment && !notice.attachment) {
        return false;
      }

      // Important filter
      if (filterOnlyImportant && !notice.isImportant) {
        return false;
      }

      // Search query (matches title, content, author, category, or attachment name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = notice.title.toLowerCase().includes(q);
        const inContent = notice.content.toLowerCase().includes(q);
        const inAuthor = notice.author.toLowerCase().includes(q);
        const inCategory = (notice.category || 'General').toLowerCase().includes(q);
        const inAttachment = notice.attachment?.name.toLowerCase().includes(q);
        return inTitle || inContent || inAuthor || inCategory || inAttachment;
      }

      return true;
    });
  }, [notices, filterCategory, filterOnlyWithAttachment, filterOnlyImportant, searchQuery]);

  const hasActiveFilters =
    filterCategory !== 'all' ||
    filterOnlyWithAttachment ||
    filterOnlyImportant ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setFilterCategory('all');
    setFilterOnlyWithAttachment(false);
    setFilterOnlyImportant(false);
    setSearchQuery('');
  };

  return (
    <div id="notice-board-section" className="w-full max-w-5xl mx-auto mt-12 mb-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/90">
        {/* Navy Header styled to match LEEDO theme */}
        <div className="bg-[#0b486b] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Bell size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-wide flex items-center gap-2">
                LEEDO Notice Board
                <span className="text-[11px] font-normal bg-white/20 px-2 py-0.5 rounded-full">
                  {notices.length} {notices.length === 1 ? 'Notice' : 'Notices'}
                </span>
              </h2>
              <p className="text-[11px] text-white/80">
                Official announcements, circulars & documents for all staff
              </p>
            </div>
          </div>

          {isHr && onAddNotice && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 bg-white text-[#0b486b] hover:bg-white/90 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              {showAddForm ? (
                <>
                  <X size={15} />
                  <span>Close Form</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>Post New Notice (HR)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* HR Add Notice Inline Form */}
        {showAddForm && isHr && (
          <form
            onSubmit={handlePostNotice}
            className="p-5 sm:p-6 bg-gradient-to-b from-blue-50/90 to-slate-50 border-b border-blue-200/70 space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-blue-200/50 pb-2.5">
              <div className="text-xs font-bold text-[#0b486b] uppercase tracking-wider flex items-center gap-2">
                <Pin size={14} className="text-[#0f5b87]" />
                <span>Publish Official Notice for All LEEDO Staff</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Visible across all user accounts
              </span>
            </div>

            {/* Title & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notice Headline / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Annual Program Strategy Meeting or New Policy Circular"
                  className="w-full px-3.5 py-2 bg-white border border-blue-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag size={12} className="text-[#0f5b87]" />
                  <span>Category (ক্যাটাগরি) <span className="text-red-500">*</span></span>
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                >
                  {NOTICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Category Input if 'Other' selected */}
            {newCategory === 'Other' && (
              <div className="p-3 bg-white rounded-lg border border-blue-200 animate-fadeIn">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Category Name:
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Type category name (e.g. Volunteer, Medical, Sports)"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                  required
                />
              </div>
            )}

            {/* Detailed Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notice Content / Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write the full notice description, meeting schedule, instructions, or policy summary..."
                rows={4}
                className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                required
              />
            </div>

            {/* Attachment Section (সংযুক্তি / অ্যাটাচমেন্ট) */}
            <div className="p-3.5 bg-white rounded-xl border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Paperclip size={15} className="text-[#0b486b]" />
                  <span className="text-xs font-bold text-slate-800">
                    File Attachment (সংযুক্তি / ফাইল)
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    (Optional - PDF, Image, Word Doc, or Google Drive link)
                  </span>
                </div>

                {/* Attachment mode buttons */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentMode('none');
                      handleClearAttachment();
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      attachmentMode === 'none'
                        ? 'bg-white text-slate-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    No File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentMode('file');
                      setLinkUrl('');
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      attachmentMode === 'file'
                        ? 'bg-[#0b486b] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload size={12} />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentMode('link');
                      setAttachmentFile(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      attachmentMode === 'link'
                        ? 'bg-[#0b486b] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link2 size={12} />
                    <span>Drive / Web Link</span>
                  </button>
                </div>
              </div>

              {/* File Upload Mode */}
              {attachmentMode === 'file' && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="notice-file-upload-input"
                  />

                  {!attachmentFile ? (
                    <label
                      htmlFor="notice-file-upload-input"
                      className="border-2 border-dashed border-blue-300 hover:border-[#0f5b87] bg-blue-50/40 hover:bg-blue-50/70 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center"
                    >
                      <Upload size={22} className="text-[#0f5b87] mb-1.5" />
                      <span className="text-xs font-bold text-slate-800">
                        Click to select document or image
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        Supports PDF, PNG, JPG, DOCX, etc. (Max 750 KB for quick cloud sync)
                      </span>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        {attachmentFile.type === 'image' ? (
                          <img
                            src={attachmentFile.url}
                            alt="preview"
                            className="w-10 h-10 object-cover rounded-md border border-slate-300 shadow-xs"
                          />
                        ) : attachmentFile.type === 'pdf' ? (
                          <div className="w-10 h-10 rounded-md bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs border border-red-200">
                            PDF
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-blue-100 text-[#0b486b] flex items-center justify-center font-bold text-xs border border-blue-200">
                            <FileText size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                            {attachmentFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {attachmentFile.size} • Ready to publish
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearAttachment}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {attachmentError && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      {attachmentError}
                    </p>
                  )}
                </div>
              )}

              {/* Cloud / Google Drive Link Mode */}
              {attachmentMode === 'link' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Document Title / Name:
                    </label>
                    <input
                      type="text"
                      value={linkDocName}
                      onChange={(e) => setLinkDocName(e.target.value)}
                      placeholder="e.g. Child Protection Policy 2026.pdf"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Web Link (Google Drive / Docs / PDF URL):
                    </label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Submit Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-blue-200/50">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-red-600 flex items-center gap-1">
                  <AlertCircle size={13} />
                  Mark as Important Alert (জরুরি বিজ্ঞপ্তি)
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0b486b] hover:bg-[#07324c] text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Publish Notice</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter and Search Bar for all users across all IDs */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices by title, content, author, category, or file..."
                className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f5b87] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Filter Toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterOnlyWithAttachment(!filterOnlyWithAttachment)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterOnlyWithAttachment
                    ? 'bg-[#0b486b] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Show only notices that have documents or attachments"
              >
                <Paperclip size={13} />
                <span>With Files / Attachments</span>
              </button>

              <button
                onClick={() => setFilterOnlyImportant(!filterOnlyImportant)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterOnlyImportant
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <AlertCircle size={13} />
                <span>Important Only</span>
              </button>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Tag size={12} />
              <span>Category:</span>
            </span>

            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#0b486b] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              All ({notices.length})
            </button>

            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  filterCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#0b486b] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notices Content */}
        <div className="p-5 sm:p-6">
          {filteredNotices.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Bell size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {hasActiveFilters
                  ? 'No notices match your current search/filter.'
                  : 'There are no notices published yet.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 text-xs font-semibold text-[#0b486b] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    notice.isImportant
                      ? 'bg-red-50/30 border-red-200 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50/90 hover:border-slate-300'
                  }`}
                >
                  {/* Top line: Badges & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {notice.isImportant && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white tracking-wide uppercase flex items-center gap-1 shadow-xs">
                          <AlertCircle size={11} />
                          <span>Important</span>
                        </span>
                      )}

                      {/* Notice Category Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border tracking-wide flex items-center gap-1 ${getCategoryBadgeClass(
                          notice.category
                        )}`}
                      >
                        <Tag size={11} />
                        <span>{notice.category || 'General'}</span>
                      </span>

                      {/* Has attachment indicator badge */}
                      {notice.attachment && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-[#0b486b] border border-blue-200 flex items-center gap-1">
                          <Paperclip size={10} />
                          <span>Attachment</span>
                        </span>
                      )}
                    </div>

                    {isHr && onDeleteNotice && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete notice "${notice.title}"?`)) {
                            onDeleteNotice(notice.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title="Delete notice (HR only)"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Notice Title */}
                  <h3 className="mt-2.5 font-bold text-slate-900 text-base sm:text-lg leading-snug">
                    {notice.title}
                  </h3>

                  {/* Notice Content */}
                  <p className="mt-2 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </p>

                  {/* Attachment Display for all staff / IDs */}
                  {notice.attachment && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200/80">
                      <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Paperclip size={12} className="text-[#0b486b]" />
                        <span>Attached Document / File:</span>
                      </div>

                      {notice.attachment.type === 'image' ? (
                        /* Image attachment */
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                          <div
                            onClick={() => setPreviewAttachment(notice.attachment!)}
                            className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 max-h-36"
                          >
                            <img
                              src={notice.attachment.url}
                              alt={notice.attachment.name}
                              className="w-auto h-28 object-cover rounded-lg group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                              <Eye size={14} />
                              <span>View Full</span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs text-slate-900 truncate">
                              {notice.attachment.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {notice.attachment.size || 'Image File'}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => setPreviewAttachment(notice.attachment!)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0b486b] text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Eye size={12} />
                                <span>Preview</span>
                              </button>
                              <a
                                href={notice.attachment.url}
                                download={notice.attachment.name}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Download size={12} />
                                <span>Download</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : notice.attachment.type === 'pdf' ? (
                        /* PDF attachment */
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-red-100 shadow-xs flex-wrap gap-2.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0 border border-red-200">
                              PDF
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate max-w-xs sm:max-w-md">
                                {notice.attachment.name}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {notice.attachment.size || 'PDF Document'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {notice.attachment.url.startsWith('data:') ? (
                              <>
                                <button
                                  onClick={() => setPreviewAttachment(notice.attachment!)}
                                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Eye size={13} />
                                  <span>View PDF</span>
                                </button>
                                <a
                                  href={notice.attachment.url}
                                  download={notice.attachment.name}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Download size={13} />
                                  <span>Download</span>
                                </a>
                              </>
                            ) : (
                              <a
                                href={notice.attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <ExternalLink size={13} />
                                <span>Open PDF Document</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Other Document / Web Link / Drive attachment */
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex-wrap gap-2.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0b486b] flex items-center justify-center shrink-0 border border-blue-200">
                              {notice.attachment.type === 'link' ? (
                                <Link2 size={18} />
                              ) : (
                                <FileText size={18} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate max-w-xs sm:max-w-md">
                                {notice.attachment.name}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {notice.attachment.size || 'Attached file'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {notice.attachment.url.startsWith('data:') ? (
                              <a
                                href={notice.attachment.url}
                                download={notice.attachment.name}
                                className="px-3 py-1.5 bg-[#0b486b] hover:bg-[#07324c] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Download size={13} />
                                <span>Download File</span>
                              </a>
                            ) : (
                              <a
                                href={notice.attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-[#0b486b] hover:bg-[#07324c] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <ExternalLink size={13} />
                                <span>Open Document Link</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notice Footer: Author & Date */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <span className="text-slate-400">Posted by:</span>
                      <span className="font-semibold">{notice.author}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{notice.date}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attachment Full Preview Lightbox Modal */}
      {previewAttachment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setPreviewAttachment(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0b486b] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Paperclip size={16} />
                <h3 className="font-bold text-sm truncate">{previewAttachment.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewAttachment.url}
                  download={previewAttachment.name}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="text-white/80 hover:text-white p-1 rounded cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-slate-900/10 min-h-[300px]">
              {previewAttachment.type === 'image' ? (
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
                />
              ) : previewAttachment.type === 'pdf' ? (
                <iframe
                  src={previewAttachment.url}
                  title={previewAttachment.name}
                  className="w-full h-[70vh] rounded-lg border border-slate-300"
                />
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-sm font-semibold text-slate-800">
                    {previewAttachment.name}
                  </p>
                  <a
                    href={previewAttachment.url}
                    download={previewAttachment.name}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b486b] text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download file to view</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
