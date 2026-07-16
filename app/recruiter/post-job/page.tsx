"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";
import Link from "next/link";

export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    location: "",
    experience: "",
    skills: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim()) {
      showToast("Job title and location are required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          location: form.location.trim(),
          experience: form.experience.trim(),
          skills: form.skills,
          description: form.description.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Job opening published successfully!");
        router.push("/recruiter");
      } else {
        showToast(data.error || "Failed to post job");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 grow w-full">
      <div className="mb-6">
        <Link
          href="/recruiter"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Recruiter Panel
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-1.5">
            Post a Job Opening
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            This will appear live on the openings page and notify matched candidates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Backend Engineer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jaipur / Remote"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                Experience Level
              </label>
              <input
                type="text"
                placeholder="e.g. 2-4 years"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Java, Spring Boot, PostgreSQL"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Description
            </label>
            <textarea
              placeholder="Role responsibilities, technical requirements, benefits..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-6 cursor-pointer"
          >
            {submitting ? "Publishing Job..." : "Publish Opening"}
          </button>
        </form>
      </div>
    </div>
  );
}
