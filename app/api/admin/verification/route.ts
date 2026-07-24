import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { VerificationRequest } from "@/models/VerificationRequest";
import { Company } from "@/models/Company";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const requests = await VerificationRequest.find({})
      .populate("companyId", "name slug verified")
      .sort({ submittedAt: -1 })
      .lean();
    return NextResponse.json({ requests });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch verification requests" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { requestId, status } = body;

    const reqDoc = await VerificationRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (reqDoc && status === "approved") {
      await Company.findByIdAndUpdate(reqDoc.companyId, { verified: true });
    }

    return NextResponse.json({ reqDoc });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update verification request" }, { status: 500 });
  }
}
