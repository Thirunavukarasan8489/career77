"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";
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

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Job
      const jobRes = await fetch(`/api/jobs/${jobId}`);
      if (!jobRes.ok) {
        if (jobRes.status === 410) {
          showToast("This job posting is closed.");
          router.push("/recruiter");
          return;
        }
        throw new Error("Failed to load job details");
      }
      const jobData = await jobRes.json();
      setJob(jobData.job);

      // 2. Fetch Applications
      const appRes = await fetch(`/api/applications/${jobId}`);
      if (!appRes.ok) throw new Error("Failed to load applications");
      const appData = await appRes.json();
      setApplications(appData.applications || []);

      // 3. Fetch Candidates for Matching
      const candRes = await fetch("/api/candidates");
      if (candRes.ok) {
        const candData = await candRes.json();
        setCandidates(candData.candidates || []);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to fetch dashboard data");
    } finally {
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
        // Update state locally
        setApplications((prev) =>
          prev.map((app) =>
            app.candidateId._id === candidateId
              ? { ...app, status: newStatus as any }
              : app
          )
        );
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update status");
      }
    } catch {
      showToast("Network error. Please try again.");
    }
  };

  // Port client-side version of isMatch (matching.ts)
  const doesCandidateMatchJob = (candidate: Candidate, activeJob: Job) => {
    if (!candidate.lookingFor) return false;

    // 1. Role keyword check
    const firstWord = activeJob.title.toLowerCase().split(/\s+/)[0];
    const candLookingLower = candidate.lookingFor.toLowerCase();
    if (candLookingLower.includes(firstWord) && firstWord.length > 2) {
      return true;
    }

    // 2. Overlapping skills check
    if (activeJob.skills && activeJob.skills.length > 0 && candidate.skills && candidate.skills.length > 0) {
      const candSkillsLower = candidate.skills.map((s) => s.toLowerCase());
      const overlaps = activeJob.skills.some((s) => candSkillsLower.includes(s.toLowerCase()));
      if (overlaps) return true;
    }

    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 grow">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center grow">
        <p className="text-slate-500 font-semibold">Job listing not found.</p>
        <Link href="/recruiter" className="text-indigo-600 hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate unapplied matching candidates
  const appliedCandidateIds = applications.map((a) => a.candidateId?._id);
  const unappliedMatches = candidates.filter(
    (c) => doesCandidateMatchJob(c, job) && !appliedCandidateIds.includes(c._id)
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link
          href="/recruiter"
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-8">
        Applicants &mdash; <span className="text-indigo-600">{job.title}</span>
      </h1>

      {/* APPLICANTS TABLE */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
        <h2 className="font-display font-bold text-lg text-slate-800 mb-6 border-b border-slate-50 pb-3">
          Applied Candidates
        </h2>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px] pb-3">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Contact</th>
                  <th className="pb-3 pr-4">Experience</th>
                  <th className="pb-3 pr-4">Skills</th>
                  <th className="pb-3 pr-4">Resume</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="align-middle">
                    <td className="py-4 pr-4 font-bold text-slate-800">
                      {app.candidateId?.name || "Unknown"}
                    </td>
                    <td className="py-4 pr-4 font-medium text-slate-600">
                      <div>{app.candidateId?.mobile}</div>
                      <div className="text-[10px] text-slate-400">
                        {app.candidateId?.email || "No email"}
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-medium text-slate-500 text-xs">
                      {app.candidateId?.experience || "—"}
                    </td>
                    <td className="py-4 pr-4 text-xs font-semibold text-slate-600 max-w-[200px]">
                      {app.candidateId?.skills?.join(", ") || "—"}
                    </td>
                    <td className="py-4 pr-4">
                      {app.candidateId?.resumeUrl ? (
                        <a
                          href={app.candidateId.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:underline font-bold"
                        >
                          View Resume &rarr;
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No file (AI resume)</span>
                      )}
                    </td>
                    <td className="py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.candidateId._id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400">
            <span className="block text-3xl mb-2">👥</span>
            <p className="text-sm font-semibold text-slate-500">No applicants yet for this listing.</p>
          </div>
        )}
      </section>

      {/* RECOMMENDED CANDIDATES TABLE */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-slate-800 mb-2 border-b border-slate-50 pb-3">
          Recommended Candidates
        </h2>
        <p className="text-xs text-slate-400 mb-6 font-medium">
          Registered candidates looking for this type of role who haven't applied yet.
        </p>

        {unappliedMatches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px] pb-3">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Preferred Role</th>
                  <th className="pb-3 pr-4">Experience</th>
                  <th className="pb-3 pr-4">Skills</th>
                  <th className="pb-3">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unappliedMatches.map((cand) => (
                  <tr key={cand._id} className="align-middle">
                    <td className="py-4 pr-4 font-bold text-slate-800">
                      {cand.name}
                    </td>
                    <td className="py-4 pr-4 font-semibold text-indigo-600 text-xs">
                      {cand.lookingFor}
                    </td>
                    <td className="py-4 pr-4 font-medium text-slate-500 text-xs">
                      {cand.experience || "—"}
                    </td>
                    <td className="py-4 pr-4 text-xs font-medium text-slate-500 max-w-[200px]">
                      {cand.skills?.join(", ") || "—"}
                    </td>
                    <td className="py-4 font-bold text-slate-700 text-xs">
                      {cand.mobile}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
            <span className="block text-2xl mb-1.5">🤝</span>
            <p className="text-xs font-semibold text-slate-500">No matching unapplied candidates found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
