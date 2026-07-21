import { notFound } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import JobDetailInteractive from "@/components/JobDetailInteractive";

export const revalidate = 60;

interface Props {
  params: Promise<{ jobId: string }>;
}

async function getJob(jobIdParam: string) {
  await connectToDatabase();
  const idParts = jobIdParam.split("-");
  const actualId = idParts[idParts.length - 1];

  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(actualId);
  const searchId = isValidObjectId ? actualId : jobIdParam;

  try {
    const job = await Job.findById(searchId)
      .populate("recruiterId", "companyName")
      .lean();
    return job ? JSON.parse(JSON.stringify(job)) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { jobId } = await params;
  const job = await getJob(jobId);

  if (!job) {
    return { title: "Job Not Found | Career77" };
  }

  if (job.status === "closed") {
    return {
      title: "Job Closed | Career77",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${job.title} - ${job.location} | Career77`,
    description: job.description?.substring(0, 160) || `Apply for ${job.title} job posting on Career77.`,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { jobId } = await params;
  const job = await getJob(jobId);

  if (!job) {
    notFound();
  }

  if (job.status === "closed") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center grow flex flex-col justify-center items-center">
        <span className="text-5xl mb-4">🚫</span>
        <h1 className="font-display font-bold text-3xl text-slate-800 mb-2">
          This Job Posting is Closed
        </h1>
        <p className="text-slate-500 mb-8">
          The opening you are looking for has been closed and is no longer accepting applications.
        </p>
        <Link
          href="/openings"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition-all"
        >
          Browse Other Openings
        </Link>
      </div>
    );
  }

  const companyName = job.recruiterId?.companyName || "TechFlow Systems";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || "Job opening on Career77",
    "datePosted": job.postedAt,
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": companyName,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
      },
    },
  };

  const simpleJob = {
    _id: job._id.toString(),
    title: job.title,
    location: job.location,
    skills: job.skills || [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-sm border border-blue-100 shrink-0">
            LOGO
          </div>
          <div className="space-y-1.5 min-w-0">
            <h1 className="font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 font-medium">
              <span>🏢 {companyName}</span>
              <span>•</span>
              <span>📍 {job.location} (Hybrid)</span>
              <span>•</span>
              <span>🕒 Posted 2 days ago</span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <JobDetailInteractive job={simpleJob} />
        </div>
      </div>

      {/* Main Split Grid Layout: Left Content (~65%) and Right Sidebar (~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Job Description Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Tab Headers */}
          <div className="flex items-center gap-8 border-b border-slate-100 pb-4 text-sm font-semibold">
            <button className="text-blue-600 font-bold border-b-2 border-blue-600 pb-4 -mb-4">
              Description
            </button>
            <button className="text-slate-400 hover:text-slate-600">Requirements</button>
            <button className="text-slate-400 hover:text-slate-600">About Company</button>
          </div>

          {/* Job Description Text */}
          <div className="space-y-6 pt-2">
            <div>
              <h2 className="font-bold text-slate-900 text-lg tracking-tight mb-3">Job Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {job.description ||
                  "We are looking for a Senior Product Designer to join our core product team. You will be responsible for leading the design of complex financial workflows, ensuring they are both highly functional and visually elegant. You'll work closely with engineers and product managers to translate user needs into intuitive digital experiences."}
              </p>
            </div>

            {/* Key Responsibilities Bullet List */}
            <div className="space-y-3">
              {[
                "Lead end-to-end design processes for flagship products.",
                "Collaborate with cross-functional teams to define product vision and roadmap.",
                "Advocate for user-centric design within the organization.",
                "Mentor junior designers and help scale our design system.",
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Job Summary & Hiring Manager Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Job Summary */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-lg tracking-tight">Job Summary</h3>

            <div className="space-y-4">
              {/* Salary Range */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  💵
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Salary Range</span>
                  <span className="text-sm font-bold text-slate-900">{job.salaryRange || "$140k - $190k / year"}</span>
                </div>
              </div>

              {/* Job Type */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  💼
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Job Type</span>
                  <span className="text-sm font-bold text-slate-900">Full-time</span>
                </div>
              </div>

              {/* Experience Required */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  🎖️
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Experience Required</span>
                  <span className="text-sm font-bold text-slate-900">{job.experience || "Senior (5+ years)"}</span>
                </div>
              </div>

              {/* Team Size */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  👥
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Team Size</span>
                  <span className="text-sm font-bold text-slate-900">15-20 People</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <JobDetailInteractive job={simpleJob} />
              <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2">
                <span>🔖</span>
                <span>Save Job</span>
              </button>
            </div>

            {/* Friends Work Here Social Proof */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Friend avatar"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="Friend avatar"
                />
              </div>
              <span>2 Friends work here</span>
            </div>
          </div>

          {/* Card 2: Hiring Manager */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Sarah Chen"
                className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hiring Manager</span>
                <h4 className="font-bold text-slate-900 text-sm truncate">Sarah Chen</h4>
              </div>
            </div>
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline shrink-0">
              Send Message
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section: Similar Jobs */}
      <div className="space-y-4 pt-6">
        <h2 className="font-bold text-slate-900 text-xl tracking-tight">Similar Jobs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center shrink-0">
                LOGO
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">UI/UX Designer</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">DesignSphere Agency • $120k - $150k</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-semibold text-xs px-2.5 py-0.5 rounded-full shrink-0">
              Remote
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center shrink-0">
                LOGO
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Visual Designer</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">StripeScale Finance • $130k - $160k</p>
              </div>
            </div>
            <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5 rounded-full shrink-0">
              On-site
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
