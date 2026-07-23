"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";

export default function CandidateDashboardPage() {
  const { candidate } = useApp();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("Last 7 Days");

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
      // Fallback handles UI gracefully
    } finally {
      setLoading(false);
    }
  };

  const activeApplicationsCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length;
  const candidateName = candidate?.name || "Candidate";

  // Data for Profile Views / Application Activity bar chart (Mon - Sun)
  const chartDays = [
    { day: "Mon", total: 18, bottomHeight: "45%", topHeight: "20%" },
    { day: "Tue", total: 32, bottomHeight: "60%", topHeight: "25%" },
    { day: "Wed", total: 45, bottomHeight: "75%", topHeight: "15%" },
    { day: "Thu", total: 28, bottomHeight: "50%", topHeight: "20%" },
    { day: "Fri", total: 60, bottomHeight: "95%", topHeight: "0%" },
    { day: "Sat", total: 22, bottomHeight: "40%", topHeight: "20%" },
    { day: "Sun", total: 35, bottomHeight: "55%", topHeight: "15%" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold backdrop-blur-md border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Profile Status: Ready for Recruiter Discovery
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
            Welcome back, {candidateName}! 👋
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm max-w-xl font-normal">
            You have <strong className="text-white font-bold">{shortlistedCount} shortlisted application{shortlistedCount !== 1 ? 's' : ''}</strong> and 2 recruiter profile views today.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/candidate/jobs"
            className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition-all text-center"
          >
            Explore Openings &rarr;
          </Link>
          <Link
            href="/candidate/resume"
            className="px-5 py-2.5 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl border border-white/20 transition-all text-center"
          >
            Update Resume
          </Link>
        </div>

        {/* Ambient Glow Graphic */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Applications */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              +1 this week
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Applications</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {activeApplicationsCount}
            </p>
          </div>
        </div>

        {/* Card 2: Profile Views */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              +18 new
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Recruiter Views</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">142</p>
          </div>
        </div>

        {/* Card 3: Job Recommendations */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-800/90 text-white px-2.5 py-0.5 rounded-md">
              28 matches
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Recommended Jobs</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">28</p>
          </div>
        </div>

        {/* Card 4: Scheduled Interviews */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              2 upcoming
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Scheduled Interviews</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">2</p>
          </div>
        </div>
      </div>

      {/* Middle Section: 2 Columns (Left: Engagement Chart, Right: Activity Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Engagement & Profile Views Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-lg tracking-tight">Profile Views & Discovery</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Recruiter impressions & job match views for the past 7 days</p>
            </div>
            <button
              onClick={() => {
                const next = timeframe === "Last 7 Days" ? "Last 30 Days" : "Last 7 Days";
                setTimeframe(next);
                showToast(`Filter updated to ${next}`);
              }}
              className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200/60 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{timeframe}</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="pt-6 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-4">
              {chartDays.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="w-full max-w-[48px] h-full flex flex-col justify-end gap-1 relative">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                      {item.total} views
                    </div>
                    {item.topHeight !== "0%" && (
                      <div
                        className="w-full bg-indigo-100 rounded-t-xl transition-all group-hover:bg-indigo-200"
                        style={{ height: item.topHeight }}
                      />
                    )}
                    <div
                      className="w-full bg-indigo-600 transition-all group-hover:bg-indigo-700"
                      style={{
                        height: item.bottomHeight,
                        borderTopLeftRadius: item.topHeight === "0%" ? "12px" : "0px",
                        borderTopRightRadius: item.topHeight === "0%" ? "12px" : "0px",
                        borderBottomLeftRadius: "6px",
                        borderBottomRightRadius: "6px",
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-3 group-hover:text-indigo-600 transition-colors">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Application Updates Feed */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">Recent Activity</h2>
            <Link
              href="/candidate/applications"
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  Application <strong className="font-bold text-slate-900">Shortlisted</strong> by TechCorp for{" "}
                  <strong className="font-bold text-indigo-600">Senior Full Stack Developer</strong>
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">2 hours ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Interview Scheduled</strong> with Lead Recruiter Alex Rivera for Product Engineer
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">5 hours ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Resume Viewed</strong> by InnovateX hiring team
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">Yesterday</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Resume Upload Verified</strong> (Cloudinary Secure PDF)
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 2 Columns (Left: Upcoming Interviews, Right: 2x2 Quick Actions + Floating Button) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upcoming Interviews */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">Upcoming Interviews</h2>
            <span className="bg-indigo-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              2 SCHEDULED
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm shrink-0 ring-2 ring-white shadow-xs">
                  TC
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">TechCorp Solutions</p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    Senior Full Stack Developer • Technical Interview
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-xs text-indigo-600 whitespace-nowrap">Tomorrow, 11:30 AM</p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Zoom Video Call</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm shrink-0 ring-2 ring-white shadow-xs">
                  IX
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">InnovateX Technologies</p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    Product Engineer • Final Round
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-xs text-indigo-600 whitespace-nowrap">Friday, 03:00 PM</p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Google Meet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 2x2 Quick Action Cards Grid + Floating Action Button */}
        <div className="lg:col-span-6 relative">
          <button
            onClick={() => showToast("Opening Quick Job Search...")}
            className="absolute -top-3 -right-3 z-10 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
            title="Explore Jobs"
          >
            +
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/candidate/jobs"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-5 shadow-md shadow-indigo-500/20 flex flex-col justify-between min-h-[120px] transition-all hover:scale-[1.01]"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-white">Search Jobs</h3>
                <p className="text-xs text-indigo-100 mt-0.5">Explore 200+ matched roles</p>
              </div>
            </Link>

            <Link
              href="/candidate/resume"
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px]"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">My Resume</h3>
                <p className="text-xs text-slate-400 mt-0.5">Upload & PDF Preview</p>
              </div>
            </Link>

            <Link
              href="/candidate/applications"
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px]"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">Applications</h3>
                <p className="text-xs text-slate-400 mt-0.5">Track status updates</p>
              </div>
            </Link>

            <Link
              href="/candidate/profile"
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px]"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">Edit Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Skills & Preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
