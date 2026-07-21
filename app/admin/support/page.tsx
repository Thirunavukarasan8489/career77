"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/support");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const resolveTicket = async (id: string) => {
    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: id, status: "resolved" }),
      });
      if (res.ok) {
        showToast("Support ticket marked as resolved.");
        fetchTickets();
      }
    } catch {
      showToast("Failed to update ticket.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Support Ticketing Desk
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review and resolve candidate and recruiter support inquiries.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-10 text-center text-slate-400 text-sm">
          No open support tickets.
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <div
              key={t._id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      t.status === "resolved"
                        ? "bg-emerald-900/60 text-emerald-300"
                        : "bg-amber-900/60 text-amber-300"
                    }`}
                  >
                    {t.status.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-white text-base">{t.subject}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">{t.message}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Raised on {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>

              {t.status !== "resolved" && (
                <button
                  onClick={() => resolveTicket(t._id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
