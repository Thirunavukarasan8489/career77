import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Job, IJob } from "@/models/Job";

// Landing Page: statically generated at build-time, revalidating periodically
export const revalidate = 60; // 60 seconds revalidation

export default async function Home() {
  await connectToDatabase();

  // Fetch the 4 most recent open jobs
  const rawJobs = await Job.find({ status: "open" })
    .sort({ postedAt: -1 })
    .limit(4)
    .lean();

  const featuredJobs = JSON.parse(JSON.stringify(rawJobs)) as IJob[];

  return (
    <div className="flex flex-col grow">
      {/* HERO */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 font-sans">
          🚀 Job Board & Talent Matches
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight leading-tight max-w-3xl mb-6">
          Find your next role, or <span className="text-blue-600">find your next hire</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mb-10">
          Browse active positions, register once with your resume, and let relevant opportunities find you automatically.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/openings"
            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 py-3.5 rounded-full hover:shadow-lg transition-all font-semibold"
          >
            Browse Openings
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-slate-50 text-blue-600 border-2 border-blue-600 text-base px-8 py-3 rounded-full hover:shadow-lg transition-all font-semibold"
          >
            Register as Candidate
          </Link>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="bg-slate-100/60 border-t border-slate-200/60 py-16 grow">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 block mb-2 font-sans">
            Latest Postings
          </span>
          <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight mb-8">
            Featured Openings
          </h2>

          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredJobs.map((job) => (
                <Link
                  key={job._id.toString()}
                  href={`/openings/${job.slug}-${job._id.toString()}`}
                  className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mb-4">
                      📍 {job.location} &middot; 💼 {job.experience || "Not specified"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-md font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-white text-slate-500">
              <span className="block text-4xl mb-3">💼</span>
              <p className="font-medium text-slate-500">No openings posted yet.</p>
              <Link href="/recruiter/login" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                Recruiters: Post a job now
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
