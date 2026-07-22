import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 1. Candidate routes protection (/candidate/* or legacy /dashboard/*)
  if (pathname.startsWith("/candidate") || pathname.startsWith("/dashboard")) {
    const candidateCookie = request.cookies.get("candidate_session")?.value;
    const isCandidateNextAuth = token && token.role === "candidate";

    if (!candidateCookie && !isCandidateNextAuth) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Recruiter routes protection (/recruiter/*)
  if (
    pathname.startsWith("/recruiter") &&
    pathname !== "/recruiter/login" &&
    pathname !== "/recruiter/register" &&
    pathname !== "/recruiter/pending"
  ) {
    if (!token) {
      const loginUrl = new URL("/recruiter/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Cross-role guard: ensure token role is recruiter or superadmin
    if (token.role && token.role !== "recruiter" && token.role !== "superadmin") {
      const loginUrl = new URL("/recruiter/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Verification check
    if (token.role === "recruiter" && !token.companyVerified) {
      const pendingUrl = new URL("/recruiter/pending", request.url);
      return NextResponse.redirect(pendingUrl);
    }
  }

  // 3. Super Admin routes protection (/admin/*)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (token.role !== "superadmin") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/candidate/:path*", "/dashboard/:path*", "/recruiter/:path*", "/admin/:path*"],
};
