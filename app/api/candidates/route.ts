import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Candidate } from "@/models/Candidate";
import { signCandidateSession, verifyCandidateSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const {
      name,
      mobile,
      email,
      experience,
      city,
      skills,
      lookingFor,
      resumeUrl,
      resumePublicId,
    } = body;

    if (!name || (!email && !mobile)) {
      return NextResponse.json(
        { error: "Missing required fields (name and email)" },
        { status: 400 }
      );
    }

    const emailLower = (email || `${mobile}@candidate.local`).toLowerCase().trim();

    // Check duplicate
    const existing = await Candidate.findOne({ email: emailLower });
    if (existing) {
      return NextResponse.json(
        { error: "This email address is already registered" },
        { status: 409 }
      );
    }

    let skillsArray: string[] = [];
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === "string") {
      skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const candidate = await Candidate.create({
      name,
      email: emailLower,
      mobile,
      experience,
      city,
      skills: skillsArray,
      lookingFor: lookingFor || "Software Developer",
      resumeUrl,
      resumePublicId,
    });

    const sessionPayload = {
      candidateId: candidate._id.toString(),
      email: candidate.email,
      name: candidate.name,
      role: "candidate",
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

export async function GET() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("candidate_session")?.value;
    const session = token ? verifyCandidateSession(token) : null;

    if (session) {
      const candidate = await Candidate.findById(session.candidateId);
      if (!candidate) {
        return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
      }
      return NextResponse.json({ candidate });
    }

    const nextAuthSession = await getServerSession(authOptions);
    if (nextAuthSession && nextAuthSession.user?.email) {
      const candidate = await Candidate.findOne({ email: nextAuthSession.user.email.toLowerCase() });
      return NextResponse.json({ candidate });
    }

    const candidates = await Candidate.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ candidates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("candidate_session")?.value;
    const session = token ? verifyCandidateSession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const candidate = await Candidate.findByIdAndUpdate(
      session.candidateId,
      { $set: body },
      { new: true }
    );

    return NextResponse.json({ candidate });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
