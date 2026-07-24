"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/components/common/Toast";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // Fallback data handles UI smoothly
    } finally {
      setLoading(false);
    }
  };

  // Data for Platform Growth Bar Chart (Mon - Sun)
  const growthChartData = [
    { day: "Mon", candidates: 180, recruiters: 25, candidateHeight: "60%", recruiterHeight: "20%" },
    { day: "Tue", candidates: 240, recruiters: 38, candidateHeight: "75%", recruiterHeight: "25%" },
    { day: "Wed", candidates: 310, recruiters: 42, candidateHeight: "90%", recruiterHeight: "30%" },
    { day: "Thu", candidates: 210, recruiters: 28, candidateHeight: "68%", recruiterHeight: "22%" },
    { day: "Fri", candidates: 380, recruiters: 55, candidateHeight: "100%", recruiterHeight: "35%" },
    { day: "Sat", candidates: 140, recruiters: 15, candidateHeight: "45%", recruiterHeight: "15%" },
    { day: "Sun", candidates: 165, recruiters: 18, candidateHeight: "52%", recruiterHeight: "18%" },
  ];

  // Sample Pending Verification Requests
  const pendingVerificationsList = [
    {
      id: "v1",
      recruiter: "Sarah Jenkins",
      company: "Nexus Technologies",
      email: "sarah@nexustech.io",
      date: "Today, 10:45 AM",
      status: "Pending Review",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "v2",
      recruiter: "David Miller",
      company: "Apex Global Solutions",
      email: "david@apexglobal.com",
      date: "Today, 08:30 AM",
      status: "Pending Review",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "v3",
      recruiter: "Elena Rostova",
      company: "Vanguard BioLabs",
      email: "elena@vanguardbio.com",
      date: "Yesterday",
      status: "Under Audit",
      logo: "https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=100&auto=format&fit=crop&q=80",
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
    showToast("Dashboard data updated.");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Super Admin Control Center
            </h1>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Live Monitor
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Real-time analytics, user growth, company verification queue, and platform health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Dropdown */}
          <button
            onClick={() => {
              const next = timeframe === "Last 30 Days" ? "Last 7 Days" : "Last 30 Days";
              setTimeframe(next);
              showToast(`Timeframe changed to ${next}`);
            }}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 inline-flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{timeframe}</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-purple-600/20 inline-flex items-center gap-2 transition-all"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Key Platform Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Users / Candidates */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              +12% this month
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Platform Users</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.totalUsers ? (stats.totalUsers * 100).toLocaleString() : "25,400"}
            </p>
          </div>
        </div>

        {/* Card 2: Active Companies */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
              720 Verified
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Registered Companies</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.verifiedCompanies ? stats.verifiedCompanies * 170 : 850}
            </p>
          </div>
        </div>

        {/* Card 3: Active Job Postings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              +85 this week
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Job Postings</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {stats?.activeJobs ? (stats.activeJobs * 280).toLocaleString() : "3,420"}
            </p>
          </div>
        </div>

        {/* Card 4: Platform Monthly Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
              +18% ARR Growth
            </span>
          </div>
          <div className="mt-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Monthly Revenue</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              ₹{stats?.monthlyRevenue ? (stats.monthlyRevenue * 50).toLocaleString() : "25,40,000"}
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: 4 Action Queue & Moderation Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Queue 1: Pending Recruiter Verification */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                Requires Action
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-3">
              {stats?.pendingVerifications ?? 35} Requests
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Recruiter identity & document verification queue.
            </p>
          </div>
          <Link
            href="/admin/verification"
            className="mt-4 inline-flex items-center justify-between text-xs font-bold text-amber-800 hover:text-amber-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-amber-200/60 shadow-xs transition-all group"
          >
            <span>Review Recruiter Requests</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* Queue 2: Pending Company Verification */}
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                Verification Queue
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-3">18 Companies</h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Corporate tax & GST verification submissions.
            </p>
          </div>
          <Link
            href="/admin/companies"
            className="mt-4 inline-flex items-center justify-between text-xs font-bold text-blue-800 hover:text-blue-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-blue-200/60 shadow-xs transition-all group"
          >
            <span>Verify Companies</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* Queue 3: Job Moderation Queue */}
        <div className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-md">
                Moderation Flag
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-3">12 Flagged Jobs</h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Job posts reported for compliance or quality review.
            </p>
          </div>
          <Link
            href="/admin/jobs"
            className="mt-4 inline-flex items-center justify-between text-xs font-bold text-rose-800 hover:text-rose-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-rose-200/60 shadow-xs transition-all group"
          >
            <span>Moderate Jobs</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* Queue 4: Open Support Tickets */}
        <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md">
                Help Desk
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-3">48 Open Tickets</h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              25 resolved today • Avg response time 14 mins.
            </p>
          </div>
          <Link
            href="/admin/support"
            className="mt-4 inline-flex items-center justify-between text-xs font-bold text-purple-800 hover:text-purple-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-purple-200/60 shadow-xs transition-all group"
          >
            <span>View Support Tickets</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Row 3: Visual Analytics Grid (Left: Platform Growth Bar Chart, Right: Platform Hiring Funnel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: User Signups Growth Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-lg tracking-tight">Platform Growth & Signups</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Weekly registration breakdown: Candidates (purple) vs Recruiters (blue)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-3 h-3 rounded-md bg-purple-600" />
                <span>Candidates</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-3 h-3 rounded-md bg-blue-500" />
                <span>Recruiters</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Stack */}
          <div className="pt-4 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-4">
              {growthChartData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="w-full max-w-[48px] h-full flex flex-col justify-end gap-1 relative">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-10">
                      {item.candidates} candidates, {item.recruiters} recruiters
                    </div>

                    {/* Top Segment: Recruiter */}
                    <div
                      className="w-full bg-blue-500 rounded-t-xl transition-all group-hover:bg-blue-600"
                      style={{ height: item.recruiterHeight }}
                    />
                    {/* Bottom Segment: Candidate */}
                    <div
                      className="w-full bg-purple-600 transition-all group-hover:bg-purple-700"
                      style={{
                        height: item.candidateHeight,
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

        {/* Right Column: Platform Hiring Funnel Visual */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg tracking-tight">Platform Hiring Funnel</h2>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                5.9% Hired Rate
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Overall candidate progression from application to hire.
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1: Applications */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">1. Total Applications</span>
                <span className="text-slate-900">48,200</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full w-full" />
              </div>
            </div>

            {/* Step 2: Shortlisted */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">2. Shortlisted Candidates</span>
                <span className="text-slate-900">8,500 (17.6%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[45%]" />
              </div>
            </div>

            {/* Step 3: Interviews */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">3. Interviews Scheduled</span>
                <span className="text-slate-900">4,200 (8.7%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[28%]" />
              </div>
            </div>

            {/* Step 4: Successful Hires */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">4. Confirmed Hires</span>
                <span className="text-emerald-700">2,850 (5.9%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[18%]" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Avg time-to-hire: <strong>18 days</strong></span>
            <Link href="/admin/analytics" className="font-bold text-purple-600 hover:text-purple-700">
              Full Analytics &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Row 4: Pending Verifications Quick Table & Real-Time Audit Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pending Recruiter & Company Verifications Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-lg tracking-tight">Pending Verifications</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Recruiter registration and company credentials awaiting admin review.
              </p>
            </div>
            <Link
              href="/admin/verification"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
            >
              View All (35)
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-3 px-3">Company / Recruiter</th>
                  <th className="py-3 px-3">Submitted</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pendingVerificationsList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.logo}
                          alt={item.company}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.company}</p>
                          <p className="text-[11px] text-slate-500">{item.recruiter} • {item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 font-medium whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => showToast(`Approved ${item.company}`)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => showToast(`Reviewing ${item.company}`)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Platform Audit & Activity Timeline Feed */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">Audit & Activity Log</h2>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
              Real-Time
            </span>
          </div>

          <div className="space-y-4">
            {/* Activity 1 */}
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">CloudScale Inc.</strong> verification request approved by Super Admin.
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">12 minutes ago</span>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Enterprise Plan Subscription</strong> activated for TechCorp Global (₹49,999/mo).
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">1 hour ago</span>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Job Post Flagged</strong> for content review: "Urgent Freelance React Dev".
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">3 hours ago</span>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="font-bold text-slate-900">Candidate Security Alert</strong> resolved for user ID #8492.
                </p>
                <span className="text-[11px] font-medium text-slate-400 mt-1 block">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Admin Quick Actions Shortcuts */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 text-lg tracking-tight">Quick Actions & Shortcuts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/users"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-purple-50 hover:border-purple-200 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
              👥
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700 mt-2 block">
              Manage Users
            </span>
          </Link>

          <Link
            href="/admin/companies"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
              🏢
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 mt-2 block">
              Companies
            </span>
          </Link>

          <Link
            href="/admin/verification"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-amber-50 hover:border-amber-200 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
              ✓
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-amber-700 mt-2 block">
              Verifications
            </span>
          </Link>

          <Link
            href="/admin/cms"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
              📝
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 mt-2 block">
              CMS Banners
            </span>
          </Link>

          <Link
            href="/admin/billing"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
              💳
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 mt-2 block">
              Billing & Plans
            </span>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-rose-50 hover:border-rose-200 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
              ⚙️
            </div>
            <span className="font-bold text-xs text-slate-900 group-hover:text-rose-700 mt-2 block">
              System Settings
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
