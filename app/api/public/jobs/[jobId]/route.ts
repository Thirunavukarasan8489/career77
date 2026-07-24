import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    await connectToDatabase();
    const { jobId } = await params;
    
    // Support finding by slug-id or raw id
    // The clean URL will be like /openings/frontend-developer-1234
    // So we can extract the id from the end of the string if it contains hyphens
    const idParts = jobId.split("-");
    const actualId = idParts[idParts.length - 1];

    // Verify it is a valid ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(actualId);
    const searchId = isValidObjectId ? actualId : jobId;

    const job = await Job.findById(searchId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status === "closed") {
      // Respond with 410 Gone per Section 6
      return NextResponse.json({ error: "Job posting is gone" }, { status: 410 });
    }

    return NextResponse.json({ job });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve job" },
      { status: 500 }
    );
  }
}
