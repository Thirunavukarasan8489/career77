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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Determine current page title for mobile header
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/notifications") return "Notifications";
    if (pathname === "/dashboard/settings") return "Settings";
    return "Candidate Dashboard";
  };

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
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      badge: null,
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.04 9.04 0 01-1.801 1.3c-1.397.77-3.01.77-4.406 0a9.04 9.04 0 01-1.802-1.3m8.009-3.14a9.033 9.033 0 001.24-4.57c0-3.033-2.146-5.59-5.009-6.155m0 12.025a9.04 9.04 0 01-2.238-1.577m0 0a9.07 9.07 0 01-2.083-2.656m0 0L3.75 14.25M14.857 17.082a9.04 9.04 0 011.801-1.3m-1.801 1.3H5.757m8.009-3.14a9.033 9.033 0 00-8.01 0M9.75 21c-1.105 0-2-.895-2-2h4c0 1.105-.895 2-2 2z" />
        </svg>
      ),
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      badge: null,
    },
    {
      name: "Search Jobs",
      href: "/openings",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
        </svg>
      ),
      badge: null,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const candidateName = candidate?.name || "Candidate";
  const candidateMobile = candidate?.mobile || "";

  const renderSidebarContent = () => (
    <div className="flex flex-col bg-white border-r border-slate-200 h-full">
      {/* Brand Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2 px-6 border-b border-slate-100">
        <svg className="h-8 w-auto" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 240C200 120 312 300 412 180" stroke="#4F46E5" strokeWidth="60" strokeLinecap="round"/>
          <path d="M100 320C200 200 312 380 412 260" stroke="#818CF8" strokeWidth="60" strokeLinecap="round"/>
        </svg>
        <span className="font-display font-black text-xl text-slate-900 tracking-tight">
          Career<span className="text-indigo-600">77</span>
        </span>
      </div>

      {/* Main Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto px-6 py-5">
        <ul role="list" className="flex flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors items-center justify-between ${
                        isActive
                          ? "bg-indigo-50/50 text-indigo-600"
                          : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      }`}
                    >
                      <div className="flex gap-x-3 items-center">
                        <span
                          className={`transition-colors ${
                            isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {item.name}
                      </div>
                      {item.badge !== null && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>

      {/* User Account Info / Sign Out - Fixed at Bottom */}
      <div className="border-t border-slate-200 bg-slate-50/50 p-4 shrink-0">
        <div className="flex items-center gap-x-3 text-sm font-semibold leading-6 text-slate-900">
          <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-sm shrink-0">
            {candidateName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-xs text-slate-900 font-bold truncate" title={candidateName}>
              {candidateName}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium truncate">
              {candidateMobile}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            title="Log Out"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 w-full">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        {renderSidebarContent()}
      </div>

      {/* MOBILE SIDEBAR DRAWER (Sliding overlay) */}
      <div
        className={`relative z-50 lg:hidden transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-slate-900/80 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Drawer container */}
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
          <div
            className={`relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 transition duration-300 ease-in-out transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Drawer Close Button */}
            <div className="absolute top-0 right-0 -mr-16 flex pt-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-slate-800 text-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Render Sidebar inside Drawer */}
            {renderSidebarContent()}
          </div>
        </div>
      </div>

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* MOBILE TOP HEADER BAR */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Title */}
          <div className="flex-1 text-sm font-semibold leading-6 text-slate-900 font-display">
            {getPageTitle()}
          </div>

          {/* User profile avatar on the right */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-xs">
              {candidateName[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* PAGE CONTENT CONTAINER */}
        <main className="grow py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
