import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    await connectToDatabase();
    const body = await request.json();
    const company = await Company.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { $set: body },
      { new: true }
    );
    return NextResponse.json({ company });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}
