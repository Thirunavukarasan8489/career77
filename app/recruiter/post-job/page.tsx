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
    salaryRange: "",
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
          salaryRange: form.salaryRange.trim(),
          description: form.description.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Job opening published successfully!");
        router.push("/recruiter/jobs");
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
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-5">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Post a New Job
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Publish a new job listing to attract top candidates.
          </p>
        </div>
        <Link
          href="/recruiter/jobs"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          &larr; Back to Jobs
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
            Job Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Senior Backend Engineer"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
              Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jaipur / Remote"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
              Experience Level
            </label>
            <input
              type="text"
              placeholder="e.g. 2-4 years"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
              Salary Range
            </label>
            <input
              type="text"
              placeholder="e.g. ₹12-16 LPA"
              value={form.salaryRange}
              onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
            Key Skills (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. Node.js, Express, PostgreSQL"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
            Job Description
          </label>
          <textarea
            rows={5}
            placeholder="Responsibilities, requirements, perks..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
        >
          {submitting ? "Publishing Job..." : "Publish Job Posting"}
        </button>
      </form>
    </div>
  );
}
