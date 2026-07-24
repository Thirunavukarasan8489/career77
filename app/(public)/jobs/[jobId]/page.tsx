import { notFound } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";
import { Recruiter } from "@/models/Recruiter";
import { Candidate } from "@/models/Candidate";
import { getCandidateSession } from "@/lib/auth";
import JobDetailInteractive from "@/components/public/JobDetailInteractive";

export const revalidate = 60; // ISR baseline revalidate every 60 seconds

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
      .populate("companyId", "name slug logoUrl verified about website")
      .populate("recruiterId", "companyName name")
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
    return {
      title: "Job Not Found | Career77",
    };
  }

  if (job.status === "closed") {
    return {
      title: "Job Closed | Career77",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${job.title} - ${job.location} | Career77`,
    description:
      job.description?.substring(0, 160) ||
      `Apply for ${job.title} job posting in ${job.location} on Career77 today.`,
    openGraph: {
      title: `${job.title} | Career77`,
      description: job.description?.substring(0, 160) || `Apply for ${job.title} job.`,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { jobId } = await params;
  const job = await getJob(jobId);

  if (!job) {
    notFound();
  }

  const session = await getCandidateSession();
  let savedJobIds: string[] | undefined = undefined;
  if (session?.candidateId) {
    const candidateDoc = await Candidate.findById(session.candidateId).select("savedJobs").lean();
    if (candidateDoc && candidateDoc.savedJobs) {
      savedJobIds = candidateDoc.savedJobs.map((id: any) => id.toString());
    }
  }

  const isClosed = job.status === "closed";

  if (isClosed) {
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
          href="/jobs"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-full text-sm shadow-sm transition-all"
        >
          Browse Other Openings
        </Link>
      </div>
    );
  }

  const companyName = job.companyId?.name || job.recruiterId?.companyName || "Career77 Partner";
  const companySlug = job.companyId?.slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || "Job opening on Career77",
    "datePosted": job.postedAt,
    "validThrough": new Date(
      new Date(job.postedAt).getTime() + 60 * 24 * 60 * 60 * 1000
    ).toISOString(),
    "employmentType": job.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": companyName,
      "sameAs": job.companyId?.website || "https://career77.vercel.app",
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "IN",
      },
    },
  };

  const simpleJob = {
    _id: job._id.toString(),
    title: job.title,
    location: job.location,
    skills: job.skills,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grow w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/jobs"
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Openings
        </Link>
        {companySlug && (
          <Link
            href={`/companies/${companySlug}`}
            className="text-xs sm:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            View Company Profile &rarr;
          </Link>
        )}
      </div>

      <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <header className="border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
              {companyName}
            </span>
            {job.companyId?.verified && (
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                ✓ Verified Company
              </span>
            )}
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-3">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-slate-500 text-xs sm:text-sm font-semibold mb-4">
            <span>📍 {job.location}</span>
            {job.experience && <span>💼 {job.experience}</span>}
            {job.salaryRange && <span>💰 {job.salaryRange}</span>}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.skills?.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Job Description</h2>
          <div className="whitespace-pre-line">{job.description}</div>
        </div>

        <JobDetailInteractive job={simpleJob} savedJobIds={savedJobIds} />
      </article>
    </div>
  );
}
