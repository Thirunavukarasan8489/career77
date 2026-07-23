"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          My Applications
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Track real-time hiring pipeline updates for all submitted job applications.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center space-y-4">
          <p className="text-slate-500 text-sm">You haven't submitted any job applications yet.</p>
          <Link
            href="/candidate/jobs"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            Explore Openings &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(app.status)}`}>
                  {app.status}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-2">{app.jobId?.title || "Job Posting"}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()} • {app.jobId?.location || "India"}
                </p>
              </div>

              {app.jobId && (
                <Link
                  href={`/jobs/${app.jobId.slug || app.jobId._id}`}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors text-center"
                >
                  View Job Details
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
