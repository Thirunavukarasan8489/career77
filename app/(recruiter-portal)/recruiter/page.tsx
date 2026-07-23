"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/components/common/Toast";

export default function RecruiterDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("Last 7 Days");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, jobsRes] = await Promise.all([
        fetch("/api/recruiter/analytics"),
        fetch("/api/jobs?limit=5"),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setStats(data);
      }
      if (jobsRes.ok) {
        const jData = await jobsRes.json();
        setJobs(jData.jobs || []);
      }
    } catch {
      // Fallback handles UI smoothly
    } finally {
      setLoading(false);
    }
  };

  // Data for Applications Over Time bar chart (Mon - Sun)
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
        {/* Card 1: Active Jobs */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              +2 this week
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Jobs</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.activeJobs ?? (jobs.length > 0 ? jobs.length : 12)}
            </p>
          </div>
        </div>

        {/* Card 2: Total Applicants */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              +48 new
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Applicants</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.totalApplications ? stats.totalApplications.toLocaleString() : "1,284"}
            </p>
          </div>
        </div>

        {/* Card 3: Interviews This Week */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-800/90 text-white px-2.5 py-0.5 rounded-md">
              8 today
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Interviews This Week</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.interviewsScheduled ?? 24}
            </p>
          </div>
        </div>

        {/* Card 4: Hires This Month */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              Goal: 10
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Hires This Month</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">7</p>
          </div>
        </div>
      </div>

      {/* Middle Section: 2 Columns (Left: Applications Bar Chart, Right: Recent Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Applications Over Time Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-lg tracking-tight">Applications Over Time</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Daily application volume for the past 7 days</p>
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

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-4">
              {chartDays.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  {/* Bar Column Stack */}
                  <div className="w-full max-w-[48px] h-full flex flex-col justify-end gap-1 relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                      {item.total} apps
                    </div>
                    {/* Top Soft Blue Segment */}
                    {item.topHeight !== "0%" && (
                      <div
                        className="w-full bg-blue-100 rounded-t-xl transition-all group-hover:bg-blue-200"
                        style={{ height: item.topHeight }}
                      />
                    )}
                    {/* Bottom Solid Blue Segment */}
                    <div
                      className="w-full bg-blue-600 transition-all group-hover:bg-blue-700"
                      style={{
                        height: item.bottomHeight,
                        borderTopLeftRadius: item.topHeight === "0%" ? "12px" : "0px",
                        borderTopRightRadius: item.topHeight === "0%" ? "12px" : "0px",
                        borderBottomLeftRadius: "6px",
                        borderBottomRightRadius: "6px",
                      }}
                    />
                  </div>
                  {/* Day Label */}
                  <span className="text-xs font-semibold text-slate-500 mt-3 group-hover:text-blue-600 transition-colors">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">Recent Activity</h2>
            <Link
              href="/recruiter/pipeline"
              className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {/* Activity 1 */}
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Sarah Jenkins</strong> applied for{" "}
                  <strong className="font-bold text-blue-600">Senior Frontend Developer</strong>
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">2 hours ago</span>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Interview Scheduled</strong> with Marcus Thorne for Product Designer
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">4 hours ago</span>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Offer Accepted</strong> by Jennifer Lopez for Marketing Lead
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">Yesterday</span>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">New Feedback</strong> from hiring manager on Kevin's interview
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 2 Columns (Left: Upcoming Today, Right: 2x2 Quick Actions with Floating Action Button) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upcoming Today Meetings Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">Upcoming Today</h2>
            <span className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              3 MEETING
            </span>
          </div>

          <div className="space-y-4">
            {/* Meeting 1 */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="David Chen"
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">David Chen</p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    Cloud Engineer • Technical Round
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-xs text-blue-600 whitespace-nowrap">10:00 AM</p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Zoom</p>
              </div>
            </div>

            {/* Meeting 2 */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Emma Watson"
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">Emma Watson</p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    UX Designer • Portfolio Review
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-xs text-blue-600 whitespace-nowrap">02:30 PM</p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">In-Person</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 2x2 Quick Action Cards Grid + Floating Action Button */}
        <div className="lg:col-span-6 relative">
          {/* Floating Action Button */}
          <button
            onClick={() => showToast("Opening quick actions menu...")}
            className="absolute -top-3 -right-3 z-10 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
            title="Add Quick Task"
          >
            +
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Post Job (Solid Royal Blue) */}
            <Link
              href="/recruiter/post-job"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 shadow-md shadow-blue-500/20 flex flex-col justify-between min-h-[120px] transition-all hover:scale-[1.01]"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-white">Post Job</h3>
                <p className="text-xs text-blue-100 mt-0.5">Create a new listing</p>
              </div>
            </Link>

            {/* Card 2: Messages */}
            <div
              onClick={() => showToast("Opening messages inbox...")}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px] cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">Messages</h3>
                <p className="text-xs text-slate-400 mt-0.5">12 unread replies</p>
              </div>
            </div>

            {/* Card 3: Reports */}
            <div
              onClick={() => showToast("Generating monthly ROI stats report...")}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px] cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">Reports</h3>
                <p className="text-xs text-slate-400 mt-0.5">Monthly ROI stats</p>
              </div>
            </div>

            {/* Card 4: Pending */}
            <div
              onClick={() => showToast("Opening 4 pending candidate approvals...")}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-h-[120px] cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">Pending</h3>
                <p className="text-xs text-slate-400 mt-0.5">4 approvals needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
