import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Job, IJob } from "@/models/Job";
import HomeSearchFilter from "@/components/HomeSearchFilter";
import HowItWorks from "@/components/HowItWorks";

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
      {/* HERO SECTION */}
      <section className="py-20 px-4 max-w-5xl mx-auto flex flex-col items-center w-full text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 font-sans">
          🚀 Job Board & Talent Matches
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-zinc-900 tracking-tight leading-none mb-4 max-w-3xl">
          Find your dream job now
        </h1>
        <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto mb-10 font-medium">
          5 Lakh+ jobs for you to explore
        </p>

        {/* Search Bar Component */}
        <div className="w-full mb-12 flex justify-center">
          <HomeSearchFilter />
        </div>
      </section>

      {/* STATISTICS BAR SECTION */}
      <section className="bg-zinc-100 border-y border-zinc-200/60 py-10 w-full px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="font-display font-black text-3xl text-blue-600 mb-1">5 Lakh+</div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Active Jobs</div>
          </div>
          <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="font-display font-black text-3xl text-blue-600 mb-1">15,000+</div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Verified Recruiters</div>
          </div>
          <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="font-display font-black text-3xl text-blue-600 mb-1">2.5 Lakh+</div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Matches Completed</div>
          </div>
          <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="font-display font-black text-3xl text-blue-600 mb-1">99%</div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Success Match Rate</div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES SECTION */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 block mb-2">
            Categories
          </span>
          <h2 className="font-display font-bold text-3xl text-zinc-900 tracking-tight">
            Browse Jobs by Popular Category
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Find the right fit according to your area of interest
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1: Software Engineering */}
          <Link
            href="/openings?query=Developer"
            className="group bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-display font-extrabold text-base text-zinc-900 mb-1.5">
                Software Engineering
              </h3>
              <p className="text-xs text-zinc-400 font-semibold mb-6">
                React, Node, Python, AWS
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1.5">
              Browse Openings &rarr;
            </span>
          </Link>

          {/* Card 2: Sales & Marketing */}
          <Link
            href="/openings?query=Sales"
            className="group bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="font-display font-extrabold text-base text-zinc-900 mb-1.5">
                Sales & Marketing
              </h3>
              <p className="text-xs text-zinc-400 font-semibold mb-6">
                Outbound, BD, SEO, Ad Campaigns
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1.5">
              Browse Openings &rarr;
            </span>
          </Link>

          {/* Card 3: Product & Design */}
          <Link
            href="/openings?query=Design"
            className="group bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="font-display font-extrabold text-base text-zinc-900 mb-1.5">
                Product & Design
              </h3>
              <p className="text-xs text-zinc-400 font-semibold mb-6">
                UI/UX, Figma, Product Managers
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1.5">
              Browse Openings &rarr;
            </span>
          </Link>

          {/* Card 4: Human Resources */}
          <Link
            href="/openings?query=HR"
            className="group bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-display font-extrabold text-base text-zinc-900 mb-1.5">
                Human Resources
              </h3>
              <p className="text-xs text-zinc-400 font-semibold mb-6">
                Recruitment, Employee Roster, Ops
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1.5">
              Browse Openings &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-zinc-50 border-t border-zinc-200/60 py-16 px-4 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 block mb-2">
              Workflow
            </span>
            <h2 className="font-display font-bold text-3xl text-zinc-900 tracking-tight">
              How Career77 Works
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              Simple, transparent matching process for candidates & recruiters
            </p>
          </div>

          <HowItWorks />
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="border-t border-zinc-200/60 py-16 px-4 bg-white w-full">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 block mb-2">
                Latest Postings
              </span>
              <h2 className="font-display font-bold text-3xl text-zinc-900 tracking-tight">
                Featured Openings
              </h2>
            </div>
            <Link
              href="/openings"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
            >
              See All Openings &rarr;
            </Link>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredJobs.map((job) => (
                <Link
                  key={job._id.toString()}
                  href={`/openings/${job.slug}-${job._id.toString()}`}
                  className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 group-hover:text-blue-600 transition-colors mb-1.5">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-500 mb-4">
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
            <div className="text-center py-16 border-2 border-dashed border-zinc-200 rounded-xl bg-white text-zinc-500">
              <span className="block text-4xl mb-3">💼</span>
              <p className="font-medium text-zinc-500">No openings posted yet.</p>
              <Link
                href="/recruiter/login"
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                Recruiters: Post a job now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* TRUSTED PARTNER LOGOS */}
      <section className="py-16 bg-white border-t border-zinc-200/60 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 block mb-2">
            Partners
          </span>
          <h2 className="font-display font-bold text-3xl text-zinc-900 tracking-tight">
            Top Employers Hiring Now
          </h2>
        </div>
        <div className="relative w-full flex items-center overflow-x-hidden py-4 bg-zinc-50 border-y border-zinc-150">
          <div className="flex gap-12 items-center animate-marquee whitespace-nowrap min-w-full">
            {/* Slide 1 */}
            <div className="flex gap-12 items-center shrink-0">
              {["TechCorp", "InnovateLabs", "GrowthCo", "CloudScale", "ApexDigital", "CoreSystems", "SmartSolutions", "NetGlobal"].map((name) => (
                <div
                  key={name}
                  className="inline-flex items-center justify-center bg-white border border-zinc-200/80 rounded-xl px-8 py-4 shadow-sm min-w-[160px] font-display font-extrabold text-lg text-zinc-400 hover:text-blue-600 hover:border-blue-200 transition-colors select-none"
                >
                  {name}
                </div>
              ))}
            </div>
            {/* Slide 2 */}
            <div className="flex gap-12 items-center shrink-0">
              {["TechCorp", "InnovateLabs", "GrowthCo", "CloudScale", "ApexDigital", "CoreSystems", "SmartSolutions", "NetGlobal"].map((name) => (
                <div
                  key={name + "-dup"}
                  className="inline-flex items-center justify-center bg-white border border-zinc-200/80 rounded-xl px-8 py-4 shadow-sm min-w-[160px] font-display font-extrabold text-lg text-zinc-400 hover:text-blue-600 hover:border-blue-200 transition-colors select-none"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
