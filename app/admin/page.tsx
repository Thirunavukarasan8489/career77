"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/components/Toast";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("Last 7 Days");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // Fallback handles UI smoothly
    } finally {
      setLoading(false);
    }
  };

  // Data for Platform Growth / Activity bar chart (Mon - Sun)
  const chartDays = [
    { day: "Mon", total: 42, bottomHeight: "50%", topHeight: "25%" },
    { day: "Tue", total: 68, bottomHeight: "65%", topHeight: "20%" },
    { day: "Wed", total: 85, bottomHeight: "75%", topHeight: "15%" },
    { day: "Thu", total: 54, bottomHeight: "60%", topHeight: "20%" },
    { day: "Fri", total: 110, bottomHeight: "100%", topHeight: "0%" },
    { day: "Sat", total: 35, bottomHeight: "40%", topHeight: "25%" },
    { day: "Sun", total: 48, bottomHeight: "45%", topHeight: "30%" },
  ];

  return (
    <div className="space-y-8">
      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Users */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              +14% this month
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Platform Users</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.totalUsers ?? 128}
            </p>
          </div>
        </div>

        {/* Card 2: Verified Companies */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              100% verified
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Verified Companies</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.verifiedCompanies ?? 24}
            </p>
          </div>
        </div>

        {/* Card 3: Active Jobs Moderation */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
              +8 live today
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Job Postings</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.activeJobs ?? 86}
            </p>
          </div>
        </div>

        {/* Card 4: Pending Verifications */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-800/90 text-white px-2.5 py-0.5 rounded-md">
              Action Needed
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Verifications</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.pendingVerifications ?? 3}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: 2 Columns (Left: Platform Activity Bar Chart, Right: Audit & System Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Platform Activity Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-lg tracking-tight">Platform Growth & Activity</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Daily candidate signups and recruiter job posts</p>
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
                      {item.total} events
                    </div>
                    {item.topHeight !== "0%" && (
                      <div
                        className="w-full bg-purple-100 rounded-t-xl transition-all group-hover:bg-purple-200"
                        style={{ height: item.topHeight }}
                      />
                    )}
                    <div
                      className="w-full bg-purple-600 transition-all group-hover:bg-purple-700"
                      style={{
                        height: item.bottomHeight,
                        borderTopLeftRadius: item.topHeight === "0%" ? "12px" : "0px",
                        borderTopRightRadius: item.topHeight === "0%" ? "12px" : "0px",
                        borderBottomLeftRadius: "6px",
                        borderBottomRightRadius: "6px",
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-3 group-hover:text-purple-600 transition-colors">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: System Audit & Activity Feed */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">System Audit Log</h2>
            <Link
              href="/admin/analytics"
              className="text-purple-600 hover:text-purple-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              View Full Logs
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">TechCorp Inc.</strong> submitted GSTIN certificate for verification
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">1 hour ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">12 New Candidates</strong> registered profile on Career77 platform
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">3 hours ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  Job posting <strong className="font-bold text-purple-600">Senior Full Stack Engineer</strong> published by InnovateX
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">5 hours ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Subscription Renewed</strong> — Enterprise Plan by Horizon Tech
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 2 Columns (Left: Pending Verification Queue, Right: 2x2 Quick Action Cards Grid + Floating Action Button) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pending Verification Queue Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">Pending Verifications</h2>
            <span className="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              3 ACTION NEEDED
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm shrink-0 ring-2 ring-white shadow-xs">
                  TC
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">TechCorp Solutions</p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    GSTIN: 07AAAAA0000A1Z5 • Submitted 2 hrs ago
                  </p>
                </div>
              </div>
              <Link
                href="/admin/verification"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm shrink-0"
              >
                Review &rarr;
              </Link>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0 ring-2 ring-white shadow-xs">
                  IX
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">InnovateX Labs</p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    CIN: U72200DL2021PTC384920 • Submitted Yesterday
                  </p>
                </div>
              </div>
              <Link
                href="/admin/verification"
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all shrink-0"
              >
                Review &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: 2x2 Quick Action Cards Grid + Floating Action Button */}
        <div className="lg:col-span-6 relative">
          <button
            onClick={() => showToast("Opening Super Admin quick actions menu...")}
            className="absolute -top-3 -right-3 z-10 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 transition-all"
            title="Add Quick Admin Task"
          >
            +
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/verification"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-5 shadow-md shadow-purple-500/20 flex flex-col justify-between min-h-[120px] transition-all hover:scale-[1.01]"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-white">Verifications</h3>
                <p className="text-xs text-purple-100 mt-0.5">3 document approvals pending</p>
              </div>
            </Link>

            <Link
              href="/admin/cms"
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px]"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">CMS Editor</h3>
                <p className="text-xs text-slate-400 mt-0.5">Landing page banners & text</p>
              </div>
            </Link>

            <Link
              href="/admin/support"
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px]"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">Support Tickets</h3>
                <p className="text-xs text-slate-400 mt-0.5">1 open ticket query</p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px]"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">System Settings</h3>
                <p className="text-xs text-slate-400 mt-0.5">Platform configuration</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
