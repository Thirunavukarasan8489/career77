import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { CmsContent } from "@/models/CmsContent";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || "landing-hero";

    const item = await CmsContent.findOne({ key }).lean();
    return NextResponse.json(item || { key, content: {} });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CMS content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { key, content } = body;

    const cms = await CmsContent.findOneAndUpdate(
      { key },
      { key, content },
      { upsert: true, new: true }
    );

    return NextResponse.json({ cms });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update CMS content" }, { status: 500 });
  }
}
