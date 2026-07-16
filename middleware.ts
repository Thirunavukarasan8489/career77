import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Recruiter route guards
  // Protect all /recruiter paths except /recruiter/login
  if (pathname.startsWith("/recruiter") && pathname !== "/recruiter/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      const loginUrl = new URL("/recruiter/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Candidate route guards
  // Protect all /dashboard paths
  // We check only for the presence of the cookie to keep middleware 100% Edge-compatible
  if (pathname.startsWith("/dashboard")) {
    const candidateCookie = request.cookies.get("candidate_session")?.value;
    if (!candidateCookie) {
      const registerUrl = new URL("/register", request.url);
      return NextResponse.redirect(registerUrl);
    }
  }

  return NextResponse.next();
}

// Define matching paths to trigger middleware
export const config = {
  matcher: ["/dashboard/:path*", "/recruiter/:path*"],
};
