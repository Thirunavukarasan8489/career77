import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Job, IJob } from "@/models/Job";

export const revalidate = 60;

export default async function Home() {
  await connectToDatabase();

  const rawJobs = await Job.find({ status: "open" })
    .sort({ postedAt: -1 })
    .limit(3)
    .lean();

  const featuredJobs = JSON.parse(JSON.stringify(rawJobs)) as IJob[];

  return (
    <div className="flex flex-col grow bg-[#F8FAFC] antialiased">
      {/* HERO SECTION */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1]">
              Connect with the Future of{" "}
              <span className="text-blue-600">Professional Growth.</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
              Whether you are scaling a team or searching for your next career milestone, Career77 provides the data-driven matching to ensure the perfect fit every time.
            </p>

            {/* Combined Search Box Card */}
            <form action="/openings" method="GET" className="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-md flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
              <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100 w-full">
                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="text"
                  name="query"
                  placeholder="Job title or keywords"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  name="location"
                  placeholder="City or remote"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all shrink-0 whitespace-nowrap"
              >
                Search Jobs
              </button>
            </form>

            {/* Social Proof Avatar Row */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="User avatar"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="User avatar"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                  alt="User avatar"
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                <strong className="text-slate-900">12k+</strong> professionals joined this week
              </span>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                alt="Modern team collaboration"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 KEY STATS BAR */}
      <section className="bg-white border-y border-slate-200/80 py-10 w-full px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-blue-600 tracking-tight">250K+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Jobs Posted</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-blue-600 tracking-tight">12K+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Companies Hiring</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-blue-600 tracking-tight">85K+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Candidates Placed</div>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-blue-600 tracking-tight">4.9/5</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Platform Rating</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / STREAMLINING YOUR CAREER JOURNEY */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Streamlining Your Career Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-2">
            Three simple steps to transition from searching to thriving in your next role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Create Profile</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Upload your resume and let our AI index your skills to match you with top employers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-400/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">One-Click Apply</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Access exclusive openings and apply instantly with personalized cover letters.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-600/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Get Hired</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Interview with top-tier companies and land your dream job with expert negotiation tools.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED OPPORTUNITIES SECTION */}
      <section className="bg-blue-50/40 border-y border-slate-200/60 py-16 sm:py-20 px-4 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Featured Opportunities
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Hand-picked roles from top-performing companies this week.
              </p>
            </div>
            <Link
              href="/openings"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>View All Jobs</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                    LOGO
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Featured
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Senior UX Designer</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">📍 Mountain View, CA (Remote)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    Full-time
                  </span>
                  <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    $140k - $190k
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Posted 2 days ago</span>
                <Link href="/openings" className="font-bold text-blue-600 hover:underline">
                  Apply Now
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    ⬡
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Hot
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Lead Backend Engineer</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">📍 Berlin, Germany</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    Contract
                  </span>
                  <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    €90k - €120k
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Posted 5 hours ago</span>
                <Link href="/openings" className="font-bold text-blue-600 hover:underline">
                  Apply Now
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                    🏛️
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    High Yield
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Fintech Product Lead</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">📍 London, UK</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    Full-time
                  </span>
                  <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    £110k - £160k
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Posted 1 day ago</span>
                <Link href="/openings" className="font-bold text-blue-600 hover:underline">
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-blue-50/80 border border-blue-100 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Ready to upgrade your professional life?
            </h2>
            <p className="text-xs sm:text-sm text-blue-700 font-medium max-w-xl">
              Join the community of 2M+ professionals already using Career77 to find their place in the future economy.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md shadow-blue-500/20 transition-all text-center"
            >
              Get Started Free
            </Link>
            <Link
              href="/recruiter/login"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-slate-200/80 shadow-xs transition-colors text-center"
            >
              Hire Talent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
