"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";

export default function RecruiterAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch {
      // Fallback keeps default visualization intact
    } finally {
      setLoading(false);
    }
  };

  const funnelStages = [
    { label: "Applied", count: 2482, percent: "100%", width: "100%", color: "bg-blue-600" },
    { label: "Screening", count: 1116, percent: "45%", width: "45%", color: "bg-blue-600" },
    { label: "Interview", count: 446, percent: "18%", width: "18%", color: "bg-blue-600" },
    { label: "Offer", count: 114, percent: "7%", width: "7%", color: "bg-blue-600" },
    { label: "Hired", count: 98, percent: "4%", width: "100%", color: "bg-emerald-600" },
  ];

  const applicantSources = [
    { label: "LinkedIn", percent: "62%", color: "bg-blue-600" },
    { label: "Company Site", percent: "21%", color: "bg-emerald-600" },
    { label: "Referrals", percent: "12%", color: "bg-amber-700" },
    { label: "Others", percent: "5%", color: "bg-slate-300" },
  ];

  const topJobs = [
    { title: "Senior Software Engineer", apps: 420, width: "95%" },
    { title: "Product Designer", apps: 312, width: "70%" },
    { title: "Data Analyst", apps: 245, width: "55%" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Timeframe Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Analytics</h1> */}
          <button
            onClick={() => {
              const next = timeframe === "Last 30 Days" ? "Last 90 Days" : "Last 30 Days";
              setTimeframe(next);
              showToast(`Analytics timeframe set to ${next}`);
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-slate-200/80 inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>📅 {timeframe}</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Top Export Button */}
        <button
          onClick={() => showToast("Exporting Analytics PDF report...")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export PDF</span>
        </button>
      </div>

      {/* Top 4 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Applications */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">TOTAL APPLICATIONS</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">2,482</span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
              +12.4%
            </span>
          </div>
        </div>

        {/* Card 2: Interviews */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">INTERVIEWS</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">184</span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
              +4.2%
            </span>
          </div>
        </div>

        {/* Card 3: Avg Time to Hire */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">AVG. TIME TO HIRE</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">18 Days</span>
            <span className="bg-amber-100 text-amber-900 font-bold text-[11px] px-2 py-0.5 rounded-md">
              -2 Days
            </span>
          </div>
        </div>

        {/* Card 4: Offer Accept Rate */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">OFFER ACCEPT RATE</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">88.5%</span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
              +1.1%
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid (2 Columns: Left Funnel ~60%, Right Donut Chart ~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Card: Hiring Funnel Conversion */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-lg tracking-tight">Hiring Funnel Conversion</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Candidate journey drop-off analysis</p>
            </div>
            <button
              onClick={() => showToast("Funnel conversion methodology: Tracks candidate progression across pipeline stages.")}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Info"
            >
              ⓘ
            </button>
          </div>

          {/* Funnel Progress Bars */}
          <div className="space-y-4 pt-2">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-20 text-xs font-semibold text-slate-600 shrink-0">{stage.label}</span>
                <div className="flex-1 bg-blue-50/70 rounded-xl h-9 p-1 relative flex items-center overflow-hidden border border-blue-100/50">
                  <div
                    className={`${stage.color} h-full rounded-lg transition-all duration-500 flex items-center justify-end px-3 shadow-xs`}
                    style={{ width: stage.width }}
                  >
                    {idx < 4 && (
                      <span className="text-white text-xs font-extrabold tracking-tight">
                        {stage.count.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <span className="w-12 text-xs font-bold text-slate-500 text-right shrink-0">{stage.percent}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Applicant Sources Donut Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <h2 className="font-bold text-slate-900 text-lg tracking-tight">Applicant Sources</h2>

          {/* Donut Ring Visualization */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            {/* SVG Ring Graphic */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-blue-600"
                strokeDasharray="62, 100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray="21, 100"
                strokeDashoffset="-62"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-800"
                strokeDasharray="12, 100"
                strokeDashoffset="-83"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            {/* Inner Content Text */}
            <div className="absolute text-center">
              <span className="text-xl font-extrabold text-slate-900 block leading-tight">2.5k</span>
              <span className="text-[11px] font-semibold text-slate-400 block">Total</span>
            </div>
          </div>

          {/* Legend Sources List */}
          <div className="space-y-2 pt-2">
            {applicantSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${source.color}`} />
                  <span className="font-semibold text-slate-700">{source.label}</span>
                </div>
                <span className="font-bold text-slate-900">{source.percent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid (2 Columns: Left Top Jobs ~50%, Right Trend Graph ~50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Top Jobs by Volume */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="font-bold text-slate-900 text-lg tracking-tight">Top Jobs by Volume</h2>

          <div className="space-y-5">
            {topJobs.map((job, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{job.title}</span>
                  <span className="font-semibold text-slate-500">{job.apps} Apps</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: job.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Time-to-Hire Trend */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="font-bold text-slate-900 text-lg tracking-tight">Time-to-Hire Trend</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Efficiency trend over the last 6 months</p>
          </div>

          {/* Line Chart Graphic */}
          <div className="h-36 relative flex items-end pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path
                d="M0 80 Q 50 65, 100 75 T 200 40 T 300 10"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <circle cx="0" cy="80" r="4" fill="#2563eb" />
              <circle cx="60" cy="68" r="4" fill="#2563eb" />
              <circle cx="120" cy="73" r="4" fill="#2563eb" />
              <circle cx="180" cy="45" r="4" fill="#2563eb" />
              <circle cx="240" cy="25" r="4" fill="#2563eb" />
              <circle cx="300" cy="10" r="4" fill="#2563eb" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
