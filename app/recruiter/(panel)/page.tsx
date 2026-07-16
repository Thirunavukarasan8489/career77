import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import DeleteJobButton from "@/components/DeleteJobButton";

export default async function RecruiterDashboard() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  const recruiterId = (session?.user as any)?.id;

  // Load jobs posted by this recruiter
  const rawJobs = await Job.find({ recruiterId }).sort({ postedAt: -1 });

  const jobsWithCount = await Promise.all(
    rawJobs.map(async (job) => {
      const count = await Application.countDocuments({ jobId: job._id });
      return {
        _id: job._id.toString(),
        title: job.title,
        location: job.location,
        experience: job.experience || "Not specified",
        applicantCount: count,
      };
    })
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900">
            My Postings
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Manage your active openings and review applicants.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/recruiter/post-job"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-sm text-center"
          >
            + Post New Job
          </Link>
        </div>
      </div>

      {/* JOBS LIST */}
      <div>
        {jobsWithCount.length > 0 ? (
          <div className="space-y-4">
            {jobsWithCount.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{job.title}</h3>
                  <p className="text-xs font-semibold text-slate-500">
                    📍 {job.location} &middot; 💼 {job.experience} &middot; 👥{" "}
                    {job.applicantCount} applicant{job.applicantCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Link
                    href={`/recruiter/jobs/${job._id}/applicants`}
                    className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-xs font-bold px-4 py-2.5 rounded-full transition-colors inline-block text-center shadow-sm"
                  >
                    View Applicants
                  </Link>
                  <Link
                    href={`/recruiter/jobs/${job._id}/edit`}
                    className="border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold px-4 py-2.5 rounded-full transition-colors inline-block text-center shadow-sm"
                  >
                    Edit
                  </Link>
                  <DeleteJobButton jobId={job._id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-white text-slate-500">
            <span className="block text-4xl mb-3">💼</span>
            <p className="font-semibold text-slate-600">No postings yet.</p>
            <p className="text-sm text-slate-400 mt-1">Get started by creating your first job listing.</p>
            <Link
              href="/recruiter/post-job"
              className="text-xs font-bold text-indigo-600 hover:underline mt-2 inline-block"
            >
              Post a job now &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
