"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";

export default function AdminCmsPage() {
  const [heroTitle, setHeroTitle] = useState("Find & Hire Top Talent Faster");
  const [heroSubtitle, setHeroSubtitle] = useState("Career77 connects top job seekers with verified recruiters.");
  const [announcement, setAnnouncement] = useState("⚡ 500+ New Tech & Sales Jobs Added This Week!");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCms();
  }, []);

  const fetchCms = async () => {
    try {
      const res = await fetch("/api/cms?key=landing-hero");
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setHeroTitle(data.content.title || heroTitle);
          setHeroSubtitle(data.content.subtitle || heroSubtitle);
          setAnnouncement(data.content.announcement || announcement);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "landing-hero",
          content: {
            title: heroTitle,
            subtitle: heroSubtitle,
            announcement,
          },
        }),
      });

      if (!res.ok) throw new Error("CMS save failed");

      showToast("Landing page CMS content published live!");
    } catch {
      showToast("Failed to save CMS content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Marketing CMS Content Editor
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Edit landing page headline copy, announcement bar text, and marketing banners live.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Top Announcement Banner</label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Hero Main Title</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Hero Subtitle</label>
          <textarea
            rows={3}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish Content Changes"}
        </button>
      </form>
    </div>
  );
}
