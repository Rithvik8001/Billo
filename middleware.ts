import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be protected here
const protectedPaths = ["/dashboard"];
// Add paths that should only be accessible to non-authenticated users
const authPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if the path should be protected
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get("auth-token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check if the path is for non-authenticated users only
  if (authPaths.includes(pathname)) {
    const token = request.cookies.get("auth-token");
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedPaths, ...authPaths],
};
