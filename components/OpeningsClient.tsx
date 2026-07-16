"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IJob } from "@/models/Job";

export default function OpeningsClient({ initialJobs }: { initialJobs: IJob[] }) {
  const [jobs, setJobs] = useState<IJob[]>(initialJobs);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [cursor, setCursor] = useState<string | null>(
    initialJobs.length >= 10 ? initialJobs[initialJobs.length - 1]._id.toString() : null
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const isSearching = query || location;

  useEffect(() => {
    if (!isSearching) {
      setJobs(initialJobs);
      setCursor(
        initialJobs.length >= 10
          ? initialJobs[initialJobs.length - 1]._id.toString()
          : null
      );
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredJobs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, location, initialJobs]);

  const fetchFilteredJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(
          location
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setCursor(data.nextCursor);
      }
    } catch (e) {
      console.error("Failed to search jobs:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(
          location
        )}&cursor=${cursor}`
      );
      if (res.ok) {
        const data = await res.json();
        setJobs((prev) => [...prev, ...data.jobs]);
        setCursor(data.nextCursor);
      }
    } catch (e) {
      console.error("Failed to load more jobs:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or key skills (e.g. React, Node)"
          className="grow bg-white border border-slate-200 rounded-full px-6 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Jaipur, Remote)"
          className="sm:w-64 bg-white border border-slate-200 rounded-full px-6 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
        />
      </div>

      {/* JOBS GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : jobs.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <Link
                key={job._id.toString()}
                href={`/openings/${job.slug}-${job._id.toString()}`}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mb-4">
                    📍 {job.location} &middot; 💼 {job.experience || "Not specified"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-md font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {/* LOAD MORE BUTTON */}
          {cursor && (
            <div className="text-center mt-10">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-700 font-semibold px-6 py-2.5 rounded-full text-sm transition-all shadow-sm hover:shadow"
              >
                {loadingMore ? "Loading more..." : "Load More Openings"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-white text-slate-500">
          <span className="block text-4xl mb-3">🔍</span>
          <p className="font-semibold text-slate-600">No openings match your search.</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your keywords or location filter.</p>
        </div>
      )}
    </div>
  );
}
