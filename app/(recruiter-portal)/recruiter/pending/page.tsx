"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function RecruiterPendingPage() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl animate-pulse">
          ⏳
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            Verification Pending
          </h1>
          <p className="text-sm text-slate-500">
            Hi {session?.user?.name || "Recruiter"}, your recruiter account verification request is currently under review by our Super Admins.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs text-slate-600 space-y-3">
          <p className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
            Onboarding Checklist
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Account registration complete</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Company setup details submitted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">⚡</span>
              <span>GSTIN / Business validation in progress</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            Sign Out
          </button>
          
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            &larr; Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
