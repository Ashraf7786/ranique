import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// DELETE /api/staff/[id] — Remove a staff account (ADMIN only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const staff = await prisma.user.findUnique({ where: { id } });
    if (!staff || !["STAFF", "ADMIN"].includes(staff.role)) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (staff.id === (session.user as any).id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[STAFF_DELETE]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/staff/[id] — Toggle staff active status (ADMIN only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { isActive } = body;

    const profile = await prisma.staffProfile.update({
      where: { userId: id },
      data: { isActive },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[STAFF_PATCH]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
