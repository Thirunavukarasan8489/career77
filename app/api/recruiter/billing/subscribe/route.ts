import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Subscription } from "@/models/Subscription";
import { Recruiter } from "@/models/Recruiter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "recruiter" && role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { companyId, plan } = body;

    if (role === "recruiter") {
      const recruiterDoc = await Recruiter.findOne({ userId: (session.user as any).id });
      if (!recruiterDoc || recruiterDoc.companyId?.toString() !== companyId) {
        return NextResponse.json({ error: "Forbidden - company mismatch" }, { status: 403 });
      }
    }

    const subscription = await Subscription.findOneAndUpdate(
      { companyId },
      { companyId, plan, status: "active", renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { upsert: true, new: true }
    );

    return NextResponse.json({ subscription });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
