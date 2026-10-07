import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Search,
  KeyRound,
  RotateCcw,
  Check,
  Shield,
  Layers,
  Users,
  ExternalLink,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { AppItem, Employee } from '../types';
import { storage } from '../services/storage';
import { AppIcon } from './AppIcon';

interface HrAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  onOpenAddApp: () => void;
  onEditApp: (app: AppItem) => void;
  onDeleteApp: (appId: string) => void;
  onRefreshApps: () => void;
}

export const HrAdminPanel: React.FC<HrAdminPanelProps> = ({
  isOpen,
  onClose,
  apps,
  onOpenAddApp,
  onEditApp,
  onDeleteApp,
  onRefreshApps,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'employees'>('apps');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const employees = storage.getEmployees();

  const filteredEmployees = employees.filter((emp) => {
    const q = employeeSearch.toLowerCase().trim();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.eid.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    );
  });

  const handleResetPassword = (eid: string, name: string) => {
    if (
      window.confirm(
        `Reset password for ${name} (EID: ${eid}) back to their default EID?\n\nThey will be required to choose a new password upon logging in.`
      )
    ) {
      storage.resetEmployeePasswordToDefault(eid);
      setActionNotice(`Password for ${name} (${eid}) reset to default successfully.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#0b486b] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield size={20} className="text-amber-300" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">HR & Administration Control Hub</h2>
              <p className="text-xs text-blue-100">
                Manage Portal Apps, Links & Employee Password Resets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('apps')}
            className={`py-3.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'apps'
                ? 'border-[#0f5b87] text-[#0f5b87] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers size={15} />
            <span>Portal Apps & Links ({apps.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`py-3.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'employees'
                ? 'border-[#0f5b87] text-[#0f5b87] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={15} />
            <span>Employee Access & Passwords ({employees.length})</span>
          </button>
        </div>

        {/* Action Notice notification banner */}
        {actionNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn shrink-0">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'apps' ? (
            <div className="space-y-4">
              {/* Add App CTA banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/70 p-4 rounded-xl border border-blue-200">
                <div>
                  <h3 className="font-bold text-sm text-[#0b486b]">
                    Customize Portal Applications
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Add new app cards with custom web links. Regular employees will see them on their dashboard and can click to open them.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset all apps to original default list? Any custom added apps will be reset.')) {
                        storage.resetAppsToDefault();
                        onRefreshApps();
                        setActionNotice('Apps successfully reset to default LEEDO application list.');
                        setTimeout(() => setActionNotice(null), 4000);
                      }
                    }}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Restore default apps"
                  >
                    <RotateCcw size={13} />
                    <span>Restore Defaults</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenAddApp();
                    }}
                    className="px-4 py-2 bg-[#0f5b87] hover:bg-[#0b486b] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Plus size={15} />
                    <span>+ Add New App</span>
                  </button>
                </div>
              </div>

              {/* Apps Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Icon</th>
                      <th className="py-3 px-4">App Title (নাম)</th>
                      <th className="py-3 px-4">Target Link (ওয়েব লিংক)</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {apps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                            <AppIcon name={app.icon} size={18} />
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          <div>{app.title}</div>
                          {app.description && (
                            <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">
                              {app.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-blue-600">
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 max-w-xs truncate"
                          >
                            <span className="truncate">{app.url}</span>
                            <ExternalLink size={12} className="shrink-0 text-slate-400" />
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {app.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => onEditApp(app)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit app name or URL"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${app.title}" from dashboard?`)) {
                                onDeleteApp(app.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete app"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    placeholder="Search by Employee ID, Name, Designation..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0f5b87] focus:bg-white"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  Total Staff: <strong>{filteredEmployees.length}</strong>
                </div>
              </div>

              {/* Employee table with password reset capability */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[11px] sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">SL</th>
                      <th className="py-2.5 px-3">EID</th>
                      <th className="py-2.5 px-3">Employee Name</th>
                      <th className="py-2.5 px-3">Designation</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Mobile No</th>
                      <th className="py-2.5 px-3 text-right">Password Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.eid} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                          {emp.sl}
                        </td>
                        <td className="py-2.5 px-3 font-bold font-mono text-[#0f5b87]">
                          {emp.eid}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span>{emp.name}</span>
                            {emp.role === 'admin' && (
                              <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-bold">
                                HR
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {emp.designation}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {emp.department || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                          {emp.mobile || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleResetPassword(emp.eid, emp.name)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                            title="Reset password to default EID"
                          >
                            <RotateCcw size={11} />
                            <span>Reset to Default</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Logged in as HR Admin</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
