import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import { Recruiter } from "@/models/Recruiter";
import { Interview } from "@/models/Interview";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "recruiter") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const recruiterDoc = await Recruiter.findOne({ userId: (session.user as any).id });
    if (!recruiterDoc) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }

    const recJobs = await Job.find({ recruiterId: recruiterDoc._id }).lean();
    const jobIds = recJobs.map((j) => j._id);

    const [
      activeJobs,
      totalApplications,
      interviewsScheduled,
    ] = await Promise.all([
      Job.countDocuments({ recruiterId: recruiterDoc._id, status: "open" }),
      Application.countDocuments({ jobId: { $in: jobIds } }),
      Interview.countDocuments({ recruiterId: recruiterDoc._id }),
    ]);

    return NextResponse.json({
      activeJobs,
      totalApplications,
      interviewsScheduled,
    });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
