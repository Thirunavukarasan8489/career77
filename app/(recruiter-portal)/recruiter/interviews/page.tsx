"use client";

import { useState } from "react";
import { showToast } from "@/components/common/Toast";

export default function RecruiterInterviewsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [dateRange, setDateRange] = useState("Oct 24 - Oct 30");

  const todayInterviews = [
    {
      id: "int1",
      time: "10:30 AM",
      candidate: "Sofia Chen",
      role: "Product Designer • UX/UI Squad",
      type: "Video (Zoom)",
      typeBg: "bg-blue-50 text-blue-700 border-blue-100",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      action: "Join Meeting",
      actionType: "primary",
    },
    {
      id: "int2",
      time: "02:15 PM",
      candidate: "Marcus Thorne",
      role: "Lead Backend Engineer • Fintech Infrastructure",
      type: "Phone Call",
      typeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      action: "Reschedule",
      actionType: "secondary",
    },
  ];

  const tomorrowInterviews = [
    {
      id: "int3",
      time: "09:00 AM",
      date: "OCT 25",
      candidate: "Elena Rodriguez",
      role: "Marketing Manager • Growth Ops",
      type: "In-Person (Room 4C)",
      typeBg: "bg-amber-50 text-amber-800 border-amber-100",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      action: "Cancel",
      actionType: "secondary",
    },
    {
      id: "int4",
      time: "11:30 AM",
      date: "OCT 25",
      candidate: "Jordan Weber",
      role: "Sales Executive • Global Accounts",
      type: "Video (Teams)",
      typeBg: "bg-blue-50 text-blue-700 border-blue-100",
      initials: "JW",
      avatarBg: "bg-slate-100 text-slate-700",
      action: "Reschedule",
      actionType: "secondary",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Row (2 Columns: Left Hero ~70%, Right Stat Card ~30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Hero Banner Card */}
        <div className="lg:col-span-8 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-blue-600/20 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          {/* Subtle Background Calendar Vector Art */}
          <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none">
            <svg className="w-44 h-44 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
            </svg>
          </div>

          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
              Today's Schedule
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm font-normal mt-2 max-w-xl leading-relaxed">
              You have 5 interviews scheduled for today across 3 active job roles. The next one starts in 45 minutes.
            </p>
          </div>

          {/* Translucent Stat Pills */}
          <div className="flex items-center gap-3 mt-6">
            <div className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 border border-white/10">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-100">VIDEO</span>
              <span className="text-base font-extrabold text-white">3</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 border border-white/10">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-100">PHONE</span>
              <span className="text-base font-extrabold text-white">1</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 border border-white/10">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-100">ON-SITE</span>
              <span className="text-base font-extrabold text-white">1</span>
            </div>
          </div>
        </div>

        {/* Right Stat Card (AVG FEEDBACK) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">AVG. FEEDBACK</span>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">1.2h</p>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-2 inline-block">
            +14% vs last week
          </span>
        </div>
      </div>

      {/* Main Schedule Container */}
      <div className="space-y-6">
        {/* Controls Bar: List/Calendar Toggle + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* View Toggle Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/60 inline-flex items-center self-start">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "list"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "calendar"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Calendar View
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Filter interviews menu opened")}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/80 inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
            </button>

            <button
              onClick={() => showToast(`Selected date range: ${dateRange}`)}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200/80 inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{dateRange}</span>
            </button>
          </div>
        </div>

        {/* Schedule Items List */}
        <div className="space-y-4">
          {/* Today Meetings */}
          {todayInterviews.map((item) => (
            <div
              key={item.id}
              className="bg-white border-l-4 border-l-blue-600 border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Time Badge */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center min-w-[90px] shrink-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block leading-none">
                    TODAY
                  </span>
                  <span className="text-base font-extrabold text-blue-700 block leading-tight mt-1">
                    {item.time}
                  </span>
                </div>

                {/* Candidate Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.avatar}
                    alt={item.candidate}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-base truncate">{item.candidate}</h3>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{item.role}</p>
                  </div>
                </div>
              </div>

              {/* Right Meeting Mode Tag & Action Button */}
              <div className="flex items-center gap-3 justify-end shrink-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.typeBg}`}>
                  🎥 {item.type}
                </span>

                {item.actionType === "primary" ? (
                  <button
                    onClick={() => showToast(`Joining Zoom meeting for ${item.candidate}...`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all"
                  >
                    {item.action}
                  </button>
                ) : (
                  <button
                    onClick={() => showToast(`Rescheduling interview for ${item.candidate}`)}
                    className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl border border-slate-200/60 transition-colors"
                  >
                    {item.action}
                  </button>
                )}

                <button
                  onClick={() => showToast(`Options for ${item.candidate}`)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Section Divider Header */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80" />
            </div>
            <span className="relative bg-[#F8FAFC] px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              TOMORROW, OCTOBER 25
            </span>
          </div>

          {/* Tomorrow Meetings */}
          {tomorrowInterviews.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Time Badge */}
                <div className="bg-slate-100 border border-slate-200/70 rounded-xl px-4 py-3 text-center min-w-[90px] shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-none">
                    {item.date}
                  </span>
                  <span className="text-base font-extrabold text-slate-800 block leading-tight mt-1">
                    {item.time}
                  </span>
                </div>

                {/* Candidate Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.candidate}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center border border-blue-200 shrink-0">
                      {item.initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-base truncate">{item.candidate}</h3>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{item.role}</p>
                  </div>
                </div>
              </div>

              {/* Right Meeting Mode Tag & Action Button */}
              <div className="flex items-center gap-3 justify-end shrink-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.typeBg}`}>
                  {item.type.includes("In-Person") ? "🏢" : "🎥"} {item.type}
                </span>

                <button
                  onClick={() => showToast(`Action for ${item.candidate}`)}
                  className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl border border-slate-200/60 transition-colors"
                >
                  {item.action}
                </button>

                <button
                  onClick={() => showToast(`Options for ${item.candidate}`)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
