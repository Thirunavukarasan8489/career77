import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";

export async function GET() {
  try {
    await connectToDatabase();

    const recSession = await getServerSession(authOptions);
    if (!recSession || !recSession.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recruiterId = (recSession.user as any).id;
    const recJobs = await Job.find({ recruiterId }).lean();
    const jobIds = recJobs.map((j) => j._id);

    const apps = await Application.find({ jobId: { $in: jobIds } })
      .populate("candidateId")
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
