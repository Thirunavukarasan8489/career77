import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { SupportTicket } from "@/models/SupportTicket";

export async function GET() {
  try {
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
    const { raisedBy, userRole, subject, message, category } = body;

    const ticket = await SupportTicket.create({
      raisedBy,
      userRole: userRole || "candidate",
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
