import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { VerificationRequest } from "@/models/VerificationRequest";
import { Company } from "@/models/Company";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { documentUrl } = body;

    let company = await Company.findOne({});
    if (!company) {
      company = await Company.create({
        name: "Default Recruiter Corp",
        slug: "default-recruiter-corp",
      });
    }

    const verificationReq = await VerificationRequest.create({
      companyId: company._id,
      documentUrl,
    });

    return NextResponse.json({ verificationReq });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to submit verification document" }, { status: 500 });
  }
}
