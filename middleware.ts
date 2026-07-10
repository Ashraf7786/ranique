import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "ranique_super_secret_fallback_key_2026_do_not_use_in_prod",
  });

  const role = (token as any)?.role;
  const pathname = req.nextUrl.pathname;

  // ─── /admin/* — ADMIN only ───────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN") {
      // STAFF gets redirected to their own dashboard
      if (role === "STAFF") {
        return NextResponse.redirect(new URL("/staff", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ─── /staff/* — STAFF only ───────────────────────────────────────────────
  if (pathname.startsWith("/staff")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "STAFF") {
      // ADMIN trying to access staff dashboard → redirect to admin panel
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};
