import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Notification } from "@/models/Notification";
import { verifyCandidateSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("candidate_session")?.value;
    const session = token ? verifyCandidateSession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await Notification.find({ candidateId: session.candidateId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ notifications });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("candidate_session")?.value;
    const session = token ? verifyCandidateSession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark all notifications as read for this candidate
    await Notification.updateMany(
      { candidateId: session.candidateId, read: false },
      { read: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update notifications" },
      { status: 500 }
    );
  }
}
