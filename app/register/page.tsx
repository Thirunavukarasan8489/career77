"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";

type Tab = "have" | "build" | "login";

export default function RegisterPage() {
  const { loginCandidate } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("have");

  // State for "I have a resume" tab
  const [haveForm, setHaveForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    experience: "",
    city: "",
    skills: "",
    lookingFor: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumePublicId, setResumePublicId] = useState("");

  // State for "Build one for me" tab
  const [buildForm, setBuildForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    role: "",
    experience: "",
    city: "",
    education: "",
    skills: "",
    work: "",
  });

  // State for "Returning Candidate Login"
  const [loginMobile, setLoginMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [submittingRegister, setSubmittingRegister] = useState(false);

  // Resume Upload Handler (I have a resume)
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(selectedFile.type)) {
      showToast("Only PDF or DOC/DOCX files are allowed");
      return;
    }

    setFile(selectedFile);
    setUploading(true);
    setParsing(true);

    try {
      // 1. Fetch Cloudinary signed signature
      const sigRes = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "career77/resumes" }),
      });

      if (!sigRes.ok) throw new Error("Failed to get signature");
      const sigData = await sigRes.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/raw/upload`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData?.error?.message || "Cloudinary upload failed");
      }
      const uploadData = await uploadRes.json();

      setResumeUrl(uploadData.secure_url);
      setResumePublicId(uploadData.public_id);

      // Simulate parsing candidate details from filename
      setTimeout(() => {
        const cleanName = selectedFile.name
          .replace(/\.[^/.]+$/, "") // strip extension
          .replace(/[_-]/g, " ")
          .trim();
        const firstNameGuess = cleanName.split(" ")[0] || "";
        const lastNameGuess = cleanName.split(" ").slice(1).join(" ") || "";

        setHaveForm((prev) => ({
          ...prev,
          firstName: firstNameGuess,
          lastName: lastNameGuess,
          skills: "React, JavaScript, HTML, CSS",
          experience: "2 years",
        }));

        setParsing(false);
        setUploading(false);
        showToast("Resume read! Verify parsed fields below.");
      }, 1500);

    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to upload resume");
      setFile(null);
      setUploading(false);
      setParsing(false);
    }
  };

  // Submit "I have a resume" Registration
  const handleHaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!haveForm.firstName || !haveForm.mobile || !haveForm.lookingFor) {
      showToast("Please fill in all required fields");
      return;
    }

    if (!/^\d{10}$/.test(haveForm.mobile.trim())) {
      showToast("Please enter a valid 10-digit mobile number");
      return;
    }

    setSubmittingRegister(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${haveForm.firstName} ${haveForm.lastName}`.trim(),
          mobile: haveForm.mobile.trim(),
          email: haveForm.email.trim(),
          experience: haveForm.experience.trim(),
          city: haveForm.city.trim(),
          skills: haveForm.skills,
          lookingFor: haveForm.lookingFor.trim(),
          resumeUrl,
          resumePublicId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Registration successful!");
        loginCandidate(data.candidate);
        router.push("/dashboard");
      } else {
        showToast(data.error || "Registration failed");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSubmittingRegister(false);
    }
  };

  // Submit "Build one for me" Form to get AI Preview
  const handleBuildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildForm.firstName || !buildForm.mobile || !buildForm.role) {
      showToast("Name, mobile number, and target role are required");
      return;
    }

    if (!/^\d{10}$/.test(buildForm.mobile.trim())) {
      showToast("Please enter a valid 10-digit mobile number");
      return;
    }

    setSubmittingRegister(true);
    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${buildForm.firstName} ${buildForm.lastName}`.trim(),
          mobile: buildForm.mobile.trim(),
          email: buildForm.email.trim(),
          role: buildForm.role.trim(),
          exp: buildForm.experience.trim(),
          city: buildForm.city.trim(),
          edu: buildForm.education.trim(),
          skills: buildForm.skills,
          work: buildForm.work.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("generated_resume", JSON.stringify(data.resume));
        showToast("Resume generated! Redirecting to preview...");
        router.push("/register/preview");
      } else {
        showToast(data.error || "Failed to generate resume");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSubmittingRegister(false);
    }
  };

  // Login Handlers
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(loginMobile.trim())) {
      showToast("Please enter a valid 10-digit mobile number");
      return;
    }

    setSubmittingLogin(true);
    try {
      const res = await fetch("/api/candidates/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: loginMobile.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        showToast("Simulated OTP sent! Enter '7777' to log in.");
      } else {
        showToast(data.error || "Failed to initiate login");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginOtp) {
      showToast("Please enter the verification code");
      return;
    }

    setSubmittingLogin(true);
    try {
      const res = await fetch("/api/candidates/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: loginMobile.trim(),
          otp: loginOtp.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Logged in successfully!");
        loginCandidate(data.candidate);
        router.push("/dashboard");
      } else {
        showToast(data.error || "Incorrect verification code");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setSubmittingLogin(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 grow w-full">
      {/* Tabs selector */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-full mb-8 max-w-md mx-auto shadow-sm border border-slate-200">
        <button
          onClick={() => setActiveTab("have")}
          className={`flex-1 text-center py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            activeTab === "have"
              ? "bg-blue-600 text-white shadow-md scale-[1.02]"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-300/40"
          }`}
        >
          I have a resume
        </button>
        <button
          onClick={() => setActiveTab("build")}
          className={`flex-1 text-center py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            activeTab === "build"
              ? "bg-blue-600 text-white shadow-md scale-[1.02]"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-300/40"
          }`}
        >
          Build one for me
        </button>
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 text-center py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            activeTab === "login"
              ? "bg-blue-600 text-white shadow-md scale-[1.02]"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-300/40"
          }`}
        >
          Sign In
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Have Resume Registration */}
        {activeTab === "have" && (
          <form onSubmit={handleHaveSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
                Candidate Registration
              </h2>
              <p className="text-sm text-slate-500">
                Upload your resume to pre-fill most fields automatically.
              </p>
            </div>

            {/* File upload */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                Upload Resume
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  file
                    ? "border-emerald-500 bg-emerald-50/20"
                    : "border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/50"
                }`}
                onClick={() => document.getElementById("reg-file")?.click()}
              >
                <span className="block text-3xl mb-1">{file ? "📄" : "📤"}</span>
                <p className="text-sm font-semibold text-slate-700">
                  {file ? file.name : "Tap to upload resume"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {parsing ? "Parsing details..." : "PDF or Word (max 5MB)"}
                </p>
              </div>
              <input
                type="file"
                id="reg-file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul"
                  value={haveForm.firstName}
                  onChange={(e) => setHaveForm({ ...haveForm, firstName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sharma"
                  value={haveForm.lastName}
                  onChange={(e) => setHaveForm({ ...haveForm, lastName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="10-digit number"
                value={haveForm.mobile}
                onChange={(e) => setHaveForm({ ...haveForm, mobile: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                Email
              </label>
              <input
                type="email"
                placeholder="e.g. name@example.com"
                value={haveForm.email}
                onChange={(e) => setHaveForm({ ...haveForm, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Total Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 years"
                  value={haveForm.experience}
                  onChange={(e) => setHaveForm({ ...haveForm, experience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Current City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur"
                  value={haveForm.city}
                  onChange={(e) => setHaveForm({ ...haveForm, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                Key Skills (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, CSS"
                value={haveForm.skills}
                onChange={(e) => setHaveForm({ ...haveForm, skills: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                What job are you looking for? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Developer, Remote"
                value={haveForm.lookingFor}
                onChange={(e) => setHaveForm({ ...haveForm, lookingFor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                This helps recruiters discover your profile automatically.
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading || submittingRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-6 cursor-pointer"
            >
              {submittingRegister ? "Saving Profile..." : "Create Profile"}
            </button>
          </form>
        )}

        {/* Build Resume Form */}
        {activeTab === "build" && (
          <form onSubmit={handleBuildSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
                AI Resume Builder
              </h2>
              <p className="text-sm text-slate-500">
                No resume? Fill out this quick form to generate a professional PDF.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja"
                  value={buildForm.firstName}
                  onChange={(e) => setBuildForm({ ...buildForm, firstName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Patel"
                  value={buildForm.lastName}
                  onChange={(e) => setBuildForm({ ...buildForm, lastName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="10-digit number"
                  value={buildForm.mobile}
                  onChange={(e) => setBuildForm({ ...buildForm, mobile: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={buildForm.email}
                  onChange={(e) => setBuildForm({ ...buildForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                Target Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Backend Engineer"
                value={buildForm.role}
                onChange={(e) => setBuildForm({ ...buildForm, role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Experience Level
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fresher / 2 years"
                  value={buildForm.experience}
                  onChange={(e) => setBuildForm({ ...buildForm, experience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Target City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remote / Pune"
                  value={buildForm.city}
                  onChange={(e) => setBuildForm({ ...buildForm, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                Education
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech CSE, MNIT Jaipur, 2024"
                value={buildForm.education}
                onChange={(e) => setBuildForm({ ...buildForm, education: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                Skills (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Node.js, MongoDB, Excel"
                value={buildForm.skills}
                onChange={(e) => setBuildForm({ ...buildForm, skills: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                Brief Work / Project History
              </label>
              <textarea
                placeholder="e.g. Intern at XYZ Co — optimized backend endpoints (6 months)"
                value={buildForm.work}
                onChange={(e) => setBuildForm({ ...buildForm, work: e.target.value })}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-6 cursor-pointer"
            >
              {submittingRegister ? "Generating..." : "Generate My Resume"}
            </button>
          </form>
        )}

        {/* Candidate Login */}
        {activeTab === "login" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
                Candidate Login
              </h2>
              <p className="text-sm text-slate-500">
                Log in to check your applications and update your job search status.
              </p>
            </div>

            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your 10-digit number"
                    value={loginMobile}
                    onChange={(e) => setLoginMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={submittingLogin || !loginMobile}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-4 cursor-pointer"
                >
                  {submittingLogin ? "Checking..." : "Request Verification Code"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter code (use 7777)"
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-center tracking-widest text-lg font-bold"
                  />
                  <p className="text-xs text-slate-400 text-center mt-2 font-medium">
                    For verification bypass, input code <span className="font-bold text-slate-700">7777</span>.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setLoginOtp("");
                    }}
                    className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-3 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submittingLogin}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer"
                  >
                    {submittingLogin ? "Verifying..." : "Verify & Login"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
