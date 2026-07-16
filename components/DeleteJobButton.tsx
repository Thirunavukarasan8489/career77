"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Job posting deleted successfully!");
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete job posting.");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="border border-red-600 hover:bg-red-50 text-red-600 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer inline-flex items-center justify-center min-w-[70px]"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
