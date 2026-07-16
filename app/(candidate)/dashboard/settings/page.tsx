"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";
import Link from "next/link";

export default function CandidateSettingsPage() {
  const { candidate, refreshCandidate } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    experience: "",
    skills: "",
    lookingFor: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (candidate) {
      setForm({
        name: candidate.name || "",
        email: candidate.email || "",
        city: candidate.city || "",
        experience: candidate.experience || "",
        skills: candidate.skills ? candidate.skills.join(", ") : "",
        lookingFor: candidate.lookingFor || "",
      });
    }
  }, [candidate]);

  if (!candidate) {
    return (
      <div className="flex justify-center items-center py-20 grow">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Name is required");
      return;
    }
    if (!form.lookingFor.trim()) {
      showToast("Preferred job field (Looking For) is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          city: form.city.trim(),
          experience: form.experience.trim(),
          skills: form.skills,
          lookingFor: form.lookingFor.trim(),
        }),
      });

      if (res.ok) {
        showToast("Profile settings saved successfully!");
        await refreshCandidate();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update profile settings.");
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
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Manage your candidate profile information.
          </p>
        </div>
      </div>

      <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mobile Number - Read Only */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
              Mobile Number (Login ID)
            </label>
            <input
              type="text"
              readOnly
              value={candidate.mobile}
              className="w-full bg-slate-50 border border-slate-200 text-slate-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed outline-none"
            />
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              Mobile number cannot be changed as it is your unique identifier.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. john.doe@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* City & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                City / Location
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Jaipur"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                Experience Level
              </label>
              <input
                type="text"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                placeholder="e.g. 2 years / Fresher"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Key Skills */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Key Skills (comma separated)
            </label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="e.g. React, Node.js, TypeScript"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Preferred Job Field (Looking For) */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Preferred Job Field <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.lookingFor}
              onChange={(e) => setForm({ ...form, lookingFor: e.target.value })}
              placeholder="e.g. Software Development"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Resume Link */}
          {candidate.resumeUrl && (
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
                Current Resume
              </label>
              <a
                href={`/api/uploads/view?url=${encodeURIComponent(candidate.resumeUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
              >
                View Uploaded Resume File &rarr;
              </a>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-6 cursor-pointer"
          >
            {saving ? "Saving Changes..." : "Save Profile Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
