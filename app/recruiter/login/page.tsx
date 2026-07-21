"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast";
import Link from "next/link";

export default function RecruiterLoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/recruiter");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password: password.trim(),
      });

      if (res?.error) {
        showToast(res.error);
      } else {
        showToast("Welcome back! Redirecting to Recruiter Portal...");
        router.push("/recruiter");
      }
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col justify-between antialiased">
      {/* Navbar Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 sm:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold text-2xl text-blue-600 tracking-tight">
          Career77
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <Link href="/openings" className="hover:text-blue-600 transition-colors">Jobs</Link>
          <Link href="/openings" className="hover:text-blue-600 transition-colors">Companies</Link>
          <Link href="/recruiter/login" className="text-blue-600 font-bold">For Employers</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2">
            Login
          </Link>
          <Link
            href="/recruiter/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-all"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Main Centered Login Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Top Briefcase Icon Badge */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-bold text-slate-900 text-xl tracking-tight">Recruiter Portal</h1>
            <p className="text-xs text-slate-400 font-medium">
              Access your hiring dashboard and candidate pipelines.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Password reset link sent to your email.");
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200/80 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  👁️
                </button>
              </div>
            </div>

            {/* Keep me signed in Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="keepSigned"
                checked={keepSigned}
                onChange={(e) => setKeepSigned(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <label htmlFor="keepSigned" className="text-xs font-medium text-slate-600 select-none">
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Signing In..." : "Sign In to Portal"}</span>
              <span>➔</span>
            </button>
          </form>

          {/* Footer link */}
          <div className="text-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
            Don't have a company account?{" "}
            <Link href="/recruiter/register" className="font-bold text-blue-600 hover:underline">
              Contact sales
            </Link>
          </div>
        </div>

        {/* Below Card Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold tracking-wide uppercase mt-6">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>SSO & MFA SUPPORTED SECURE LOGIN</span>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-6 sm:px-12 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-bold text-slate-900 text-sm">Career77</span>
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-medium">
          <Link href="/openings" className="hover:text-blue-600">About Us</Link>
          <Link href="/openings" className="hover:text-blue-600">Careers</Link>
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600">Terms of Service</a>
          <a href="#" className="hover:text-blue-600">Help Center</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>
        <p>© 2024 Career77. All rights reserved.</p>
      </footer>
    </div>
  );
}
