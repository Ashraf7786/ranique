import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ─── Always allow the admin login page through ───────────────────────────
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "ranique_super_secret_fallback_key_2026_do_not_use_in_prod",
  });

  const role = (token as any)?.role;

  // ─── /admin/* — ADMIN only ───────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!token) {
      // Redirect unauthenticated users to the ADMIN login page
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (role === "STAFF") {
      // Staff trying to enter admin → send to their own dashboard
      return NextResponse.redirect(new URL("/staff", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // ─── /staff/* — STAFF only ───────────────────────────────────────────────
  if (pathname.startsWith("/staff")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role === "ADMIN") {
      // Admin trying to enter staff portal → send to their dashboard
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (role !== "STAFF") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Protect /admin/* and /staff/* but NOT /admin/login
  matcher: ["/admin/:path*", "/staff/:path*"],
};
