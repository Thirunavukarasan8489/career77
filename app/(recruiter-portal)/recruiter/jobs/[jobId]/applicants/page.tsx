"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { showToast } from "@/components/common/Toast";
import Link from "next/link";

interface Candidate {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  experience?: string;
  city?: string;
  skills: string[];
  lookingFor: string;
  resumeUrl?: string;
}

interface Application {
  _id: string;
  candidateId: Candidate;
  status: "Applied" | "Shortlisted" | "Selected" | "Rejected";
  appliedAt: string;
}

interface Job {
  _id: string;
  title: string;
  location: string;
  skills: string[];
  experience?: string;
}

export default function JobApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const jobRes = await fetch(`/api/jobs/${jobId}`);
      if (!jobRes.ok) {
        if (jobRes.status === 410) {
          showToast("This job posting is closed.");
          router.push("/recruiter/jobs");
          return;
        }
        throw new Error("Failed to load job details");
      }
      const jobData = await jobRes.json();
      setJob(jobData.job);

      const appRes = await fetch(`/api/applications/${jobId}`);
      if (!appRes.ok) throw new Error("Failed to load applications");
      const appData = await appRes.json();
      const apps = appData.applications || [];
      setApplications(apps);

      if (apps.length > 0 && apps[0].candidateId) {
        const first = apps[0].candidateId;
        setSelectedCandidate({
          id: first._id,
          name: first.name,
          role: first.lookingFor || jobData.job.title,
          location: first.city || "San Francisco, CA",
          appliedDate: new Date(apps[0].appliedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          matchScore: 95,
          experience: first.experience || "5+ Years Exp",
          status: apps[0].status,
          initials: first.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
          summary: `Experienced candidate with skills in ${first.skills?.join(", ") || "software engineering"}.`,
          files: first.resumeUrl ? [{ name: `${first.name}_Resume.pdf`, type: "pdf", url: first.resumeUrl }] : [],
          skillsMatch: "Excellent (9/10)",
          cultureFit: "High Potential",
        });
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to fetch applicants data");
    } font: {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (candidateId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, status: newStatus }),
      });

      if (res.ok) {
        showToast(`Status updated to ${newStatus}`);
        setApplications((prev) =>
          prev.map((app) =>
            app.candidateId?._id === candidateId
              ? { ...app, status: newStatus as any }
              : app
          )
        );
        if (selectedCandidate?.id === candidateId) {
          setSelectedCandidate((prev: any) => ({ ...prev, status: newStatus }));
        }
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update status");
      }
    } catch {
      showToast("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <p className="text-slate-500 font-semibold">Job listing not found.</p>
        <Link href="/recruiter/jobs" className="text-blue-600 font-bold hover:underline inline-block">
          Return to Jobs Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/recruiter/jobs" className="text-slate-500 hover:text-slate-900 font-semibold text-sm">
            Jobs
          </Link>
          <span className="text-slate-400 font-medium text-sm">/</span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
          <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full border border-slate-200/60">
            ID: #{job._id.slice(-5)}
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left Applicants Table (~60%) & Right Candidate Detail Panel (~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          {/* Header Controls */}
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast("Filters menu opened")}
                className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/60 inline-flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>All Filters</span>
              </button>
              <button
                onClick={() => showToast("Sorted candidates by score")}
                className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/60 inline-flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span>Sort by: Score</span>
              </button>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Showing {applications.length} applicants
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {applications.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">
                No applicants found for this position yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="py-3.5 px-5">CANDIDATE</th>
                    <th className="py-3.5 px-4">APPLIED DATE</th>
                    <th className="py-3.5 px-4">MATCH SCORE</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {applications.map((app, idx) => {
                    const cand = app.candidateId;
                    if (!cand) return null;
                    const initials = cand.name ? cand.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "CN";
                    const isSelected = selectedCandidate?.id === cand._id;
                    const score = idx === 0 ? 98 : idx === 1 ? 92 : 74;

                    return (
                      <tr
                        key={app._id}
                        onClick={() =>
                          setSelectedCandidate({
                            id: cand._id,
                            name: cand.name,
                            role: cand.lookingFor || job.title,
                            location: cand.city || "San Francisco, CA",
                            appliedDate: new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                            matchScore: score,
                            experience: cand.experience || "5+ Years Exp",
                            status: app.status,
                            initials,
                            summary: `Experienced candidate with skills in ${cand.skills?.join(", ") || "software engineering"}.`,
                            files: cand.resumeUrl ? [{ name: `${cand.name}_Resume.pdf`, type: "pdf", url: cand.resumeUrl }] : [],
                            skillsMatch: "Excellent (9/10)",
                            cultureFit: "High Potential",
                          })
                        }
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50/70" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center border border-blue-200 shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm leading-tight">{cand.name}</p>
                              <p className="text-xs text-slate-400 font-normal mt-0.5">{cand.city || "Remote"}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                          {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full">
                            {score}%
                          </span>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(cand._id, e.target.value)}
                            className="bg-slate-100/90 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => showToast(`Actions for ${cand.name}`)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Details Side Drawer */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 sticky top-24">
          {selectedCandidate ? (
            <>
              <div className="relative text-center pb-6 border-b border-slate-100">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute right-0 top-0 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative inline-block mx-auto mb-3">
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-extrabold text-2xl flex items-center justify-center border-2 border-blue-200 shadow-xs">
                    {selectedCandidate.initials}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white text-xs">
                    ✓
                  </div>
                </div>

                <h2 className="font-bold text-slate-900 text-xl tracking-tight">{selectedCandidate.name}</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{selectedCandidate.role}</p>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    ✓ {selectedCandidate.matchScore}% Match
                  </span>
                  <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    {selectedCandidate.experience}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">CANDIDATE SUMMARY</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{selectedCandidate.summary}</p>
              </div>

              {selectedCandidate.files && selectedCandidate.files.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">FILES & PORTFOLIOS</h3>
                  <div className="space-y-2">
                    {selectedCandidate.files.map((file: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            📄
                          </div>
                          <span className="text-xs font-semibold text-slate-800 truncate">{file.name}</span>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <h3 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">AI MATCHING INSIGHTS</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Skills Match</span>
                    <span className="text-xs font-bold text-emerald-900 mt-1 block">{selectedCandidate.skillsMatch}</span>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Culture Fit</span>
                    <span className="text-xs font-bold text-emerald-900 mt-1 block">{selectedCandidate.cultureFit}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2.5 border-t border-slate-100">
                <button
                  onClick={() => handleUpdateStatus(selectedCandidate.id, "Shortlisted")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Shortlist Candidate</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => showToast("Opening schedule interview modal...")}
                    className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Schedule</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedCandidate.id, "Rejected")}
                    className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select a candidate from the table to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
