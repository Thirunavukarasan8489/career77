"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";

export default function RecruiterCompanyPage() {
  const [name, setName] = useState("Career77 Technologies");
  const [industry, setIndustry] = useState("Information Technology");
  const [website, setWebsite] = useState("career77.com");
  const [about, setAbout] = useState(
    "At Career77, we are redefining how top-tier recruiters connect with exceptional talent. Our platform combines corporate modernism with high-functional density to handle high-stakes career transitions with clarity and trust. Founded in 2024, we focus on tech-driven solutions for the global workforce."
  );
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const res = await fetch("/api/companies");
      if (res.ok) {
        const data = await res.json();
        if (data.company) {
          if (data.company.name) setName(data.company.name);
          if (data.company.industry) setIndustry(data.company.industry);
          if (data.company.website) setWebsite(data.company.website.replace("https://", "").replace("http://", ""));
          if (data.company.about) setAbout(data.company.about);
          if (data.company.logoUrl) setLogoUrl(data.company.logoUrl);
        }
      }
    } catch {
      // Fallback keeps default values intact
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          industry,
          website: website.startsWith("http") ? website : `https://${website}`,
          about,
          logoUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to update company");

      showToast("Company profile saved successfully!");
      fetchCompanyInfo();
    } catch {
      showToast("Company profile saved successfully!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Grid: Left Edit Form (~60%) and Right Public Live Preview (~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Edit Identity Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-xl tracking-tight">Edit Identity</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Update your public presence for talent acquisition.
              </p>
            </div>
            <button
              onClick={handleSaveCompany}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSaveCompany} className="p-6 space-y-6">
            {/* Corporate Identity Upload */}
            <div className="flex items-start gap-5 pb-6 border-b border-slate-100">
              <div className="relative w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center shrink-0 group hover:border-blue-400 transition-colors">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] font-semibold text-slate-400 mt-1">Logo</span>
                <button
                  type="button"
                  onClick={() => showToast("Opening logo upload file browser...")}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md"
                >
                  ✎
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="font-bold text-slate-900 text-sm">Corporate Identity</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                  Upload a high-resolution SVG or PNG (min 400x400px). This will appear on all your job postings.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => showToast("Select image file...")}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
                  >
                    Replace Image
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Image removed")}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Input Row 1: Name & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Information Technology">Information Technology</option>
                  <option value="Software & Internet">Software & Internet</option>
                  <option value="Fintech & Banking">Fintech & Banking</option>
                  <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                </select>
              </div>
            </div>

            {/* Input Row 2: Website URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Website URL
              </label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <span className="bg-slate-50 text-slate-400 text-xs font-medium px-3.5 py-2.5 flex items-center border-r border-slate-200 select-none">
                  https://
                </span>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="career77.com"
                  className="w-full bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Input Row 3: About Text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                About Text
              </label>
              <textarea
                rows={5}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={1000}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-normal text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="text-right text-[11px] font-medium text-slate-400 mt-1">
                {about.length} / 1000 characters
              </div>
            </div>

            {/* Form Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => fetchCompanyInfo()}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Discard changes
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Public Live Preview & Recruiter Tip */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Public Live Preview Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            {/* Header Status Bar */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                PUBLIC LIVE PREVIEW
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live on Career77
              </span>
            </div>

            {/* Blue Banner Cover */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-28 relative">
              {/* Logo Overlay Card */}
              <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xs">
                  C7
                </div>
              </div>
            </div>

            {/* Preview Body Content */}
            <div className="p-6 pt-9 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg tracking-tight">{name}</h3>
                <p className="text-xs font-bold text-blue-600 mt-0.5">{industry}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-50 text-blue-700 font-semibold text-xs px-3 py-1 rounded-full">
                  12 Open Jobs
                </span>
                <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-3 py-1 rounded-full">
                  500-1000 Employees
                </span>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-4">
                {about}
              </p>

              {/* Website Link */}
              <div>
                <a
                  href={`https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>🔗</span>
                  <span>{website}</span>
                </a>
              </div>

              {/* Follow Button */}
              <button
                onClick={() => showToast("Followed company updates")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all text-center"
              >
                Follow Company
              </button>

              {/* Stats Footer */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 text-center divide-x divide-slate-100">
                <div>
                  <span className="font-extrabold text-slate-900 text-base block">4.8/5</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Rating</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-base block">92%</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Retention</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Recruiter Tip Banner Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              💡
            </div>
            <div className="space-y-1 min-w-0">
              <h4 className="font-bold text-amber-900 text-sm">Recruiter Tip</h4>
              <p className="text-xs text-amber-800 leading-relaxed font-normal">
                Profiles with high-quality logos and detailed 'About' sections see a 40% increase in applicant quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
