"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const toggleVerified = async (slug: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/companies/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !currentStatus }),
      });
      if (res.ok) {
        showToast(`Verification status updated for ${slug}.`);
        fetchCompanies();
      }
    } catch {
      showToast("Failed to update status.");
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Company Directory & Moderation
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review company profiles and manage Verified badges.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {companies.map((c) => (
            <div
              key={c._id}
              className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-200 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-lg">{c.name}</h3>
                  {c.verified && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Slug: <code className="text-purple-600 font-semibold">/companies/{c.slug}</code> • {c.location || "India"}
                </p>
              </div>

              <button
                onClick={() => toggleVerified(c.slug, c.verified)}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                  c.verified
                    ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-purple-600 hover:bg-purple-700 text-white border-transparent shadow-sm"
                }`}
              >
                {c.verified ? "Revoke Verification" : "Grant Verification Badge"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
