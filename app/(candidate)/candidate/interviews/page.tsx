"use client";

import { useState, useEffect } from "react";

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/interviews");
      if (res.ok) {
        const data = await res.json();
        setInterviews(data.interviews || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Interview Schedule
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Upcoming and past interviews scheduled with hiring managers.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center text-slate-500 text-sm">
          No interviews currently scheduled. You will receive notifications when recruiters invite you for an interview.
        </div>
      ) : (
        <div className="grid gap-4">
          {interviews.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase">
                    {item.mode || "video"}
                  </span>
                  <span className="text-xs text-slate-400">
                    Status: <strong className="text-slate-700">{item.status}</strong>
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.jobId?.title || "Interview Session"}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  📅 Scheduled: <strong>{new Date(item.scheduledAt).toLocaleString()}</strong>
                </p>
              </div>

              {item.link && item.status === "scheduled" && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm text-center"
                >
                  Join Meeting ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
