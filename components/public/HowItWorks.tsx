"use client";

import React, { useState } from "react";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"candidate" | "recruiter">("candidate");

  const candidateSteps = [
    {
      num: "01",
      title: "Register & Upload Resume",
      desc: "Upload your existing PDF/DOC resume or build a new one using our AI resume builder in less than 2 minutes.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Get Matched Automatically",
      desc: "Our matching engine parses recruiter posts in real-time, automatically notifying you of openings that match your skills.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Apply with One Tap",
      desc: "Apply instantly via a simple in-app form or click to message the recruiter directly on WhatsApp with your parsed details.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  const recruiterSteps = [
    {
      num: "01",
      title: "Post Job Opening",
      desc: "Publish your opening by specifying required skills, experience level, description, and location in just one screen.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "See Instant Matches",
      desc: "Access a live roster of matching, pre-registered candidates who match your job requirements by keyword & criteria.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Manage & Shortlist",
      desc: "Review resume files, change applicant statuses (Applied, Shortlisted, Selected, Rejected), and coordinate interviews.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  const activeSteps = activeTab === "candidate" ? candidateSteps : recruiterSteps;

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 bg-zinc-200/80 rounded-full border border-zinc-300/40">
          <button
            onClick={() => setActiveTab("candidate")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
              activeTab === "candidate"
                ? "bg-white text-blue-650 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            For Candidates
          </button>
          <button
            onClick={() => setActiveTab("recruiter")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
              activeTab === "recruiter"
                ? "bg-white text-blue-650 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            For Recruiters
          </button>
        </div>
      </div>

      {/* Steps Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {activeSteps.map((step, _idx) => (
          <div
            key={step.num}
            className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col items-start"
          >
            <div className="absolute top-4 right-6 text-4xl font-black text-zinc-100 font-display select-none">
              {step.num}
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-5 shrink-0">
              {step.icon}
            </div>
            <h3 className="font-display font-extrabold text-lg text-zinc-900 mb-2.5">
              {step.title}
            </h3>
            <p className="text-zinc-650 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
