import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Subscription } from "@/models/Subscription";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { companyId, plan } = body;

    const subscription = await Subscription.findOneAndUpdate(
      { companyId },
      { companyId, plan, status: "active", renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { upsert: true, new: true }
    );

    return NextResponse.json({ subscription });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
