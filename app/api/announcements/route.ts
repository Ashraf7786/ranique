import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    const announcement = await prisma.announcement.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcement || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { text, isActive } = data;

    // We can either update the existing one or create a new one. 
    // Usually, just upserting or replacing the first one is easiest for a single setting.
    const existing = await prisma.announcement.findFirst();

    let announcement;
    if (existing) {
      announcement = await prisma.announcement.update({
        where: { id: existing.id },
        data: { text, isActive },
      });
    } else {
      announcement = await prisma.announcement.create({
        data: { text, isActive },
      });
    }

    // Invalidate frontend cache
    revalidateTag("announcement");

    return NextResponse.json(announcement);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
