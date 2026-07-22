import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET /api/staff — List all staff (ADMIN only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const staff = await prisma.user.findMany({
      where: { role: { in: ["STAFF", "ADMIN"] } },
      include: {
        staffProfile: true,
        _count: { select: { listedProducts: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("[STAFF_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/staff — Create a staff account (ADMIN only, max 3)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Enforce limits if necessary (removed max 3 limit to allow multiple admins/staff)

    const body = await request.json();
    const { email, password, firstName, lastName, role = "STAFF" } = body;

    if (!["STAFF", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: "email, password and firstName are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 400 }
      );
    }

    // Generate unique code ADMIN-001, STAFF-001, etc.
    const sameRoleProfiles = await prisma.user.findMany({
      where: { role },
      include: { staffProfile: true }
    });
    const profileCount = sameRoleProfiles.filter(u => u.staffProfile).length;
    const nextNum = (profileCount + 1).toString().padStart(3, "0");
    const prefix = role === "ADMIN" ? "ADM" : "STAFF";
    const staffCode = `${prefix}-${nextNum}`;

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName: lastName || null,
        role,
        isEmailVerified: true,
        provider: "CREDENTIALS",
        staffProfile: {
          create: { staffCode },
        },
      },
      include: { staffProfile: true },
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        staffCode: user.staffProfile?.staffCode,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[STAFF_POST]", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
