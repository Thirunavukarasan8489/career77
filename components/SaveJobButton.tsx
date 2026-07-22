"use client";

import { useState } from "react";
import { showToast } from "@/components/Toast";

interface SaveJobButtonProps {
  jobId: string;
  initialSaved: boolean;
}

export default function SaveJobButton({ jobId, initialSaved }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/candidates/saved-jobs", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSaved(!isSaved);
        showToast(isSaved ? "Job removed from saved list" : "Job saved successfully.");
      } else {
        showToast(data.error || "Failed to update saved job status");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isSaved ? "Remove from saved list" : "Save this job"}
      className={`p-2 rounded-full border transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
        isSaved
          ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
          : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ minWidth: "40px", minHeight: "40px" }}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : isSaved ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M6.32 2.577a.75.75 0 01.75.75V19.5a.75.75 0 01-1.24.558L12 16.554l6.17 3.504a.75.75 0 01-1.24-.558V3.327a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v17.57a.75.75 0 01-1.22.582l-7.21-5.15-7.21 5.15a.75.75 0 01-1.22-.582V3.327a.75.75 0 01.75-.75h.01zm5.18 5.673a.75.75 0 10-1.5 0v3.5a.75.75 0 101.5 0v-3.5z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
      )}
    </button>
  );
}
