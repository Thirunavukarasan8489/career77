"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";

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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Verification Review Queue
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review business registration documents submitted by recruiters to issue Verified badges.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-10 text-center text-slate-500 text-sm">
          No pending verification requests in queue.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-200 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      req.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : req.status === "rejected"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    Company: {req.companyId?.name || "Company"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Submitted: {new Date(req.submittedAt).toLocaleString()}
                </p>
                {req.documentUrl && (
                  <a
                    href={req.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs font-bold text-purple-600 hover:text-purple-700"
                  >
                    View Uploaded Verification Document ↗
                  </a>
                )}
              </div>

              {req.status === "pending" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReview(req._id, "approved")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Approve & Verify
                  </button>
                  <button
                    onClick={() => handleReview(req._id, "rejected")}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
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
