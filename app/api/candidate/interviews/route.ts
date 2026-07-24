import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Interview } from "@/models/Interview";
import { getCandidateSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const candSession = await getCandidateSession();

    if (!candSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interviews = await Interview.find({ candidateId: candSession.candidateId })
      .populate("jobId", "title location")
      .sort({ scheduledAt: -1 })
      .lean();
      
    return NextResponse.json({ interviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}
