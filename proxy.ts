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

  // Helper to create redirect response with cache control
  const createRedirectResponse = (url: string) => {
    const response = NextResponse.redirect(new URL(url, request.url));
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  };

  // 0. Redirect authenticated users away from auth pages
  if (token) {
    if (candidateAuthRoutes.includes(pathname) && token.role === "candidate") {
      return createRedirectResponse("/candidate");
    }
    if (recruiterAuthRoutes.includes(pathname) && token.role === "recruiter") {
      return createRedirectResponse("/recruiter");
    }
    if (adminAuthRoutes.includes(pathname) && token.role === "superadmin") {
      return createRedirectResponse("/admin");
    }
  }

  // 1. Candidate routes protection (/candidate/*)
  if (pathname.startsWith("/candidate")) {
    const candidateCookie = request.cookies.get("candidate_session")?.value;
    const isCandidateNextAuth = token && token.role === "candidate";

    if (!candidateCookie && !isCandidateNextAuth) {
      return createRedirectResponse("/login");
    }
  }

  // 2. Recruiter routes protection (/recruiter/*)
  if (pathname.startsWith("/recruiter") && !recruiterAuthRoutes.includes(pathname) && pathname !== "/recruiter/pending") {
    if (!token) {
      return createRedirectResponse("/recruiter/login");
    }
    // Cross-role guard: ensure token role is recruiter or superadmin
    if (token.role && token.role !== "recruiter" && token.role !== "superadmin") {
      return createRedirectResponse("/recruiter/login");
    }
    // Verification check
    if (token.role === "recruiter" && !token.companyVerified) {
      return createRedirectResponse("/recruiter/pending");
    }
  }

  // 3. Super Admin routes protection (/admin/*)
  if (pathname.startsWith("/admin") && !adminAuthRoutes.includes(pathname)) {
    if (!token) {
      return createRedirectResponse("/admin/login");
    }
    if (token.role !== "superadmin") {
      return createRedirectResponse("/admin/login");
    }
  }

  const response = NextResponse.next();
  // If navigating any protected portal, disable page caching
  if (pathname.startsWith("/candidate") || pathname.startsWith("/recruiter") || pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  }

  return response;
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
