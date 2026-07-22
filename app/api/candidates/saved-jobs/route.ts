import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Candidate } from "@/models/Candidate";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company"; // Import to register schema
import { getCandidateSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getCandidateSession();
    if (!session || !session.candidateId) {
      return NextResponse.json(
        { error: "You must be signed in to view saved jobs." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Explicitly make sure models are registered
    if (!mongoose.models.Company) {
      mongoose.model("Company");
    }
    if (!mongoose.models.Job) {
      mongoose.model("Job");
    }

    const candidate = await Candidate.findById(session.candidateId)
      .populate({
        path: "savedJobs",
        populate: { path: "companyId", select: "name slug logoUrl verified" }
      });

    return NextResponse.json({ savedJobs: candidate?.savedJobs || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCandidateSession();
    if (!session || !session.candidateId) {
      return NextResponse.json(
        { error: "You must be signed in to save jobs." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { jobId } = body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID provided." },
        { status: 400 }
      );
    }

    // Verify job exists
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return NextResponse.json(
        { error: "Job opening not found." },
        { status: 404 }
      );
    }

    // Get current candidate to check limit
    const candidate = await Candidate.findById(session.candidateId);
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate profile not found." },
        { status: 404 }
      );
    }

    const savedList = candidate.savedJobs || [];
    if (savedList.length >= 50 && !savedList.some(id => id.toString() === jobId)) {
      return NextResponse.json(
        { error: "You have reached the maximum limit of 50 saved jobs." },
        { status: 400 }
      );
    }

    await Candidate.findByIdAndUpdate(session.candidateId, {
      $addToSet: { savedJobs: jobId }
    });

    return NextResponse.json({ success: true, message: "Job bookmarked successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCandidateSession();
    if (!session || !session.candidateId) {
      return NextResponse.json(
        { error: "You must be signed in to manage saved jobs." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { jobId } = body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID provided." },
        { status: 400 }
      );
    }

    await Candidate.findByIdAndUpdate(session.candidateId, {
      $pull: { savedJobs: jobId }
    });

    return NextResponse.json({ success: true, message: "Job removed from saved list" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
