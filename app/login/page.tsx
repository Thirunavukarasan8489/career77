"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/components/Toast";
import Link from "next/link";

export default function CandidateLoginPage() {
  const { loginCandidate } = useApp();
  const router = useRouter();
  const [loginMobile, setLoginMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [submittingLogin, setSubmittingLogin] = useState(false);

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
            Candidate Login
          </h1>
          <p className="text-sm text-slate-500 font-medium">
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

        <p className="text-xs text-center text-slate-505 mt-6 font-medium">
          New to Career77?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-bold"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
