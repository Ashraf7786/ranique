import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = (token as any)?.role;
    const pathname = req.nextUrl.pathname;

    // ─── /admin/* — ADMIN only ───────────────────────────────────────────────
    if (pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        // STAFF gets redirected to their own dashboard
        if (role === "STAFF") {
          return NextResponse.redirect(new URL("/staff", req.url));
        }
        // Everyone else → login
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // ─── /staff/* — STAFF only ───────────────────────────────────────────────
    if (pathname.startsWith("/staff")) {
      if (role !== "STAFF") {
        // ADMIN trying to access staff dashboard → redirect to their admin panel
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
        // Everyone else → login
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This ensures withAuth only runs when a token is required
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};
