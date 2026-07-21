import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://career77.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/jobs/*", "/companies/*"],
        disallow: ["/candidate/", "/dashboard/", "/recruiter/", "/admin/", "/api/"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: ["/", "/jobs/*", "/companies/*"],
        disallow: [
          "/candidate/",
          "/dashboard/",
          "/recruiter/",
          "/admin/",
          "/api/",
          "/register/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
