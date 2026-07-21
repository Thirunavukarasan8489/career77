"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { candidate, logoutCandidate } = useApp();
  const { data: session } = useSession();

  // Hide main public navbar on recruiter panel dashboard pages (which have their own sidebar layout)
  if (pathname.startsWith("/recruiter") && pathname !== "/recruiter/login" && pathname !== "/recruiter/register") {
    return null;
  }

  return (
    <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Main Nav Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display font-extrabold text-2xl text-blue-600 tracking-tight flex items-center hover:opacity-90 transition-opacity"
          >
            Career77
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <Link
              href="/openings"
              className={`transition-colors ${pathname === "/openings" ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5" : "hover:text-blue-600"}`}
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              className={`transition-colors ${pathname.startsWith("/companies") ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5" : "hover:text-blue-600"}`}
            >
              Companies
            </Link>
            <Link
              href="/recruiter/login"
              className="hover:text-blue-600 transition-colors"
            >
              For Employers
            </Link>
          </div>
        </div>

        {/* Auth Controls */}
        <div className="flex items-center gap-3">
          {session && session.user ? (
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
              <Link
                href="/recruiter"
                className="bg-blue-50 text-blue-600 px-3.5 py-2 rounded-xl hover:bg-blue-100 transition-colors"
              >
                Recruiter Panel
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border border-slate-200 text-slate-600 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : candidate ? (
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
              <Link
                href="/dashboard"
                className="text-slate-700 hover:text-blue-600 transition-colors hidden sm:inline"
              >
                {candidate.name}
              </Link>
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center border border-blue-200"
              >
                {candidate.name[0].toUpperCase()}
              </Link>
              <button
                onClick={logoutCandidate}
                className="border border-slate-200 text-slate-600 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="text-slate-600 text-xs sm:text-sm font-semibold hover:text-slate-900 px-3 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-4.5 py-2 rounded-xl shadow-xs transition-all font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
