import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://career77.vercel.app";

  return {
    rules: [
      {
        // General search engines (Googlebot, Bingbot, etc.)
        userAgent: "*",
        allow: ["/", "/openings", "/openings/*"],
        disallow: ["/dashboard/", "/recruiter/", "/api/"],
      },
      {
        // AI Crawlers (deliberate choice: allow public jobs indexing for search/recommendations,
        // but block all registration, dashboard, and recruiter routes)
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: ["/", "/openings/*"],
        disallow: [
          "/dashboard/",
          "/recruiter/",
          "/api/",
          "/register/",
          "/register/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
