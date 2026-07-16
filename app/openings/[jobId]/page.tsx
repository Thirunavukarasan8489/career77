import { notFound } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import JobDetailInteractive from "@/components/JobDetailInteractive";

export const revalidate = 60; // Revalidate every 60s (ISR)

interface Props {
  params: Promise<{ jobId: string }>;
}

async function getJob(jobIdParam: string) {
  await connectToDatabase();
  const idParts = jobIdParam.split("-");
  const actualId = idParts[idParts.length - 1];

  // Validate if the extracted string is a valid MongoDB ObjectId
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
          href="/openings"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-full text-sm shadow-sm transition-all"
        >
          Browse Other Openings
        </Link>
      </div>
    );
  }

  const companyName = job.recruiterId?.companyName || "TechCorp";

  // JSON-LD JobPosting schema (Section 6)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || "Job opening on Career77",
    "datePosted": job.postedAt,
    "validThrough": new Date(
      new Date(job.postedAt).getTime() + 60 * 24 * 60 * 60 * 1000
    ).toISOString(), // 60 days validity
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": companyName,
      "sameAs": "https://career77.vercel.app",
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
    <div className="max-w-3xl mx-auto px-4 py-10 grow w-full">
      {/* JSON-LD Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <Link
          href="/openings"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Openings
        </Link>
      </div>

      <article className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        <header className="border-b border-slate-100 pb-6 mb-6">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-3">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-slate-500 text-xs sm:text-sm font-semibold mb-4">
            <span>📍 {job.location}</span>
            <span>💼 {job.experience || "Not specified"}</span>
            <span>📅 Posted {new Date(job.postedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill: string) => (
              <span
                key={skill}
                className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-md font-bold"
              >
                {skill}
              </span>
            ))}
          </div>
        </header>

        <section className="prose max-w-none text-slate-700 text-base leading-relaxed whitespace-pre-wrap mb-8">
          <h2 className="font-display font-bold text-lg text-slate-900 mb-3">
            Job Description
          </h2>
          {job.description || "No description provided."}
        </section>

        <div className="border-t border-slate-100 pt-6">
          <JobDetailInteractive job={simpleJob} />
        </div>
      </article>
    </div>
  );
}
