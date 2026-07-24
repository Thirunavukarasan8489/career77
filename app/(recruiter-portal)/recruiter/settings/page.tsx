"use client";

import { useState } from "react";
import { showToast } from "@/components/common/Toast";

export default function RecruiterSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoMatchNotify, setAutoMatchNotify] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Recruiter account settings updated.");
  };

  return (
    <div className=" border-slate-700 space-y-6">
      <div className="border-b border-slate-300 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Recruiter Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure notification alerts, auto-match triggers, and account security.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-300">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">New Application Alerts</h4>
              <p className="text-xs text-slate-400">Receive instant email when a candidate applies to your job</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-300">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Candidate Auto-Match Notifications</h4>
              <p className="text-xs text-slate-400">Automatically notify matching candidate profiles when a job is posted</p>
            </div>
            <input
              type="checkbox"
              checked={autoMatchNotify}
              onChange={(e) => setAutoMatchNotify(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-300 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
