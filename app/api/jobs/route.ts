import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import { Candidate } from "@/models/Candidate";
import { Notification } from "@/models/Notification";
import { isMatch } from "@/lib/matching";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query") || "";
    const location = searchParams.get("location") || "";
    const experience = searchParams.get("experience") || "";
    const cursor = searchParams.get("cursor") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const matchQuery: any = { status: "open" };

    if (location) {
      matchQuery.location = { $regex: new RegExp(location, "i") };
    }

    if (searchQuery) {
      matchQuery.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { skills: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    if (experience) {
      if (experience.toLowerCase() === "fresher") {
        matchQuery.experience = { $regex: /(fresher|0-1|0-2|0\s*-\s*1|0\s*-\s*2|not specified)/i };
      } else {
        matchQuery.experience = { $regex: new RegExp(experience, "i") };
      }
    }

    if (cursor) {
      matchQuery._id = { $lt: cursor };
    }

    // Sort by descending _id (newest first)
    const jobs = await Job.find(matchQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    const hasNextPage = jobs.length > limit;
    const results = hasNextPage ? jobs.slice(0, limit) : jobs;
    const nextCursor = hasNextPage ? results[results.length - 1]._id.toString() : null;

    return NextResponse.json({ jobs: results, nextCursor });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { title, location, experience, skills, description } = body;

    if (!title || !location) {
      return NextResponse.json(
        { error: "Title and location are required fields" },
        { status: 400 }
      );
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

    const job = await Job.create({
      title,
      slug,
      location,
      experience,
      skills: skillsArray,
      description,
      status: "open",
      recruiterId: (session.user as any).id,
    });

    // 1. Auto-match notifications (Section 11)
    const candidates = await Candidate.find({});
    for (const cand of candidates) {
      if (isMatch(cand, job)) {
        await Notification.create({
          candidateId: cand._id,
          message: `New match: "${job.title}" in ${job.location} matches your preferences.`,
        });
      }
    }

    // 2. IndexNow ping (Section 6)
    try {
      const host = new URL(request.url).host;
      const jobUrl = `https://${host}/openings/${slug}-${job._id}`;
      console.log(`[IndexNow] Simulating search engine ping for new job: ${jobUrl}`);
    } catch (e) {
      console.error("[IndexNow] Failed to log IndexNow ping:", e);
    }

    // 3. Revalidate cache (Section 5)
    revalidatePath("/openings");
    revalidatePath("/");

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create job" },
      { status: 500 }
    );
  }
}
