import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect legacy /dashboard to /candidate
  if (pathname.startsWith("/dashboard")) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = pathname.replace(/^\/dashboard/, "/candidate");
    return NextResponse.redirect(newUrl);
  }

  // Define auth routes for each role
  const candidateAuthRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
  const recruiterAuthRoutes = ["/recruiter/login", "/recruiter/register", "/recruiter/forgot-password", "/recruiter/reset-password", "/recruiter/request-access"];
  const adminAuthRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

  // 0. Redirect authenticated users away from auth pages
  if (token) {
    if (candidateAuthRoutes.includes(pathname) && token.role === "candidate") {
      return NextResponse.redirect(new URL("/candidate", request.url));
    }
    if (recruiterAuthRoutes.includes(pathname) && token.role === "recruiter") {
      return NextResponse.redirect(new URL("/recruiter", request.url));
    }
    if (adminAuthRoutes.includes(pathname) && token.role === "superadmin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 1. Candidate routes protection (/candidate/*)
  if (pathname.startsWith("/candidate")) {
    const candidateCookie = request.cookies.get("candidate_session")?.value;
    const isCandidateNextAuth = token && token.role === "candidate";

    if (!candidateCookie && !isCandidateNextAuth) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Recruiter routes protection (/recruiter/*)
  if (pathname.startsWith("/recruiter") && !recruiterAuthRoutes.includes(pathname) && pathname !== "/recruiter/pending") {
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
  if (pathname.startsWith("/admin") && !adminAuthRoutes.includes(pathname)) {
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
  matcher: [
    "/candidate/:path*", 
    "/dashboard/:path*", 
    "/recruiter/:path*", 
    "/admin/:path*",
    "/login", 
    "/register", 
    "/forgot-password", 
    "/reset-password", 
    "/verify-email"
  ],
};
