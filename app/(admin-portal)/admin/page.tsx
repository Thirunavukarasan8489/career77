"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Super Admin Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Career77 platform control center and performance metrics.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <span className="text-xs uppercase font-semibold text-slate-400">Total Users</span>
              <p className="text-3xl font-extrabold text-white mt-2">{stats?.totalUsers ?? 12}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <span className="text-xs uppercase font-semibold text-slate-400">Verified Companies</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">{stats?.verifiedCompanies ?? 5}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <span className="text-xs uppercase font-semibold text-slate-400">Active Job Postings</span>
              <p className="text-3xl font-extrabold text-indigo-400 mt-2">{stats?.activeJobs ?? 8}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <span className="text-xs uppercase font-semibold text-slate-400">Pending Verifications</span>
              <p className="text-3xl font-extrabold text-amber-400 mt-2">{stats?.pendingVerifications ?? 2}</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              href="/admin/verification"
              className="bg-slate-950 border border-slate-800 hover:border-purple-500 p-6 rounded-xl transition-all group"
            >
              <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
                Verification Queue &rarr;
              </h3>
              <p className="text-xs text-slate-400 mt-1">Review pending recruiter company document verification submissions.</p>
            </Link>

            <Link
              href="/admin/cms"
              className="bg-slate-950 border border-slate-800 hover:border-purple-500 p-6 rounded-xl transition-all group"
            >
              <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
                CMS Content Editor &rarr;
              </h3>
              <p className="text-xs text-slate-400 mt-1">Edit landing hero text, homepage banners, and marketing blocks.</p>
            </Link>

            <Link
              href="/admin/support"
              className="bg-slate-950 border border-slate-800 hover:border-purple-500 p-6 rounded-xl transition-all group"
            >
              <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
                Support Tickets &rarr;
              </h3>
              <p className="text-xs text-slate-400 mt-1">Respond to candidate and recruiter support inquiries.</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
