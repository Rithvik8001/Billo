import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be protected here
const protectedPaths = ["/dashboard"];
// Add paths that should only be accessible to non-authenticated users
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const authSession = request.cookies.get("__session");

  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if the path should be protected
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!authSession) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      return response;
    }
  }

  // Check if the path is for non-authenticated users only
  if (authPaths.includes(pathname)) {
    if (authSession) {
      const response = NextResponse.redirect(new URL("/dashboard", request.url));
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedPaths, ...authPaths],
};
