"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { showToast } from "@/components/Toast";

interface RecruiterLayoutClientProps {
  children: React.ReactNode;
  userEmail: string;
}

export default function RecruiterLayoutClient({
  children,
  userEmail,
}: RecruiterLayoutClientProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Determine current page title for mobile header
  const getPageTitle = () => {
    if (pathname === "/recruiter") return "Dashboard";
    if (pathname === "/recruiter/post-job") return "Post a Job";
    if (pathname === "/recruiter/settings") return "Settings";
    if (pathname.includes("/applicants")) return "Applicants";
    return "Recruiter Panel";
  };

  const handlePlaceholderClick = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    showToast(`${name} features are coming soon in the Enterprise plan!`);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/recruiter",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      isPlaceholder: false,
    },
    {
      name: "Post a Job",
      href: "/recruiter/post-job",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      isPlaceholder: false,
    },
    {
      name: "Team",
      href: "#",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 18H10c-1.613 0-3.113-.33-4.477-.923M15 19.128v.11a11.39 11.39 0 01-4.91 1.378c-.516 0-1.026-.035-1.528-.105m10.089-1.378a9.074 9.074 0 00-4.122-3.07m0-3.07a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM6.9 15c-.277-.01-.547-.05-.809-.12a5.85 5.85 0 01-3.6-2.48 4.125 4.125 0 017.533-2.493M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      isPlaceholder: true,
    },
    {
      name: "Projects",
      href: "#",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0A2.25 2.25 0 004.5 15h15a2.25 2.25 0 002.25-2.25m-19.5 0v.25C2.25 14.39 3.61 15.75 5.25 15.75h13.5c1.64 0 3-1.36 3-3v-.25M2.25 9.75h19.5M3 19.5h18" />
        </svg>
      ),
      isPlaceholder: true,
    },
    {
      name: "Calendar",
      href: "#",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-18 0h18" />
        </svg>
      ),
      isPlaceholder: true,
    },
    {
      name: "Documents",
      href: "#",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      isPlaceholder: true,
    },
    {
      name: "Reports",
      href: "#",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      ),
      isPlaceholder: true,
    },
    {
      name: "Settings",
      href: "/recruiter/settings",
      icon: (
        <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      isPlaceholder: false,
    },
  ];

  // const teams = [
  //   { name: "Heroicons", initial: "H" },
  //   { name: "Tailwind Labs", initial: "T" },
  //   { name: "Workcation", initial: "W" },
  // ];

  // Helper function to render the sidebar content
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
                    {item.isPlaceholder ? (
                      <a
                        href="#"
                        onClick={(e) => handlePlaceholderClick(e, item.name)}
                        className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                          {item.icon}
                        </span>
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                          isActive
                            ? "bg-indigo-50/50 text-indigo-600"
                            : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                        }`}
                      >
                        <span
                          className={`transition-colors ${
                            isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Teams Section */}
          {/* <li>
            <div className="text-xs font-semibold leading-6 text-slate-400 uppercase tracking-wider">
              Your teams
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <a
                    href="#"
                    onClick={(e) => handlePlaceholderClick(e, team.name)}
                    className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[10px] font-medium text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-colors">
                      {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li> */}
        </ul>
      </nav>

      {/* User Account Info / Sign Out - Fixed at Bottom */}
      <div className="border-t border-slate-200 bg-slate-50/50 p-4 shrink-0">
        <div className="flex items-center gap-x-3 text-sm font-semibold leading-6 text-slate-900">
          <img
            className="h-9 w-9 rounded-full bg-slate-50 border border-slate-200 shrink-0"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Tom Cook"
          />
          <div className="flex-1 min-w-0">
            <span className="sr-only">Your profile</span>
            <span className="block text-xs text-slate-500 font-semibold truncate" title={userEmail}>
              {userEmail}
            </span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Recruiter
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
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
    <div className="min-h-screen flex bg-slate-50">
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
            {/* Drawer Close Button & Avatar next to it */}
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
            <img
              className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Tom Cook"
            />
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
