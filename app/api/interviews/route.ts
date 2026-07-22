import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Interview } from "@/models/Interview";
import { Application } from "@/models/Application";
import { Recruiter } from "@/models/Recruiter";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { cookies } from "next/headers";
import { verifyCandidateSession, getCandidateSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    const candSession = await getCandidateSession();

    if (session && session.user) {
      const role = (session.user as any).role;
      if (role === "superadmin") {
        const interviews = await Interview.find({})
          .populate("jobId", "title location")
          .populate("candidateId", "name email mobile")
          .sort({ scheduledAt: -1 })
          .lean();
        return NextResponse.json({ interviews });
      } else if (role === "recruiter") {
        const recruiterDoc = await Recruiter.findOne({ userId: (session.user as any).id });
        if (!recruiterDoc) {
          return NextResponse.json({ interviews: [] });
        }
        const interviews = await Interview.find({ recruiterId: recruiterDoc._id })
          .populate("jobId", "title location")
          .populate("candidateId", "name email mobile")
          .sort({ scheduledAt: -1 })
          .lean();
        return NextResponse.json({ interviews });
      }
    } else if (candSession) {
      const interviews = await Interview.find({ candidateId: candSession.candidateId })
        .populate("jobId", "title location")
        .sort({ scheduledAt: -1 })
        .lean();
      return NextResponse.json({ interviews });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "recruiter" && role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { applicationId, scheduledAt, mode, link, notes } = body;

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    let recruiterId = null;

    if (role === "recruiter") {
      const recruiterDoc = await Recruiter.findOne({ userId: (session.user as any).id });
      if (!recruiterDoc) {
        return NextResponse.json({ error: "Recruiter profile not found" }, { status: 404 });
      }
      recruiterId = recruiterDoc._id;
    } else {
      // Super Admin: fallback to recruiterId on the job posting
      recruiterId = (application.jobId as any)?.recruiterId;
    }

    if (!recruiterId) {
      return NextResponse.json({ error: "Invalid recruiter reference" }, { status: 400 });
    }

    const interview = await Interview.create({
      applicationId,
      candidateId: application.candidateId,
      recruiterId,
      jobId: application.jobId,
      scheduledAt: new Date(scheduledAt),
      mode,
      link,
      notes,
    });

    return NextResponse.json({ interview });
  } catch (error) {
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
  }
}
