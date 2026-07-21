"use client";

import { useState, useEffect } from "react";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics");
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
          Platform Growth Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Platform-wide user acquisition, recruiter onboarding, and job posting metrics.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center">
              <span className="text-xs uppercase font-semibold text-slate-400">Total Registered Users</span>
              <p className="text-3xl font-extrabold text-white mt-2">{stats?.totalUsers ?? 12}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center">
              <span className="text-xs uppercase font-semibold text-slate-400">Companies Onboarded</span>
              <p className="text-3xl font-extrabold text-purple-400 mt-2">{stats?.verifiedCompanies ?? 5}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center">
              <span className="text-xs uppercase font-semibold text-slate-400">Monthly Revenue</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">₹{stats?.monthlyRevenue ?? "49,999"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
