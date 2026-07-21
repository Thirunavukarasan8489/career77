import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Candidate } from "@/models/Candidate";
import { signCandidateSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { action, email, otp, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    if (action === "send") {
      const generatedOtp = "777777"; // Standard verification OTP code
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      await User.findOneAndUpdate(
        { email: emailLower },
        {
          email: emailLower,
          role: "candidate",
          otp: generatedOtp,
          otpExpiresAt,
        },
        { upsert: true, new: true }
      );

      let candidateDoc = await Candidate.findOne({ email: emailLower });
      if (!candidateDoc) {
        candidateDoc = await Candidate.create({
          email: emailLower,
          name: name || emailLower.split("@")[0],
          lookingFor: "Software Engineer",
          skills: ["React", "JavaScript"],
        });
      }

      return NextResponse.json({
        success: true,
        message: `OTP verification code sent to ${emailLower} (Use OTP: 777777)`,
      });
    }

    if (action === "verify") {
      const user = await User.findOne({ email: emailLower });

      // Accept valid stored OTP or universal test OTP 777777
      if (!user || (user.otp !== otp && otp !== "777777")) {
        return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
      }

      let candidateDoc = await Candidate.findOne({ email: emailLower });
      if (!candidateDoc) {
        candidateDoc = await Candidate.create({
          userId: user._id,
          email: emailLower,
          name: name || emailLower.split("@")[0],
          lookingFor: "Software Engineer",
          skills: ["React", "JavaScript"],
        });
      } else if (!candidateDoc.userId) {
        candidateDoc.userId = user._id;
        await candidateDoc.save();
      }

      const sessionToken = signCandidateSession({
        candidateId: candidateDoc._id.toString(),
        email: candidateDoc.email,
        name: candidateDoc.name,
        role: "candidate",
      });

      const response = NextResponse.json({
        success: true,
        candidate: candidateDoc,
        sessionToken,
      });

      response.cookies.set("candidate_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed OTP action" }, { status: 500 });
  }
}
