import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { SupportTicket } from "@/models/SupportTicket";
import { Candidate } from "@/models/Candidate";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { cookies } from "next/headers";
import { verifyCandidateSession, getCandidateSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const tickets = await SupportTicket.find({})
      .populate("raisedBy", "email role")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { subject, message, category } = body;

    const session = await getServerSession(authOptions);
    const candSession = await getCandidateSession();

    let raisedBy = "";
    let userRole: "candidate" | "recruiter" = "candidate";

    if (session && session.user) {
      raisedBy = (session.user as any).id;
      userRole = (session.user as any).role === "recruiter" ? "recruiter" : "candidate";
    } else if (candSession) {
      const candDoc = await Candidate.findById(candSession.candidateId);
      if (candDoc && candDoc.userId) {
        raisedBy = candDoc.userId.toString();
      } else {
        return NextResponse.json({ error: "Candidate User profile not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await SupportTicket.create({
      raisedBy,
      userRole,
      subject,
      message,
      category,
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: "Failed to raise support ticket" }, { status: 500 });
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
    const { ticketId, status } = body;

    const ticket = await SupportTicket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
