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
  const { candidate, refreshCandidate } = useApp();
  const [lookingInput, setLookingInput] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [savingLooking, setSavingLooking] = useState(false);

  useEffect(() => {
    if (candidate) {
      setLookingInput(candidate.lookingFor);
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

  const handleUpdateLooking = async () => {
    if (!lookingInput.trim()) {
      showToast("Preferred job field cannot be empty");
      return;
    }
    setSavingLooking(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookingFor: lookingInput.trim() }),
      });
      if (res.ok) {
        showToast("Search preference updated!");
        refreshCandidate();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update preferences");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSavingLooking(false);
    }
  };

  if (!candidate) {
    return (
      <div className="flex justify-center items-center py-20 grow">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grow bg-slate-50">
      {/* DASH HEADER */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-2xl font-display">
            {candidate.name[0].toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-display font-black text-2xl text-slate-900 mb-1">
              {candidate.name}
            </h1>
            <p className="text-slate-500 text-sm font-semibold">
              Looking for: <span className="text-blue-600">{candidate.lookingFor}</span>
            </p>
            {candidate.city && (
              <p className="text-slate-400 text-xs font-semibold mt-1">📍 {candidate.city}</p>
            )}
          </div>
        </div>
      </header>

      {/* DASH GRID */}
      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Applications */}
        <section className="md:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-extrabold text-lg text-slate-900 mb-6 border-b border-slate-50 pb-3">
              My Applications
            </h2>

            {loadingApps ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
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
                          className="font-bold text-slate-800 hover:text-blue-600 transition-colors text-sm sm:text-base"
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
                            : "bg-blue-50 text-blue-600 border border-blue-200"
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
                <Link href="/openings" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                  Browse openings to apply
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Cards */}
        <section className="space-y-6">
          {/* Target preference */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Looking For
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={lookingInput}
                onChange={(e) => setLookingInput(e.target.value)}
                placeholder="e.g. Node Developer, Pune"
                className="grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                onClick={handleUpdateLooking}
                disabled={savingLooking}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {savingLooking ? "Saving..." : "Save"}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Update this to match recommended jobs.
            </p>
          </div>

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
                      className="text-[10px] text-blue-600 hover:underline block truncate font-semibold"
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
                  className="text-[10px] text-blue-600 hover:underline mt-1 inline-block font-bold"
                >
                  View Preview Page
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
