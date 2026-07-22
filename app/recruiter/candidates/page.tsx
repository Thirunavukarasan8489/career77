"use client";

import { useState } from "react";
import Link from "next/link";
import { showToast } from "@/components/Toast";

export default function RecruiterCandidatesPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<any>({
    id: "cand1",
    name: "Sarah M********",
    fullName: "Sarah Jenkins",
    role: "Senior UX/UI Product Designer",
    location: "San Francisco, CA",
    appliedDate: "Oct 14, 2023",
    matchScore: 98,
    experience: "8+ Years Exp",
    status: "Reviewing",
    initials: "SM",
    avatarBg: "bg-blue-100 text-blue-700",
    summary:
      "Highly skilled product designer with a background in SaaS and FinTech. Expert in Figma, design systems, and user research methodologies. Previously at Stripe and Adobe.",
    files: [
      { name: "Resume_Sarah_M.pdf", type: "pdf", url: "#" },
      { name: "Portfolio_Website.url", type: "link", url: "https://sarah.design" },
    ],
    skillsMatch: "Excellent (9/10)",
    cultureFit: "High Potential",
  });

  const [candidatesList, setCandidatesList] = useState<any[]>([
    {
      id: "cand1",
      name: "Sarah M********",
      fullName: "Sarah Jenkins",
      role: "Senior UX/UI Product Designer",
      location: "San Francisco, CA",
      appliedDate: "Oct 14, 2023",
      matchScore: 98,
      experience: "8+ Years Exp",
      status: "Reviewing",
      initials: "SM",
      avatarBg: "bg-blue-100 text-blue-700 border-blue-200",
      summary:
        "Highly skilled product designer with a background in SaaS and FinTech. Expert in Figma, design systems, and user research methodologies. Previously at Stripe and Adobe.",
      files: [
        { name: "Resume_Sarah_M.pdf", type: "pdf", url: "#" },
        { name: "Portfolio_Website.url", type: "link", url: "https://sarah.design" },
      ],
      skillsMatch: "Excellent (9/10)",
      cultureFit: "High Potential",
    },
    {
      id: "cand2",
      name: "James T********",
      fullName: "James Thorne",
      role: "Frontend Engineer",
      location: "London, UK",
      appliedDate: "Oct 12, 2023",
      matchScore: 92,
      experience: "5+ Years Exp",
      status: "New Applied",
      initials: "JT",
      avatarBg: "bg-amber-100 text-amber-700 border-amber-200",
      summary:
        "Senior Frontend Specialist with strong React, Next.js, and TypeScript expertise. Passioned about performant UI architectures.",
      files: [{ name: "Resume_James_T.pdf", type: "pdf", url: "#" }],
      skillsMatch: "Very Good (8.5/10)",
      cultureFit: "Great Match",
    },
    {
      id: "cand3",
      name: "Aria L********",
      fullName: "Aria Lopez",
      role: "UX Researcher",
      location: "Austin, TX",
      appliedDate: "Oct 11, 2023",
      matchScore: 74,
      experience: "4+ Years Exp",
      status: "Shortlisted",
      initials: "AL",
      avatarBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
      summary:
        "User experience researcher focused on qualitative interviews, usability testing, and data-driven product insights.",
      files: [{ name: "Resume_Aria_L.pdf", type: "pdf", url: "#" }],
      skillsMatch: "Good (7.5/10)",
      cultureFit: "Moderate",
    },
    {
      id: "cand4",
      name: "David K********",
      fullName: "David Kevin",
      role: "Backend Engineer",
      location: "Remote",
      appliedDate: "Oct 10, 2023",
      matchScore: 45,
      experience: "2+ Years Exp",
      status: "Rejected",
      initials: "DK",
      avatarBg: "bg-slate-200 text-slate-700 border-slate-300",
      summary:
        "Junior Go & Node.js backend developer eager to build scalable web APIs.",
      files: [{ name: "Resume_David_K.pdf", type: "pdf", url: "#" }],
      skillsMatch: "Basic (4.5/10)",
      cultureFit: "Needs Review",
    },
  ]);

  const updateCandidateStatus = (candidateId: string, newStatus: string) => {
    setCandidatesList((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );
    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate((prev: any) => ({ ...prev, status: newStatus }));
    }
    showToast(`Candidate status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Breadcrumb */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Applicants</h1>
          <span className="text-slate-400 font-medium text-sm">/</span>
          <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full border border-slate-200/60">
            Senior UX Designer (ID: #4492)
          </span>
        </div>
      </div> */}

      {/* Main Split Layout: Left Table (~60%) and Right Detail Drawer (~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Applicants Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          {/* Table Header Filter Row */}
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
                onClick={() => showToast("Sorted candidates by match score")}
                className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/60 inline-flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span>Sort by: Score</span>
              </button>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Showing 128 applicants</span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
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
                {candidatesList.map((cand) => {
                  const isSelected = selectedCandidate?.id === cand.id;
                  return (
                    <tr
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-50/70" : "hover:bg-slate-50/60"
                      }`}
                    >
                      {/* Candidate Name & Location */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${cand.avatarBg} font-extrabold text-xs flex items-center justify-center border shrink-0`}
                          >
                            {cand.initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight">{cand.name}</p>
                            <p className="text-xs text-slate-400 font-normal mt-0.5">{cand.location}</p>
                          </div>
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {cand.appliedDate}
                      </td>

                      {/* Match Score Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {cand.matchScore >= 90 ? (
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full">
                            {cand.matchScore}%
                          </span>
                        ) : cand.matchScore >= 70 ? (
                          <span className="bg-amber-100 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-full">
                            {cand.matchScore}%
                          </span>
                        ) : (
                          <span className="bg-rose-100 text-rose-800 font-bold text-xs px-2.5 py-1 rounded-full">
                            {cand.matchScore}%
                          </span>
                        )}
                      </td>

                      {/* Status Select */}
                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={cand.status}
                          onChange={(e) => updateCandidateStatus(cand.id, e.target.value)}
                          className="bg-slate-100/90 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="New Applied">New Applied</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Options Button */}
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
          </div>
        </div>

        {/* Right Column (5 cols): Selected Candidate Details Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 sticky top-24">
          {selectedCandidate ? (
            <>
              {/* Header Details with Avatar */}
              <div className="relative text-center pb-6 border-b border-slate-100">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute right-0 top-0 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Big Initials Circle Avatar with Checkmark */}
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

                {/* Badges */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    ✓ {selectedCandidate.matchScore}% Match
                  </span>
                  <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    {selectedCandidate.experience}
                  </span>
                </div>
              </div>

              {/* Candidate Summary */}
              <div className="space-y-2">
                <h3 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">CANDIDATE SUMMARY</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{selectedCandidate.summary}</p>
              </div>

              {/* Files & Portfolios */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">FILES & PORTFOLIOS</h3>
                <div className="space-y-2">
                  {selectedCandidate.files?.map((file: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {file.type === "pdf" ? (
                          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            📄
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            🔗
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-800 truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => showToast(`Opening ${file.name}`)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Matching Insights */}
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

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5 border-t border-slate-100">
                <button
                  onClick={() => updateCandidateStatus(selectedCandidate.id, "Shortlisted")}
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
                    onClick={() => updateCandidateStatus(selectedCandidate.id, "Rejected")}
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
