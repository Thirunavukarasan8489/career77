import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Candidate } from "@/models/Candidate";
import { signCandidateSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { mobile, otp } = body;

    if (!mobile) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    const candidate = await Candidate.findOne({ mobile });
    if (!candidate) {
      return NextResponse.json(
        { error: "No candidate found with this mobile number. Please register first.", notFound: true },
        { status: 404 }
      );
    }

    // Phase 1: Request OTP
    if (otp === undefined) {
      // Mock sending OTP
      console.log(`[OTP Mock] Sent verification code to ${mobile}: 7777`);
      return NextResponse.json({ success: true, otpSent: true });
    }

    // Phase 2: Verify OTP
    if (otp !== "7777") {
      return NextResponse.json({ error: "Invalid OTP. Use 7777 for demo access." }, { status: 400 });
    }

    // Login candidate and create session
    const sessionPayload = {
      candidateId: candidate._id.toString(),
      mobile: candidate.mobile,
      name: candidate.name,
    };
    const sessionToken = signCandidateSession(sessionPayload);

    const response = NextResponse.json({ success: true, candidate });
    const cookieStore = await cookies();
    cookieStore.set("candidate_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
