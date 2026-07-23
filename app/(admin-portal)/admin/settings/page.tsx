"use client";

import { useState } from "react";
import { showToast } from "@/components/common/Toast";

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoVerifyDomains, setAutoVerifyDomains] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("System settings updated.");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          System & Platform Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Global application environment variables, maintenance toggles, and security configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <h4 className="font-bold text-white text-sm">Platform Maintenance Mode</h4>
              <p className="text-xs text-slate-400">Temporarily restrict candidate application submissions</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <h4 className="font-bold text-white text-sm">Auto-Approve Enterprise Domains</h4>
              <p className="text-xs text-slate-400">Automatically grant Verified status to recognized recruiter domains</p>
            </div>
            <input
              type="checkbox"
              checked={autoVerifyDomains}
              onChange={(e) => setAutoVerifyDomains(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Save System Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
