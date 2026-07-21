import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PipelineStage } from "@/models/PipelineStage";

export async function GET() {
  try {
    await connectToDatabase();
    const stages = await PipelineStage.find({}).sort({ order: 1 }).lean();
    return NextResponse.json({ stages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pipeline stages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const stage = await PipelineStage.create(body);
    return NextResponse.json({ stage });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create pipeline stage" }, { status: 500 });
  }
}
