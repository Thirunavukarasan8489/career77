"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";
import Link from "next/link";

interface JobData {
  _id: string;
  title: string;
  location: string;
  experience: string;
  skills: string;
  description: string;
  status: "open" | "closed";
}

export default function EditJobForm({ initialData }: { initialData: JobData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData.title,
    location: initialData.location,
    experience: initialData.experience,
    skills: initialData.skills,
    description: initialData.description,
    status: initialData.status,
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
      const res = await fetch(`/api/jobs/${initialData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          location: form.location.trim(),
          experience: form.experience.trim(),
          skills: form.skills,
          description: form.description.trim(),
          status: form.status,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Job opening updated successfully!");
        router.push("/recruiter");
      } else {
        showToast(data.error || "Failed to update job");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 w-full">
      <div className="mb-6">
        <Link
          href="/recruiter"
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-1.5">
            Edit Job Opening
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Update your job requirements, location, or status.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Title */}
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Location & Experience */}
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                Experience Requirement
              </label>
              <input
                type="text"
                placeholder="e.g. 2-5 years"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
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
              placeholder="e.g. Node.js, Mongoose, Express"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Job Status */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Job Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "open" | "closed" })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer font-semibold text-slate-700"
            >
              <option value="open">Active / Open</option>
              <option value="closed">Closed / Gone (410)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Job Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the job role and candidate requirements..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer text-center"
            >
              {submitting ? "Updating..." : "Update Job Listing"}
            </button>
            <Link
              href="/recruiter"
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
