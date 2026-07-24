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
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch CMS content" }, { status: 500 });
  }
}
