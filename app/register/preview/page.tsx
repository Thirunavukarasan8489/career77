"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";

interface GeneratedResume {
  name: string;
  mobile: string;
  email: string;
  role: string;
  exp: string;
  city: string;
  edu: string;
  skills: string[];
  work: string;
  summary: string;
}

export default function ResumePreviewPage() {
  const { loginCandidate } = useApp();
  const router = useRouter();
  const [resume, setResume] = useState<GeneratedResume | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const localData = localStorage.getItem("generated_resume");
    if (localData) {
      try {
        setResume(JSON.parse(localData));
      } catch {
        showToast("Error parsing resume details");
        router.push("/register");
      }
    } else {
      router.push("/register");
    }
  }, [router]);

  if (!resume) {
    return (
      <div className="flex justify-center items-center py-20 grow">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleConfirmProfile = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resume.name,
          mobile: resume.mobile,
          email: resume.email,
          experience: resume.exp,
          city: resume.city,
          skills: resume.skills,
          lookingFor: resume.role,
          resumeUrl: "",
          resumePublicId: "",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Profile created with generated resume!");
        loginCandidate(data.candidate);
        localStorage.removeItem("generated_resume");
        router.push("/dashboard");
      } else {
        showToast(data.error || "Profile creation failed");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 grow w-full print:p-0">
      <div className="mb-6 print:hidden">
        <button
          onClick={() => router.push("/register")}
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          &larr; Back to Register
        </button>
      </div>

      <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-6 print:hidden">
        Your Generated Resume
      </h1>

      {/* PAPER RESUME SHEET */}
      <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-8 sm:p-12 max-w-2xl mx-auto font-sans text-slate-800 leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0">
        <header className="border-b-2 border-blue-100 pb-4 mb-6">
          <h2 className="font-display font-black text-3xl text-slate-950 tracking-tight mb-1">
            {resume.name}
          </h2>
          <div className="text-sm font-bold text-blue-600 mb-2">{resume.role}</div>
          <div className="text-xs text-slate-500 font-semibold flex flex-wrap gap-x-3 gap-y-1">
            <span>📞 {resume.mobile}</span>
            {resume.email && <span>✉️ {resume.email}</span>}
            {resume.city && <span>📍 {resume.city}</span>}
          </div>
        </header>

        <section className="mb-6">
          <h3 className="text-xs uppercase font-extrabold text-blue-600 tracking-wider mb-2.5 pb-1 border-b border-blue-50">
            Professional Summary
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{resume.summary}</p>
        </section>

        {resume.work && (
          <section className="mb-6">
            <h3 className="text-xs uppercase font-extrabold text-blue-600 tracking-wider mb-2.5 pb-1 border-b border-blue-50">
              Work Experience
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {resume.work}
            </p>
          </section>
        )}

        {resume.edu && (
          <section className="mb-6">
            <h3 className="text-xs uppercase font-extrabold text-blue-600 tracking-wider mb-2.5 pb-1 border-b border-blue-50">
              Education
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {resume.edu}
            </p>
          </section>
        )}

        {resume.skills && resume.skills.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xs uppercase font-extrabold text-blue-600 tracking-wider mb-2.5 pb-1 border-b border-blue-50">
              Skills
            </h3>
            <ul className="list-disc pl-5 text-sm text-slate-700 grid grid-cols-2 gap-x-6 gap-y-1.5">
              {resume.skills.map((skill) => (
                <li key={skill} className="font-medium text-slate-700">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Actions */}
      <div className="max-w-2xl mx-auto flex flex-wrap gap-4 mt-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-700 py-3 rounded-full font-bold transition-all text-center cursor-pointer"
        >
          🖨️ Print / Save as PDF
        </button>
        <button
          onClick={handleConfirmProfile}
          disabled={submitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-full font-bold transition-all text-center cursor-pointer shadow-md"
        >
          {submitting ? "Saving Profile..." : "Looks Good — Create Profile"}
        </button>
      </div>

      <p className="text-xs text-center text-slate-400 mt-4 print:hidden">
        Choose "Save as PDF" as the destination in the print dialog.
      </p>
    </div>
  );
}
