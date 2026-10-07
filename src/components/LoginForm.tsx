import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Info, Image as ImageIcon } from 'lucide-react';
import { LeedoLogo } from './LeedoLogo';
import { storage } from '../services/storage';
import { UserSession } from '../types';

interface LoginFormProps {
  onLoginSuccess: (session: UserSession, isFirstTime: boolean) => void;
  onOpenBgSettings: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onOpenBgSettings }) => {
  const [eid, setEid] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const remembered = storage.getRememberedEid();
    if (remembered) {
      setEid(remembered);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const trimmedEid = eid.trim();
    if (!trimmedEid) {
      setError('অনুগ্রহ করে আপনার Employee ID (EID) প্রদান করুন (Please enter your Employee ID).');
      return;
    }

    if (!password) {
      setError('অনুগ্রহ করে আপনার পাসওয়ার্ড প্রদান করুন (Please enter your password).');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const employee = storage.getEmployeeByEid(trimmedEid);

      if (!employee) {
        setError(`Employee ID "${trimmedEid}" পাওয়া যায়নি। সঠিক ID দিয়ে চেষ্টা করুন (Employee ID not found).`);
        setLoading(false);
        return;
      }

      // Check password: if not changed yet, default is the EID itself
      const validPassword = employee.password || employee.eid;

      if (password !== validPassword) {
        setError('পাসওয়ার্ড ভুল হয়েছে। ডিফল্ট পাসওয়ার্ড আপনার Employee ID (Incorrect password. Default is your EID).');
        setLoading(false);
        return;
      }

      // Store remember me preference
      storage.setRememberedEid(trimmedEid, rememberMe);

      const session: UserSession = {
        eid: employee.eid,
        name: employee.name,
        designation: employee.designation,
        department: employee.department,
        mobile: employee.mobile,
        role: employee.role,
        isPasswordChanged: !!employee.isPasswordChanged,
        loginTime: new Date().toISOString(),
      };

      storage.saveSession(session);

      // Check if first time login (password hasn't been changed yet or equals default EID)
      const isFirstTime = !employee.isPasswordChanged || employee.password === employee.eid;

      setLoading(false);
      onLoginSuccess(session, isFirstTime);
    }, 300);
  };

  const handleQuickDemo = (demoEid: string) => {
    const emp = storage.getEmployeeByEid(demoEid);
    if (emp) {
      setEid(emp.eid);
      setPassword(emp.password || emp.eid);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Top Right Background Switcher button */}
      <button
        onClick={onOpenBgSettings}
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold backdrop-blur-sm shadow-md border border-white/60 transition-all cursor-pointer"
        title="Change cover photo and blur effect"
      >
        <ImageIcon size={14} className="text-[#0f5b87]" />
        <span>কভার ফটো (Background)</span>
      </button>

      {/* Top Organization Header with exact LEEDO Logo */}
      <div className="flex flex-col items-center mb-6 text-center select-none animate-fadeIn">
        <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl border border-white/40 mb-3 flex items-center justify-center">
          <LeedoLogo size="lg" layout="vertical" showSubtitle={true} />
        </div>
      </div>

      {/* Login Card styled precisely like reference screenshot */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-100/60 p-7 sm:p-9 transition-all">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Login</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your employee credentials to access apps
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle size={17} className="shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* EID Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Employee ID (EID)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-slate-100 rounded-l-lg border border-r-0 border-slate-200 text-slate-500">
                <User size={18} />
              </div>
              <input
                type="text"
                value={eid}
                onChange={(e) => setEid(e.target.value)}
                placeholder="e.g. 1057, 1007, 1001"
                autoComplete="username"
                className="w-full pl-13 pr-4 py-2.5 bg-slate-50/70 text-slate-900 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-slate-100 rounded-l-lg border border-r-0 border-slate-200 text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full pl-13 pr-10 py-2.5 bg-slate-50/70 text-slate-900 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0f5b87] focus:ring-[#0f5b87]"
              />
              Remember Me
            </label>

            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Info size={12} className="text-slate-400" />
              Default password = EID
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#0f5b87] hover:bg-[#0b486b] active:scale-[0.99] text-white rounded-lg font-semibold text-sm transition-all shadow-md shadow-slate-400/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials helper */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Quick Demo Accounts (Click to test)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('1057')}
              className="p-2 rounded-lg bg-blue-50/80 hover:bg-blue-100/90 text-blue-900 border border-blue-200/70 text-left transition-all cursor-pointer group"
            >
              <div className="font-bold flex items-center justify-between">
                <span>EID: 1057</span>
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono">HR</span>
              </div>
              <div className="text-[11px] text-blue-800/80 truncate">Md. Omar Faruque</div>
              <div className="text-[10px] text-blue-600">Can add, edit & delete apps</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('1007')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-left transition-all cursor-pointer"
            >
              <div className="font-bold flex items-center justify-between">
                <span>EID: 1007</span>
                <span className="text-[10px] bg-slate-500 text-white px-1.5 py-0.5 rounded font-mono">Staff</span>
              </div>
              <div className="text-[11px] text-slate-600 truncate">Athui Marma</div>
              <div className="text-[10px] text-slate-500">Normal User View</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-white/80 text-xs flex items-center gap-1.5 drop-shadow-sm">
        <ShieldCheck size={14} className="text-white/90" />
        <span>LEEDO Internal Secure Authentication Network</span>
      </div>
    </div>
  );
};
