import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Recruiter } from "@/models/Recruiter";
import bcrypt from "bcryptjs";

import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { email, password, companyName } = body;

    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: "Email, password, and company name are required fields" },
        { status: 400 }
      );
    }

    const existingRecruiter = await Recruiter.findOne({ email: email.toLowerCase().trim() });
    if (existingRecruiter) {
      return NextResponse.json(
        { error: "A recruiter with this email is already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // 1. Create master User account
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "recruiter",
    });

    // 2. Create Recruiter profile linked to User
    const recruiter = await Recruiter.create({
      userId: user._id,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      companyName: companyName.trim(),
    });

    return NextResponse.json({
      success: true,
      recruiter: {
        id: recruiter._id.toString(),
        email: recruiter.email,
        companyName: recruiter.companyName,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to register recruiter" },
      { status: 500 }
    );
  }
}
