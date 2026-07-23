import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const companies = await Company.find({})
      .sort({ name: 1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ companies });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}
