import { NextResponse } from "next/server";
import { JobService } from "@/server/services/job.service";

const jobService = new JobService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query") || "";
    const location = searchParams.get("location") || "";
    const experience = searchParams.get("experience") || "";
    const cursor = searchParams.get("cursor") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const results = await jobService.searchJobs(searchQuery, location, experience, limit, cursor);

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
