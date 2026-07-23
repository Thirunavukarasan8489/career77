import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[Billing Webhook Event]", body.event);
    return NextResponse.json({ received: true });
  } catch (_error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
