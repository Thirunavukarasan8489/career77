"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";

interface Job {
  _id: string;
  title: string;
  location: string;
  skills: string[];
}

interface QuickApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickApplyModal({ job, isOpen, onClose }: QuickApplyModalProps) {
  const { candidate, refreshCandidate } = useApp();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumePublicId, setResumePublicId] = useState("");

  // Pre-fill if candidate is logged in
  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setMobile(candidate.mobile);
      if (candidate.resumeUrl) {
        setResumeUrl(candidate.resumeUrl);
        setResumePublicId(candidate.resumePublicId || "");
      }
    }
  }, [candidate, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate type and size (max 5MB)
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(selectedFile.type)) {
      showToast("Only PDF or DOC/DOCX files are allowed");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setUploading(true);

    try {
      // 1. Fetch signed signature from our API
      const sigRes = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: `career77/resumes` }),
      });

      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const sigData = await sigRes.json();

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      // We upload as 'raw' or 'auto' depending on type. For PDFs, raw or image work.
      // Cloudinary raw upload url:
      const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`;

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload to Cloudinary failed");
      const uploadData = await uploadRes.json();

      setResumeUrl(uploadData.secure_url);
      setResumePublicId(uploadData.public_id);
      showToast("Resume uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to upload resume");
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleWhatsAppApply = () => {
    const defaultWhatsApp = "919999999999";
    const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || defaultWhatsApp;
    
    const introName = name ? ` — my name is ${name}` : "";
    const text = `Hi, I'd like to apply for the ${job.title} position (${job.location})${introName}.`;
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      showToast("Name and mobile are required");
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      showToast("Please enter a valid 10-digit mobile number");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          name: name.trim(),
          mobile: mobile.trim(),
          resumeUrl,
          resumePublicId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Application submitted successfully!");
        refreshCandidate(); // update context if this was a registration-on-the-fly
        onClose();
      } else {
        showToast(data.error || "Failed to submit application");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg p-6 relative z-10 max-h-[92vh] overflow-y-auto transform transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg"
        >
          &times;
        </button>

        <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
          Apply &mdash; <span className="text-blue-600">{job.title}</span>
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Apply instantly via WhatsApp, or submit the form below.
        </p>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppApply}
          className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow"
        >
          <span className="text-lg">💬</span> Apply via WhatsApp
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 text-xs uppercase font-extrabold tracking-widest text-slate-400">
          <div className="grow h-px bg-slate-200" />
          <span>or fill form</span>
          <div className="grow h-px bg-slate-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Upload Resume
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                file
                  ? "border-emerald-500 bg-emerald-50/30"
                  : "border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/50"
              }`}
              onClick={() => document.getElementById("apply-file")?.click()}
            >
              <span className="block text-2xl mb-1">{file ? "📄" : "📤"}</span>
              <p className="text-sm font-semibold text-slate-700">
                {file ? file.name : "Tap to upload resume"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {uploading ? "Uploading file..." : "PDF or Word (max 5MB)"}
              </p>
            </div>
            <input
              type="file"
              id="apply-file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-full font-bold transition-colors shadow-md mt-6"
          >
            {submitting ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
