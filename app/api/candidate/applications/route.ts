import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Application } from "@/models/Application";
import { Candidate } from "@/models/Candidate";
import { Job } from "@/models/Job";
import { getCandidateSession } from "@/lib/auth";

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
        email: "placeholder@career77.com",
        mobile,
        lookingFor: job ? job.title : "Not specified",
        resumes: resumeUrl ? [{
          url: resumeUrl,
          publicId: resumePublicId || "",
          filename: "Resume",
          isPrimary: true,
          uploadedAt: new Date()
        }] : [],
        skills: [],
      });
    } else {
      // Update resume links if a new file is uploaded
      if (resumeUrl) {
        candidate.resumes.push({
          url: resumeUrl,
          publicId: resumePublicId || "",
          filename: "Resume",
          isPrimary: candidate.resumes.length === 0,
          uploadedAt: new Date()
        });
        if (candidate.resumes.length > 3) {
          candidate.resumes.shift(); // Keep max 3
        }
        await candidate.save();
      }
    }

    // 2. Prevent duplicate application
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

    if (!candSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apps = await Application.find({ candidateId: candSession.candidateId })
      .populate("jobId")
      .sort({ appliedAt: -1 })
      .lean();
      
    return NextResponse.json({ applications: apps });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
