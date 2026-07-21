import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Interview } from "@/models/Interview";
import { Application } from "@/models/Application";

export async function GET() {
  try {
    await connectToDatabase();
    const interviews = await Interview.find({})
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
    await connectToDatabase();
    const body = await request.json();
    const { applicationId, scheduledAt, mode, link, notes } = body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const interview = await Interview.create({
      applicationId,
      candidateId: application.candidateId,
      recruiterId: application.candidateId,
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
