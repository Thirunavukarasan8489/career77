"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { showToast } from "@/components/Toast";
import Link from "next/link";

export default function RecruiterSettingsPage() {
  const { data: session, update } = useSession();
  const [companyName, setCompanyName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setCompanyName(session.user.name || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      showToast("Company name is required");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        showToast("Password must be at least 6 characters long");
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast("Passwords do not match");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/recruiter/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          newPassword: newPassword ? newPassword.trim() : undefined,
        }),
      });

      if (res.ok) {
        showToast("Settings updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        
        // Update local session storage
        await update({
          ...session,
          user: {
            ...session?.user,
            name: companyName.trim(),
          },
        });
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update settings.");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900">
            Recruiter Settings
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Manage your company profile and security details.
          </p>
        </div>
      </div>

      <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address - Read Only */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
              Login Email
            </label>
            <input
              type="text"
              readOnly
              value={session?.user?.email || ""}
              className="w-full bg-slate-50 border border-slate-200 text-slate-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed outline-none"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="border-t border-slate-100 pt-5 mt-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-6 cursor-pointer"
          >
            {saving ? "Updating..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
