"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";
import Link from "next/link";

export default function RecruiterRegisterPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !email.trim() || !password.trim()) {
      showToast("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          email: email.toLowerCase().trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Registration successful! Please log in.");
        router.push("/recruiter/login");
      } else {
        showToast(data.error || "Registration failed");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 grow w-full flex flex-col justify-center">
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Home
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-1.5">
            Recruiter Registration
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Create an employer account to post openings and search candidates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TechCorp Solutions"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-6 cursor-pointer"
          >
            {loading ? "Registering account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6 font-medium">
          Already have an account?{" "}
          <Link
            href="/recruiter/login"
            className="text-blue-600 hover:underline font-bold"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
