"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";

interface CandidateLayoutClientProps {
  children: React.ReactNode;
}

export default function CandidateLayoutClient({ children }: CandidateLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { candidate, loading, logoutCandidate, unreadCount } = useApp();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutCandidate();
      showToast("Logged out successfully.");
      router.push("/");
    } catch {
      showToast("Logout failed.");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: "My Profile",
      href: "/candidate/profile",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: "Resume & Preview",
      href: "/candidate/resume",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: "Job Search",
      href: "/candidate/jobs",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Applications",
      href: "/candidate/applications",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      name: "Interviews",
      href: "/candidate/interviews",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: "Settings",
      href: "/candidate/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const candidateName = candidate?.name || "Candidate User";
  const candidateEmail = candidate?.email || candidate?.mobile || "candidate@career77.com";
  const candidateInitial = candidateName.charAt(0).toUpperCase() || "C";
  const candidateRole = candidate?.lookingFor || "Job Seeker";

  // Compute page header title based on current pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard" || pathname === "/candidate") return "Candidate Dashboard";
    if (pathname.startsWith("/candidate/profile")) return "My Profile";
    if (pathname.startsWith("/candidate/resume")) return "Resume & Preview";
    if (pathname.startsWith("/candidate/jobs")) return "Job Search";
    if (pathname.startsWith("/candidate/applications")) return "Applications Tracker";
    if (pathname.startsWith("/candidate/interviews")) return "Interview Schedule";
    if (pathname.startsWith("/dashboard/notifications")) return "Notifications";
    if (pathname.startsWith("/candidate/settings")) return "Account Settings";
    return "Candidate Portal";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased">
      <div className="flex-1 flex min-h-screen relative">
        {/* Desktop Sidebar Component */}
        <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-white border-r border-slate-200/80 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-600/30 shrink-0">
              C7
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight leading-none">
                Career77
              </span>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-1">
                Candidate Portal
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white text-indigo-700"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          {/* Return to Storefront & Logout Buttons */}
          <div className="p-4 border-t border-slate-100 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Return to Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all"
            >
              <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer Navigation Overlay */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">
                    C7
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-lg text-slate-900">Career77</span>
                    <p className="text-[10px] font-bold text-slate-400">Candidate Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold ${
                        isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive ? "bg-white text-indigo-700" : "bg-rose-500 text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-100 space-y-2">
                <Link
                  href="/"
                  className="block text-center w-full py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                >
                  &larr; Storefront
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-center"
                >
                  Sign Out ({candidateName})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Viewport Container */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {/* Top Bar Header */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
            {/* Left Mobile Menu Toggle + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Toggle Mobile Sidebar"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {getPageTitle()}
              </h1>
            </div>

            {/* Center Search Input Bar */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, applications, or skills..."
                  className="w-full bg-slate-100/80 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right Profile & Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Bell Notification Button */}
              <Link
                href="/dashboard/notifications"
                className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </Link>

              {/* Help Center Button */}
              <button
                onClick={() => showToast("Help center & candidate resources loaded.")}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Help Center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Candidate Profile Header Card */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200/80">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="font-bold text-xs text-slate-900 leading-tight">{candidateName}</span>
                  <span className="text-[11px] font-medium text-slate-400">{candidateRole}</span>
                </div>
                <div
                  onClick={() => router.push("/candidate/profile")}
                  className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm ring-2 ring-white shadow-xs shrink-0 cursor-pointer hover:bg-indigo-700 transition-colors"
                  title="View Profile"
                >
                  {candidateInitial}
                </div>
              </div>
            </div>
          </header>

          {/* Viewport Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>

          {/* Page Footer */}
          {/* <footer className="border-t border-slate-200/80 bg-white py-5 px-6 sm:px-8 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Career77. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-600 transition-colors">Candidate Support</a>
            </div>
          </footer> */}
        </div>
      </div>
    </div>
  );
}

