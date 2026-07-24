import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    const recruiterData = await authService.registerRecruiter(body);

    return NextResponse.json({
      success: true,
      recruiter: recruiterData,
    });
  } catch (error: any) {
    if (error.message.includes("required") || error.message.includes("registered")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to register recruiter" },
      { status: 500 }
    );
  }
}
