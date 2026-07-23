"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/common/Toast";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs?limit=50");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Job status changed to ${newStatus}`);
        fetchJobs();
      }
    } catch {
      showToast("Failed to update status.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Jobs Moderation
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review, approve, or close job postings across the entire platform.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      job.status === "open"
                        ? "bg-emerald-900/60 text-emerald-300"
                        : "bg-rose-900/60 text-rose-300"
                    }`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-white text-base">{job.title}</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Location: {job.location} • Posted: {new Date(job.postedAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => toggleJobStatus(job._id, job.status)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
              >
                {job.status === "open" ? "Close & Unpublish Job" : "Approve & Open Job"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
