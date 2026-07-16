import { connectToDatabase } from "@/lib/db";
import { Job, IJob } from "@/models/Job";
import OpeningsClient from "@/components/OpeningsClient";
import Link from "next/link";

export const revalidate = 60; // ISR baseline revalidate every 60s

export default async function OpeningsPage() {
  await connectToDatabase();

  // Pre-load the first 10 open jobs for bots and SEO indexers
  const rawJobs = await Job.find({ status: "open" })
    .sort({ _id: -1 })
    .limit(10)
    .lean();

  const initialJobs = JSON.parse(JSON.stringify(rawJobs)) as IJob[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grow w-full">
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Home
        </Link>
      </div>

      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-8">
        Job Openings
      </h1>

      <OpeningsClient initialJobs={initialJobs} />
    </div>
  );
}
