import React, { useState } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { LeedoLogo } from './LeedoLogo';
import { compressImageFile } from '../utils/imageCompressor';

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string | null;
  onSaveLogo: (logoDataUrl: string | null) => void;
}

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  onSaveLogo,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(currentLogo);
  const [urlInput, setUrlInput] = useState<string>(
    currentLogo && currentLogo.startsWith('http') ? currentLogo : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন (PNG, JPG, SVG, WebP).');
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file, 400, 400, 0.85);
      setLogoPreview(compressedDataUrl);
      setUrlInput('');
    } catch {
      setError('ছবি পড়তে বা প্রসেস করতে সমস্যা হয়েছে (Failed to process image file).');
    }
  };

  const handleApplyUrl = () => {
    setError(null);
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('অনুগ্রহ করে ছবির ওয়েব লিংক প্রদান করুন (Please enter image URL).');
      return;
    }
    setLogoPreview(trimmed);
  };

  const handleResetToDefault = () => {
    setLogoPreview(null);
    setUrlInput('');
    setError(null);
  };

  const handleSave = () => {
    onSaveLogo(logoPreview);
    setSuccess('লোগো সফলভাবে আপডেট করা হয়েছে (Logo updated successfully).');
    setTimeout(() => {
      setSuccess(null);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0f5b87] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles size={20} className="text-amber-300" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">প্রতিষ্ঠান লোগো পরিবর্তন (Change Logo)</h2>
              <p className="text-xs text-blue-100">
                Update portal brand logo (Only HR Admin has permission)
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

        {/* Success / Error alerts */}
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
          {/* Method 1: Upload from device */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Upload size={14} className="text-[#0f5b87]" />
              <span>ডিভাইস থেকে লোগো আপলোড করুন (Upload Logo File)</span>
            </label>

            <div className="flex items-center gap-3">
              <label className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs hover:bg-slate-100 flex items-center gap-2 transition-colors">
                <ImageIcon size={14} className="text-[#0f5b87]" />
                <span>Choose Image (PNG / JPG / SVG)...</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400">Max size: 5MB</span>
            </div>
          </div>

          {/* Method 2: Image URL input */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon size={14} className="text-[#0f5b87]" />
              <span>অথবা ছবির ওয়েব লিংক দিন (Or Image URL)</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87] font-mono"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3.5 py-2 bg-[#0f5b87] hover:bg-[#0b486b] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Apply URL
              </button>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>লাইভ প্রিভিউ (Live Preview)</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {logoPreview ? 'Custom Uploaded Logo' : 'Official LEEDO Vector Logo'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Navbar Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center min-h-[90px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold mb-2">
                  নেভিবার লুক (Navbar Horizontal)
                </span>
                <LeedoLogo size="sm" layout="horizontal" logoSrc={logoPreview} />
              </div>

              {/* Login Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center min-h-[90px]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold mb-2">
                  লগইন ও ব্যানার লুক (Vertical Stack)
                </span>
                <LeedoLogo size="md" layout="vertical" logoSrc={logoPreview} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
            title="Restore original official LEEDO logo"
          >
            <RotateCcw size={12} />
            <span>Reset to Official Logo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#0f5b87] hover:bg-[#0b486b] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Check size={14} />
              <span>Save Logo (সংরক্ষণ করুন)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
