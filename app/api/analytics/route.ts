import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import { Company } from "@/models/Company";
import { Candidate } from "@/models/Candidate";
import { Interview } from "@/models/Interview";
import { VerificationRequest } from "@/models/VerificationRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const [
      activeJobs,
      totalApplications,
      verifiedCompanies,
      totalUsers,
      interviewsScheduled,
      pendingVerifications,
    ] = await Promise.all([
      Job.countDocuments({ status: "open" }),
      Application.countDocuments({}),
      Company.countDocuments({ verified: true }),
      Candidate.countDocuments({}),
      Interview.countDocuments({}),
      VerificationRequest.countDocuments({ status: "pending" }),
    ]);

    return NextResponse.json({
      activeJobs,
      totalApplications,
      verifiedCompanies,
      totalUsers,
      interviewsScheduled,
      pendingVerifications,
      monthlyRevenue: 49999,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
