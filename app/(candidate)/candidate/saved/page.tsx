"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/components/Toast";

export default function CandidateSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch("/api/candidates/saved-jobs");
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data.savedJobs || []);
      }
    } catch {
      showToast("Failed to load saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId: string) => {
    try {
      const res = await fetch("/api/candidates/saved-jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        setSavedJobs(savedJobs.filter((job) => job._id !== jobId));
        showToast("Job removed from saved list");
      } else {
        showToast("Failed to remove job.");
      }
    } catch {
      showToast("Network error. Please try again.");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Saved Jobs
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and manage the job openings you've bookmarked to apply later.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center space-y-4">
          <p className="text-slate-500 text-sm">You haven't bookmarked any jobs yet.</p>
          <Link
            href="/candidate/jobs"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Openings
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {savedJobs.map((job) => {
            if (!job) return null;
            return (
              <div key={job._id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg hover:text-indigo-600 transition-colors">
                    <Link href={`/jobs/${job._id}`}>
                      {job.title}
                    </Link>
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">{job.companyId?.name || "Company"}</span>
                    <span>&bull;</span>
                    <span>{job.location}</span>
                    {job.salaryRange && (
                      <>
                        <span>&bull;</span>
                        <span className="text-emerald-600 font-medium">{job.salaryRange}</span>
                      </>
                    )}
                  </div>
                  {job.status === "closed" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mt-2">
                      Closed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/jobs/${job._id}`}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors bg-white text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleUnsave(job._id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 flex items-center justify-center"
                    aria-label="Remove job"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 12h-15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
