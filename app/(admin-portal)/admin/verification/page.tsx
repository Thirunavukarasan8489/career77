"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/common/Toast";

export default function AdminVerificationPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/verification");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reqId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: reqId, status }),
      });

      if (res.ok) {
        showToast(`Verification request ${status}!`);
        fetchRequests();
      }
    } catch {
      showToast("Error reviewing verification request.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Verification Review Queue
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review business registration documents submitted by recruiters to issue Verified badges.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-10 text-center text-slate-400 text-sm">
          No pending verification requests in queue.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      req.status === "approved"
                        ? "bg-emerald-900/60 text-emerald-300"
                        : req.status === "rejected"
                        ? "bg-rose-900/60 text-rose-300"
                        : "bg-amber-900/60 text-amber-300"
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-white text-base">
                    Company: {req.companyId?.name || "Company"}
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Submitted: {new Date(req.submittedAt).toLocaleString()}
                </p>
                {req.documentUrl && (
                  <a
                    href={req.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-purple-400 hover:text-purple-300"
                  >
                    View Uploaded Verification Document ↗
                  </a>
                )}
              </div>

              {req.status === "pending" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReview(req._id, "approved")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Approve & Verify
                  </button>
                  <button
                    onClick={() => handleReview(req._id, "rejected")}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
