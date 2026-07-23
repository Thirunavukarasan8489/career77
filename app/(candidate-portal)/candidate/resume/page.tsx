"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/common/Toast";
import { useMutation } from "@tanstack/react-query";

export default function CandidateResumePage() {
  const { candidate, refreshCandidate } = useApp();
  const [resumeUrl, setResumeUrl] = useState(candidate?.resumeUrl || "");

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const saveRes = await fetch("/api/candidate/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!saveRes.ok) throw new Error("Uploading resume failed");
      return saveRes.json();
    },
    onSuccess: async (resumes) => {
      const latestResume = resumes[resumes.length - 1];
      setResumeUrl(latestResume.url);
      await refreshCandidate();
      showToast("Resume uploaded successfully!");
    },
    onError: (err: any) => {
      showToast(err.message || "Failed to upload resume.");
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };


  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Resume Manager
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload your latest resume file or preview your existing document.
        </p>
      </div>

      {/* Cloudinary Signed Upload Dropzone */}
      <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl p-8 text-center hover:bg-indigo-50 transition-colors">
        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          📄
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-1">Upload New Resume</h3>
        <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
          Supported formats: PDF, DOCX (Max size: 5MB). Uploads are signed and processed securely via Cloudinary.
        </p>

        <label className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow-sm transition-all">
          {uploadMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Uploading...
            </>
          ) : (
            <>Select Resume File</>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploadMutation.isPending}
            className="hidden"
          />
        </label>
      </div>

      {/* Visual Resume Preview Card */}
      {resumeUrl ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Active Resume</span>
              <h4 className="font-bold text-slate-900 text-base">Uploaded Resume Document</h4>
            </div>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Download PDF ↗
            </a>
          </div>

          <div className="w-full h-96 bg-white border border-slate-200 rounded-lg overflow-hidden">
            <iframe src={resumeUrl} className="w-full h-full border-none" title="Resume Preview" />
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 text-sm">
          No resume uploaded yet.
        </div>
      )}
    </div>
  );
}
