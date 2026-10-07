import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { storage } from '../services/storage';
import { UserSession } from '../types';

interface FirstTimePasswordModalProps {
  session: UserSession;
  onPasswordChanged: (updatedSession: UserSession) => void;
}

export const FirstTimePasswordModal: React.FC<FirstTimePasswordModalProps> = ({
  session,
  onPasswordChanged,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || newPassword.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters).');
      return;
    }

    if (newPassword === session.eid) {
      setError('নতুন পাসওয়ার্ড আপনার Employee ID থেকে আলাদা হতে হবে (New password cannot be same as your EID).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('পাসওয়ার্ড দুটি মেলেনি (Passwords do not match).');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const success = storage.updateEmployeePassword(session.eid, newPassword);
      if (success) {
        const updatedSession: UserSession = {
          ...session,
          isPasswordChanged: true,
        };
        storage.saveSession(updatedSession);
        setLoading(false);
        onPasswordChanged(updatedSession);
      } else {
        setError('পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে (Failed to update password).');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#0f5b87] to-[#1a73a8] px-6 py-5 text-white flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <KeyRound size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">পাসওয়ার্ড পরিবর্তন আবশ্যক</h2>
            <p className="text-xs text-blue-100">Mandatory First-Time Password Setup</p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 mb-5 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle size={17} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">নিরাপত্তা সতর্কতা (Security Notice):</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                আপনার অ্যাকাউন্টে প্রথমবার লগইন করেছেন। ডিফল্ট পাসওয়ার্ড পরিবর্তন করে একটি নতুন নিরাপদ পাসওয়ার্ড নির্ধারণ করুন।
              </p>
              <p className="mt-1 font-mono text-[11px] text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded inline-block">
                Employee: {session.name} ({session.eid})
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                নতুন পাসওয়ার্ড (New Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0f5b87] hover:bg-[#0b486b] text-white rounded-lg font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    <span>পাসওয়ার্ড সংরক্ষণ করুন এবং ড্যাশবোর্ডে প্রবেশ করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
