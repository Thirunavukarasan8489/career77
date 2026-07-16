"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";
import Link from "next/link";

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    location: string;
    slug: string;
  } | null;
  status: "Applied" | "Shortlisted" | "Selected" | "Rejected";
  appliedAt: string;
}

export default function CandidateDashboard() {
  const { candidate } = useApp();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    if (candidate) {
      fetchApplications();
    }
  }, [candidate]);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (e) {
      console.error("Error loading applications:", e);
    } finally {
      setLoadingApps(false);
    }
  };

  if (!candidate) {
    return (
      <div className="flex justify-center items-center py-20 grow">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900">
            Welcome, {candidate.name}!
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Track your job applications and matches.
          </p>
        </div>
      </div>

      {/* DASH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Applications */}
        <section className="md:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-extrabold text-lg text-slate-900 mb-6 border-b border-slate-50 pb-3">
              My Applications
            </h2>

            {loadingApps ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="flex justify-between items-center gap-4 py-3 border-b border-slate-100 last:border-b-0 last:pb-0"
                  >
                    <div>
                      {app.jobId ? (
                        <Link
                          href={`/openings/${app.jobId.slug}-${app.jobId._id}`}
                          className="font-bold text-slate-800 hover:text-indigo-600 transition-colors text-sm sm:text-base"
                        >
                          {app.jobId.title}
                        </Link>
                      ) : (
                        <span className="font-bold text-slate-400 text-sm sm:text-base">
                          Outdated Job Opening
                        </span>
                      )}
                      <p className="text-xs text-slate-400 mt-0.5">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          app.status === "Shortlisted"
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : app.status === "Selected"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : app.status === "Rejected"
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                <span className="block text-3xl mb-2">📄</span>
                <p className="text-sm font-semibold text-slate-500">No applications submitted yet.</p>
                <Link href="/openings" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
                  Browse openings to apply
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Cards */}
        <section className="space-y-6">
          {/* Resume display */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Resume on File
            </h3>
            {candidate.resumeUrl ? (
              <div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                  <span className="text-xl">📄</span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-slate-700 block truncate">
                      Uploaded Resume
                    </span>
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-600 hover:underline block truncate font-semibold"
                    >
                      View upload file &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                <span className="block text-xl mb-1">📝</span>
                <p className="text-xs text-slate-400 font-semibold">AI Generated Resume</p>
                <Link
                  href="/register/preview"
                  className="text-[10px] text-indigo-600 hover:underline mt-1 inline-block font-bold"
                >
                  View Preview Page
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
