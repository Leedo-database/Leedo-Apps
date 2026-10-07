import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Phone,
  Briefcase,
  Building,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { UserSession } from '../types';
import { storage } from '../services/storage';

interface MyProfileModalProps {
  session: UserSession;
  isOpen: boolean;
  onClose: () => void;
  onPasswordUpdated: (updatedSession: UserSession) => void;
}

export const MyProfileModal: React.FC<MyProfileModalProps> = ({
  session,
  isOpen,
  onClose,
  onPasswordUpdated,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  if (!isOpen) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const emp = storage.getEmployeeByEid(session.eid);
    if (!emp) {
      setStatusMessage({ type: 'error', text: 'Employee record not found.' });
      return;
    }

    const currentActual = emp.password || emp.eid;
    if (currentPass !== currentActual) {
      setStatusMessage({
        type: 'error',
        text: 'বর্তমান পাসওয়ার্ড ভুল হয়েছে (Incorrect current password).',
      });
      return;
    }

    if (!newPass || newPass.length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Minimum 6 characters).',
      });
      return;
    }

    if (newPass === session.eid) {
      setStatusMessage({
        type: 'error',
        text: 'পাসওয়ার্ড Employee ID এর সমান হতে পারবে না (Cannot be same as EID).',
      });
      return;
    }

    if (newPass !== confirmPass) {
      setStatusMessage({
        type: 'error',
        text: 'পাসওয়ার্ড দুটি মেলেনি (New passwords do not match).',
      });
      return;
    }

    const success = storage.updateEmployeePassword(session.eid, newPass);
    if (success) {
      setStatusMessage({
        type: 'success',
        text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে (Password changed successfully).',
      });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      const updated: UserSession = { ...session, isPasswordChanged: true };
      onPasswordUpdated(updated);
    } else {
      setStatusMessage({
        type: 'error',
        text: 'পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে (Failed to update password).',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header with profile banner */}
        <div className="bg-[#0f5b87] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white text-[#0f5b87] font-bold text-lg flex items-center justify-center shadow-md">
              {session.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-base leading-snug">{session.name}</h2>
              <p className="text-xs text-blue-100 flex items-center gap-1 font-mono">
                EID: {session.eid} • {session.role === 'admin' ? 'HR Manager' : 'Staff'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'info'
                ? 'bg-white text-[#0f5b87] border-b-2 border-[#0f5b87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User size={14} />
            <span>My Profile (আমার তথ্য)</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'password'
                ? 'bg-white text-[#0f5b87] border-b-2 border-[#0f5b87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound size={14} />
            <span>Change Password (পাসওয়ার্ড)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' ? (
            <div className="space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3">
                <Briefcase size={16} className="text-[#0f5b87] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Designation (পদবী)
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {session.designation}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3">
                <Building size={16} className="text-[#0f5b87] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Department (বিভাগ)
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {session.department || 'LEEDO General Operations'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3">
                <Phone size={16} className="text-[#0f5b87] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Official Mobile No (ফোন নম্বর)
                  </div>
                  <div className="text-sm font-semibold text-slate-800 font-mono">
                    {session.mobile || 'Not available'}
                  </div>
                </div>
              </div>

              {/* Privacy Notice per requirement */}
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                <Shield size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Protected:</strong> আপনি শুধুমাত্র আপনার নিজের তথ্য দেখতে পাচ্ছেন। প্রাতিষ্ঠানিক নীতি অনুসারে অন্য কারো প্রোফাইল বা তথ্য দেখার সুযোগ নেই।
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-3.5">
              {statusMessage && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="text-red-500 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বর্তমান পাসওয়ার্ড (Current Password)
                </label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  নতুন পাসওয়ার্ড (New Password)
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm New Password)
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87]"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0f5b87] hover:bg-[#0b486b] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock size={13} />
                  <span>পাসওয়ার্ড আপডেট করুন (Update Password)</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
