import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Application } from "@/models/Application";
import { Candidate } from "@/models/Candidate";
import { Job } from "@/models/Job";
import { verifyCandidateSession, getCandidateSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { jobId, name, mobile, resumeUrl, resumePublicId } = body;

    if (!jobId || !name || !mobile) {
      return NextResponse.json(
        { error: "Missing required fields (jobId, name, mobile)" },
        { status: 400 }
      );
    }

    // 1. Find or create candidate profile on the fly
    let candidate = await Candidate.findOne({ mobile });
    if (!candidate) {
      const job = await Job.findById(jobId);
      candidate = await Candidate.create({
        name,
        mobile,
        lookingFor: job ? job.title : "Not specified",
        resumeUrl: resumeUrl || "",
        resumePublicId: resumePublicId || "",
        skills: [],
      });
    } else {
      // Update resume links if a new file is uploaded
      if (resumeUrl && resumePublicId) {
        candidate.resumeUrl = resumeUrl;
        candidate.resumePublicId = resumePublicId;
        await candidate.save();
      }
    }

    // 2. Prevent duplicate application (Section 9 unique index)
    const existing = await Application.findOne({
      jobId,
      candidateId: candidate._id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this position" },
        { status: 409 }
      );
    }

    const application = await Application.create({
      jobId,
      candidateId: candidate._id,
      status: "Applied",
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const candSession = await getCandidateSession();

    // A. Candidate viewing their own applications
    if (candSession) {
      const apps = await Application.find({ candidateId: candSession.candidateId })
        .populate("jobId")
        .sort({ appliedAt: -1 });
      return NextResponse.json({ applications: apps });
    }

    // B. Recruiter viewing applications for their jobs
    const recSession = await getServerSession(authOptions);
    if (recSession && recSession.user) {
      const recruiterId = (recSession.user as any).id;
      const recJobs = await Job.find({ recruiterId });
      const jobIds = recJobs.map((j) => j._id);

      const apps = await Application.find({ jobId: { $in: jobIds } })
        .populate("candidateId")
        .populate("jobId")
        .sort({ appliedAt: -1 });

      return NextResponse.json({ applications: apps });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
