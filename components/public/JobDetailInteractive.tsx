"use client";

import React, { useState } from "react";
import QuickApplyModal from "@/components/candidate/QuickApplyModal";
import SaveJobButton from "@/components/candidate/SaveJobButton";
import { showToast } from "@/components/common/Toast";

interface Job {
  _id: string;
  title: string;
  location: string;
  skills: string[];
}

interface Props {
  job: Job;
  savedJobIds?: string[];
}

export default function JobDetailInteractive({ job, savedJobIds }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base px-10 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
        >
          Apply Now
        </button>

        {savedJobIds ? (
          <SaveJobButton
            jobId={job._id}
            initialSaved={savedJobIds.includes(job._id)}
          />
        ) : (
          <button
            onClick={() => showToast("Please log in as a candidate to save jobs.")}
            className="p-3 text-slate-400 hover:text-indigo-600 rounded-full border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center transition-all cursor-pointer"
            style={{ minWidth: "44px", minHeight: "44px" }}
            title="Bookmark Job"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
      </div>

      <QuickApplyModal
        job={job}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
