import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;
    const body = await request.json().catch(() => ({}));
    const { status, title, location, experience, skills, description } = body;

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Ensure the recruiter owns this job posting
    if (job.recruiterId && job.recruiterId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (status) job.status = status;
    if (title) job.title = title;
    if (location) job.location = location;
    if (experience) job.experience = experience;
    if (description) job.description = description;
    if (skills) {
      job.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    await job.save();

    // Revalidate paths (ISR)
    revalidatePath("/openings");
    revalidatePath(`/openings/${jobId}`);
    revalidatePath(`/openings/${job.slug}-${job._id}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update job" },
      { status: 500 }
    );
  }
}
