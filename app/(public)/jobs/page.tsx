import { connectToDatabase } from "@/lib/db";
import { Job, IJob } from "@/models/Job";
import { Company } from "@/models/Company";
import OpeningsClient from "@/components/public/JobGrid";
import Link from "next/link";
import { Suspense } from "react";
import { Metadata } from "next";

export const revalidate = 60; // ISR baseline revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Explore Job Openings | Career77",
  description: "Browse software engineering, marketing, sales, and design job openings from top hiring companies on Career77.",
  openGraph: {
    title: "Explore Job Openings | Career77",
    description: "Browse tech, marketing, and sales job openings from top verified recruiters.",
  },
};

export default async function PublicJobsPage() {
  await connectToDatabase();

  const rawJobs = await Job.find({ status: "open" })
    .populate("companyId", "name slug logoUrl verified")
    .sort({ postedAt: -1 })
    .limit(10)
    .lean();

  const initialJobs = JSON.parse(JSON.stringify(rawJobs)) as IJob[];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grow w-full">
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Explore Openings
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Find your next career opportunity with top hiring companies.
        </p>
      </div>

      <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>}>
        <OpeningsClient initialJobs={initialJobs} />
      </Suspense>
    </div>
  );
}
