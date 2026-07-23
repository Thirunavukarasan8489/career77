"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";
import Link from "next/link";

export default function CandidateLoginPage() {
  const { loginCandidate } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("candidate@example.com");
  const [otpSent, setOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [submittingLogin, setSubmittingLogin] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address");
      return;
    }

    setSubmittingLogin(true);
    try {
      const res = await fetch("/api/candidates/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        showToast(data.message || "OTP code sent to your email! (Use OTP: 777777)");
      } else {
        showToast(data.error || "Failed to send OTP code");
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
      const res = await fetch("/api/candidates/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: email.trim(),
          otp: loginOtp.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Logged in successfully via Email OTP!");
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col justify-between antialiased">
      {/* Navbar Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 sm:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold text-2xl text-blue-600 tracking-tight">
          Career77
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <Link href="/openings" className="hover:text-blue-600 transition-colors">Jobs</Link>
          <Link href="/openings" className="hover:text-blue-600 transition-colors">Companies</Link>
          <Link href="/recruiter/login" className="hover:text-blue-600 transition-colors">For Employers</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs font-semibold text-blue-600 px-3 py-2">
            Candidate Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-all"
          >
            Register Resume
          </Link>
        </div>
      </header>

      {/* Main Centered Login Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Top Badge Icon */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="font-bold text-slate-900 text-xl tracking-tight">Candidate Portal</h1>
            <p className="text-xs text-slate-400 font-medium">
              Sign in with your registered email address to access your applications.
            </p>
          </div>

          {!otpSent ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Candidate Email Address</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full bg-white border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={submittingLogin || !email}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{submittingLogin ? "Sending Code..." : "Request Email Verification OTP"}</span>
                <span>➔</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">Enter 6-Digit OTP Code</label>
                <input
                  type="text"
                  required
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value)}
                  placeholder="Enter OTP (Use 777777)"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-center tracking-widest text-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <p className="text-xs text-slate-400 text-center mt-2 font-medium">
                  Sent to <strong className="text-slate-700">{email}</strong>. (Verification code: <span className="font-bold text-blue-600">777777</span>)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setLoginOtp(""); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs py-3 rounded-xl transition-colors text-center"
                >
                  Change Email
                </button>
                <button
                  type="submit"
                  disabled={submittingLogin || !loginOtp}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all text-center"
                >
                  {submittingLogin ? "Verifying..." : "Verify & Login"}
                </button>
              </div>
            </form>
          )}

          {/* Footer Link */}
          <div className="text-center text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
            New to Career77?{" "}
            <Link href="/register" className="font-bold text-blue-600 hover:underline">
              Register with Resume
            </Link>
          </div>
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
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>
        <p>© 2024 Career77. All rights reserved.</p>
      </footer>
    </div>
  );
}
