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
      where: { role: "STAFF" },
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

    // Enforce max 3 staff
    const staffCount = await prisma.user.count({ where: { role: "STAFF" } });
    if (staffCount >= 3) {
      return NextResponse.json(
        { error: "Maximum of 3 staff accounts allowed." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, password, firstName, lastName } = body;

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

    // Generate unique staff code STAFF-001, STAFF-002, etc.
    const allStaff = await prisma.staffProfile.findMany({
      orderBy: { createdAt: "asc" },
    });
    const nextNum = (allStaff.length + 1).toString().padStart(3, "0");
    const staffCode = `STAFF-${nextNum}`;

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName: lastName || null,
        role: "STAFF",
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
