import { connectToDatabase } from "@/lib/db";
import { Job, IJob } from "@/models/Job";
import OpeningsClient from "@/components/OpeningsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function CandidateJobsPage() {
  await connectToDatabase();

  const rawJobs = await Job.find({ status: "open" })
    .populate("companyId", "name slug logoUrl verified")
    .sort({ postedAt: -1 })
    .lean();

  const initialJobs = JSON.parse(JSON.stringify(rawJobs)) as IJob[];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Personalized Job Search
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore openings tailored to your skills and track application statuses.
        </p>
      </div>

      <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>}>
        <OpeningsClient initialJobs={initialJobs} />
      </Suspense>
    </div>
  );
}
