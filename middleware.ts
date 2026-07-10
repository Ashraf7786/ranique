import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ─── Always allow the admin and staff login pages through ─────────────────
  if (
    pathname === "/admin/login" || pathname.startsWith("/admin/login/") ||
    pathname === "/staff/login" || pathname.startsWith("/staff/login/")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "ranique_super_secret_fallback_key_2026_do_not_use_in_prod",
  });

  const role = (token as any)?.role;

  // ─── Block STAFF from accessing /admin at all ────────────────────────────
  // (Admin protection itself is handled by the server-side layout guard)
  if (pathname.startsWith("/admin")) {
    if (token && role === "STAFF") {
      return NextResponse.redirect(new URL("/staff", req.url));
    }
  }

  // ─── /staff/* — STAFF only ───────────────────────────────────────────────
  if (pathname.startsWith("/staff")) {
    if (!token) {
      return NextResponse.redirect(new URL("/staff/login", req.url));
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (role !== "STAFF") {
      return NextResponse.redirect(new URL("/staff/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};
