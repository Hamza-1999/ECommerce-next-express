import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if user is logged in by looking for auth cookies
  const hasAuthCookie = req.cookies.has("Ecommerce");
  const userRole = req.cookies.get("role")?.value || "guest";

  if (hasAuthCookie && pathname.startsWith("/user/register")) {
    return NextResponse.redirect(new URL("/user/account", req.url));
  }

  if (hasAuthCookie && pathname.startsWith("/user/login")) {
    return NextResponse.redirect(new URL("/user/account", req.url));
  }

  if (!hasAuthCookie && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // If user is not logged in and trying to access protected pages
  // if (!hasAuthCookie && pathname.startsWith("/user/account") && pathname !== "/admin/login") {
  //   return NextResponse.redirect(new URL("/user/login", req.url));
  // }

  // If user is not admin but trying to access /admin pages
  if (hasAuthCookie && pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is admin but tries to access non-admin page and you want to redirect them to admin dashboard
  // if (!pathname.startsWith("/admin") && userRole === "admin") {
  //   return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  // }

  console.log(`[MIDDLEWARE] Request allowed: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
