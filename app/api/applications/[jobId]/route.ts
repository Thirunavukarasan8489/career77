import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { Notification } from "@/models/Notification";

export async function GET(
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
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Verify recruiter owns this job
    if (job.recruiterId && job.recruiterId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const apps = await Application.find({ jobId })
      .populate("candidateId")
      .sort({ appliedAt: -1 });

    return NextResponse.json({ applications: apps });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch applicants" },
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
    const { candidateId, status } = body;

    if (!candidateId || !status) {
      return NextResponse.json(
        { error: "Missing candidateId or status parameter" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.recruiterId && job.recruiterId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const application = await Application.findOneAndUpdate(
      { jobId, candidateId },
      { status },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Create notification for candidate (Section 11)
    await Notification.create({
      candidateId,
      message: `Your application status for "${job.title}" has been updated to "${status}".`,
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update application" },
      { status: 500 }
    );
  }
}
