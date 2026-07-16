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
        showToast("Welcome back! Redirecting...");
        router.push("/recruiter");
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
            Recruiter Login
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Post job openings and review applicant profiles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Email Address
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
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-bold transition-all shadow-md mt-6 cursor-pointer"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6 font-medium">
          Use email <span className="font-bold text-slate-600">recruiter@company.com</span> and password <span className="font-bold text-slate-600">password123</span> for demo access.
        </p>
      </div>
    </div>
  );
}
