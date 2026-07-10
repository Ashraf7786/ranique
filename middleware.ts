import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // All role-based route protection is handled by server-side layout guards:
  // app/admin/(dashboard)/layout.tsx
  // app/staff/(dashboard)/layout.tsx
  
  // This prevents Edge runtime vs Node runtime cookie/token mismatch bugs
  // that were causing infinite redirect loops.
  return NextResponse.next();
}

export const config = {
  // No matcher needed since it just passes through, but keeping it empty is fine
  matcher: [],
};

