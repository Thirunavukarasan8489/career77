"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";

export default function CandidateSettingsPage() {
  const { candidate } = useApp();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Account settings saved.");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Account Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your email alerts, notification preferences, and privacy controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Email Notifications</h4>
              <p className="text-xs text-slate-500">Receive application status changes via email</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Automated Job Alerts</h4>
              <p className="text-xs text-slate-500">Get notified when new postings match your key skills</p>
            </div>
            <input
              type="checkbox"
              checked={jobAlerts}
              onChange={(e) => setJobAlerts(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
