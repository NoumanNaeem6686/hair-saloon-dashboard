import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If user is trying to access protected routes and is not logged in, redirect to login
  if (
    (pathname === "/" ||
      pathname === "/accounts" ||
      pathname === "/manage-time") &&
    !request.cookies.has("userAuth")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and tries to access login or register pages, redirect to home
  if (
    (pathname === "/login" || pathname === "/register") &&
    request.cookies.has("userAuth")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage-time", "/accounts", "/login", "/register", "/"],
};
