import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Interview } from "@/models/Interview";
import { Application } from "@/models/Application";
import { Recruiter } from "@/models/Recruiter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || ((session.user as any).role !== "recruiter" && (session.user as any).role !== "superadmin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || ((session.user as any).role !== "recruiter" && (session.user as any).role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { applicationId, scheduledAt, mode, link, notes } = body;

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const recruiterDoc = await Recruiter.findOne({ userId: (session.user as any).id });
    if (!recruiterDoc) {
      return NextResponse.json({ error: "Recruiter profile not found" }, { status: 404 });
    }
    const recruiterId = recruiterDoc._id;

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
