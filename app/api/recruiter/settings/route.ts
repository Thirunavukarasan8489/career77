import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Recruiter } from "@/models/Recruiter";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    
    // Check NextAuth session for recruiter role
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recruiterId = (session.user as any).id;
    const body = await request.json().catch(() => ({}));
    const { companyName, newPassword } = body;

    const updateData: any = {};
    if (companyName !== undefined) {
      updateData.companyName = companyName.trim();
    }
    
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update provided" }, { status: 400 });
    }

    const recruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      updateData,
      { new: true }
    );

    if (!recruiter) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      recruiter: {
        email: recruiter.email,
        companyName: recruiter.companyName,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
