import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";

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
    <div className="grow bg-slate-50">
      {/* DASH HEADER */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-xl font-display">
              R
            </div>
            <div>
              <h1 className="font-display font-black text-xl text-slate-900">
                Recruiter Panel
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Logged in: <span className="text-blue-600">{session?.user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/recruiter/post-job"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-sm text-center"
            >
              + Post New Job
            </Link>
          </div>
        </div>
      </header>

      {/* MY POSTINGS */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="font-display font-extrabold text-lg text-slate-900 mb-6">
          My Postings
        </h2>

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
                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-full transition-colors inline-block text-center"
                  >
                    View Applicants
                  </Link>
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
              className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-block"
            >
              Post a job now &rarr;
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
