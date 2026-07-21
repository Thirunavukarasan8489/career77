import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://career77.vercel.app";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  try {
    await connectToDatabase();
    const activeJobs = await Job.find({ status: "open" }).select("slug _id postedAt");
    const activeCompanies = await Company.find({}).select("slug updatedAt");

    const jobRoutes = activeJobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug || job._id.toString()}`,
      lastModified: new Date(job.postedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const companyRoutes = activeCompanies.map((company) => ({
      url: `${baseUrl}/companies/${company.slug}`,
      lastModified: new Date(company.updatedAt || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...jobRoutes, ...companyRoutes];
  } catch (e) {
    console.error("[Sitemap Error] Failed to generate dynamic sitemap:", e);
    return staticRoutes;
  }
}
