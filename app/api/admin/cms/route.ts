import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { CmsContent } from "@/models/CmsContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { key, content } = body;

    const cms = await CmsContent.findOneAndUpdate(
      { key },
      { key, content },
      { upsert: true, new: true }
    );

    return NextResponse.json({ cms });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update CMS content" }, { status: 500 });
  }
}
