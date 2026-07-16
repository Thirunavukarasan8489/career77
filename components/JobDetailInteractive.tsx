"use client";

import React, { useState } from "react";
import QuickApplyModal from "@/components/QuickApplyModal";

interface Job {
  _id: string;
  title: string;
  location: string;
  skills: string[];
}

export default function JobDetailInteractive({ job }: { job: Job }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base px-10 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all text-center cursor-pointer mt-4"
      >
        Apply Now
      </button>

      <QuickApplyModal
        job={job}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
