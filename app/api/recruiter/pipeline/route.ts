import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PipelineStage } from "@/models/PipelineStage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || ((session.user as any).role !== "recruiter" && (session.user as any).role !== "superadmin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const stages = await PipelineStage.find({}).sort({ order: 1 }).lean();
    return NextResponse.json({ stages });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch pipeline stages" }, { status: 500 });
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
    const stage = await PipelineStage.create(body);
    return NextResponse.json({ stage });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create pipeline stage" }, { status: 500 });
  }
}
