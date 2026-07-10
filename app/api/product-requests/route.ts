import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/product-requests — List edit requests (ADMIN only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const requests = await prisma.productEditRequest.findMany({
      where: { status },
      include: {
        product: {
          include: { images: { where: { isCover: true }, take: 1 } },
        },
        staff: {
          include: { staffProfile: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("[PRODUCT_REQUESTS_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
