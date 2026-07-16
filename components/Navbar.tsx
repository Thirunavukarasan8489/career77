"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { candidate, logoutCandidate, unreadCount } = useApp();
  const { data: session } = useSession();

  return (
    <>
      {/* MARQUEE AD BAR */}
      <Link
        href="/openings"
        className="block bg-blue-900 text-white overflow-hidden whitespace-nowrap cursor-pointer hover:bg-blue-950 transition-colors"
      >
        <div className="inline-block py-2.5 text-xs font-semibold tracking-wider animate-marquee whitespace-nowrap">
          <span className="mr-16">🔥 12 new openings added this week — tap to browse</span>
          <span className="mr-16">💼 Frontend Developer, Backend Engineer & more hiring now</span>
          <span className="mr-16">📢 Register once, get matched automatically to new jobs</span>
          <span className="mr-16">🔥 12 new openings added this week — tap to browse</span>
          <span className="mr-16">💼 Frontend Developer, Backend Engineer & more hiring now</span>
          <span className="mr-16">📢 Register once, get matched automatically to new jobs</span>
        </div>
      </Link>

      {/* NAV */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-black text-2xl text-blue-600 tracking-tight flex items-center hover:opacity-90 transition-opacity"
          >
            Career<span className="text-zinc-800">77</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Recruiter Logged In */}
            {session && session.user ? (
              <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
                <Link
                  href="/recruiter"
                  className="text-zinc-600 hover:text-blue-600 transition-colors hidden sm:inline"
                >
                  Recruiter Panel
                </Link>
                <Link
                  href="/recruiter/post-job"
                  className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                  + Post Job
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="border border-zinc-300 text-zinc-600 px-3.5 py-1.5 rounded-full hover:bg-zinc-50 transition-all font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : candidate ? (
              /* Candidate Logged In */
              <div className="flex items-center gap-3.5 text-xs sm:text-sm font-semibold">
                <Link
                  href="/dashboard/notifications"
                  className="relative text-lg text-zinc-600 hover:text-blue-600 transition-colors p-1"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 border border-white rounded-full animate-ping" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-600 border border-white rounded-full" />
                  )}
                </Link>
                <Link
                  href="/dashboard"
                  className="text-zinc-700 hover:text-blue-600 transition-colors hidden md:inline"
                >
                  {candidate.name}
                </Link>
                <Link
                  href="/dashboard"
                  className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {candidate.name[0].toUpperCase()}
                </Link>
                <button
                  onClick={logoutCandidate}
                  className="border border-zinc-300 text-zinc-600 px-3.5 py-1.5 rounded-full hover:bg-zinc-50 transition-all font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* Guest */
              <div className="flex items-center gap-2">
                <Link
                  href="/recruiter/login"
                  className="text-zinc-600 text-xs sm:text-sm font-semibold hover:text-blue-600 transition-colors px-3 py-1.5"
                >
                  Recruiter Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white text-xs sm:text-sm px-4.5 py-2 rounded-full hover:bg-blue-700 transition-all font-semibold shadow-sm"
                >
                  Register as Candidate
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
