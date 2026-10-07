import React, { useState } from 'react';
import {
  X,
  Image as ImageIcon,
  Sliders,
  Check,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Eye,
} from 'lucide-react';
import { BackgroundConfig } from '../types';

interface BackgroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackgroundConfig;
  onSaveConfig: (newConfig: BackgroundConfig) => void;
}

const PRESET_COVERS = [
  {
    id: 'shelter-children',
    name: 'Children & Community Smiles',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'classroom',
    name: 'Education & Classroom Learning',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'hope',
    name: 'Hope & Playful Childhood',
    url: 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'empowerment',
    name: 'Child Welfare & Togetherness',
    url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'office',
    name: 'Humanitarian Office & Admin',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop',
  },
];

export const BackgroundSettingsModal: React.FC<BackgroundSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [bgType, setBgType] = useState<'pattern' | 'image'>(config.type || 'pattern');
  const [imageUrl, setImageUrl] = useState<string>(
    config.imageUrl || PRESET_COVERS[0].url
  );
  const [blur, setBlur] = useState<number>(config.blur ?? 8);
  const [dim, setDim] = useState<number>(config.dim ?? 45);
  const [overlayColor, setOverlayColor] = useState<string>(
    config.overlayColor || '#0b2e46'
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন (Please select an image file).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ছবির আকার ৫ মেগাবাইটের নিচে হতে হবে (Image size must be under 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setBgType('image');
      }
    };
    reader.onerror = () => {
      setUploadError('ছবি আপলোড করতে সমস্যা হয়েছে (Failed to read image file).');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveConfig({
      type: bgType,
      imageUrl,
      blur,
      dim,
      overlayColor,
    });
    onClose();
  };

  const handleResetToDefault = () => {
    setBgType('pattern');
    setBlur(8);
    setDim(45);
    setOverlayColor('#0b2e46');
    setImageUrl(PRESET_COVERS[0].url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0f5b87] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ImageIcon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">ব্যাকগ্রাউন্ড ও কভার ফটো সেটিংস</h2>
              <p className="text-xs text-blue-100">
                Customize Background Cover Photo & Blur Effect (ঝাপসা কভার ফটো)
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Background Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              ব্যাকগ্রাউন্ড ধরন (Select Background Type)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBgType('pattern')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  bgType === 'pattern'
                    ? 'border-[#0f5b87] bg-blue-50/70 ring-2 ring-[#0f5b87]/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>Classic Geometric Blue</span>
                  {bgType === 'pattern' && <Check size={14} className="text-[#0f5b87]" />}
                </div>
                <div className="text-[11px] text-slate-500">
                  মূল স্ক্রিনশটের মতো জিওমেট্রিক প্যাটার্ন
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBgType('image')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  bgType === 'image'
                    ? 'border-[#0f5b87] bg-blue-50/70 ring-2 ring-[#0f5b87]/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>Cover Photo (ঝাপসা ছবি)</span>
                  {bgType === 'image' && <Check size={14} className="text-[#0f5b87]" />}
                </div>
                <div className="text-[11px] text-slate-500">
                  কভার ফটো দিয়ে হালকা ব্লার/ঝাপসা লুক
                </div>
              </button>
            </div>
          </div>

          {/* If Image mode is active */}
          {bgType === 'image' && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              {/* Presets Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  ছবি নির্বাচন করুন (Choose Preset Cover Photos)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer h-20 ${
                        imageUrl === preset.url
                          ? 'border-[#0f5b87] ring-2 ring-[#0f5b87]/40'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1.5 flex items-end">
                        <span className="text-[10px] font-semibold text-white leading-tight line-clamp-2">
                          {preset.name}
                        </span>
                      </div>
                      {imageUrl === preset.url && (
                        <div className="absolute top-1 right-1 bg-[#0f5b87] text-white p-0.5 rounded-full">
                          <Check size={11} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload or Custom URL input */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Upload size={14} className="text-[#0f5b87]" />
                  <span>নিজের কম্পিউটার/মোবাইল থেকে ছবি আপলোড করুন:</span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
                    <Upload size={13} />
                    <span>Choose Photo...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-slate-400">অথবা ছবির ওয়েব লিংক দিন:</span>
                </div>

                {uploadError && (
                  <p className="text-xs text-red-600">{uploadError}</p>
                )}

                <div className="relative">
                  <LinkIcon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87] font-mono"
                  />
                </div>
              </div>

              {/* Sliders for Blur & Dim (Japsha Effect) */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200/60 space-y-4">
                <div className="font-semibold text-xs text-[#0f5b87] flex items-center gap-1.5 uppercase tracking-wide">
                  <Sliders size={14} />
                  <span>ঝাপসা ও স্বচ্ছতা নিয়ন্ত্রণ (Japsha & Blur Controls)</span>
                </div>

                {/* Blur Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1 font-medium text-slate-700">
                    <span>ঝাপসা মাত্রা (Blur Intensity):</span>
                    <span className="font-bold text-[#0f5b87] font-mono">{blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="22"
                    step="1"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="w-full accent-[#0f5b87] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>পরিষ্কার (0px)</span>
                    <span>মাঝারি ঝাপসা (8px)</span>
                    <span>অধিক ঝাপসা (22px)</span>
                  </div>
                </div>

                {/* Darkness / Dim Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1 font-medium text-slate-700">
                    <span>কালো ছায়া/ওভারলে (Darkness / Dim Overlay):</span>
                    <span className="font-bold text-[#0f5b87] font-mono">{dim}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    step="5"
                    value={dim}
                    onChange={(e) => setDim(Number(e.target.value))}
                    className="w-full accent-[#0f5b87] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>উজ্জ্বল (15%)</span>
                    <span>স্ট্যান্ডার্ড রিডেবল (45%)</span>
                    <span>গাঢ় ডার্ক (85%)</span>
                  </div>
                </div>

                {/* Tint Color Selector */}
                <div>
                  <div className="text-xs font-medium text-slate-700 mb-1.5">
                    ওভারলে শেড কালার (Overlay Shade Tint):
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { name: 'Navy Blue', hex: '#0b2e46' },
                      { name: 'Slate Teal', hex: '#0f3c50' },
                      { name: 'Deep Charcoal', hex: '#111827' },
                      { name: 'Rich Black', hex: '#000000' },
                    ].map((shade) => (
                      <button
                        key={shade.hex}
                        type="button"
                        onClick={() => setOverlayColor(shade.hex)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
                          overlayColor === shade.hex
                            ? 'bg-white border-[#0f5b87] text-[#0f5b87] shadow-2xs font-bold'
                            : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: shade.hex }}
                        />
                        <span>{shade.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center gap-3">
                <div
                  className="w-16 h-12 rounded-lg bg-cover bg-center overflow-hidden relative shadow-inner shrink-0"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    filter: `blur(${Math.min(blur, 6)}px)`,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: overlayColor,
                      opacity: dim / 100,
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-600 leading-tight">
                  <strong className="text-slate-800">প্রিভিউ:</strong> ব্যাকগ্রাউন্ডে ঝাপসা কভার ফটো থাকবে এবং আইকনগুলো সুস্পষ্ট ও পরিষ্কারভাবে দেখা যাবে।
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset to Default</span>
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
              <span>Apply Background (সংরক্ষণ করুন)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
