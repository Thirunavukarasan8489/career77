import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear candidate custom session cookie
  response.cookies.set("candidate_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  // Clear NextAuth session cookies if present
  response.cookies.set("next-auth.session-token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set("__Secure-next-auth.session-token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
