import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// PATCH /api/product-requests/[id] — Approve or Reject (ADMIN only)
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
    const { action, adminNote } = body; // action: "APPROVED" | "REJECTED"

    if (!["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const editRequest = await prisma.productEditRequest.findUnique({
      where: { id },
    });

    if (!editRequest || editRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request not found or already processed" },
        { status: 404 }
      );
    }

    // If approved, apply the requested changes to the live product
    if (action === "APPROVED") {
      const { images, ...productData } = editRequest.requestedData as any;

      await prisma.product.update({
        where: { id: editRequest.productId },
        data: productData,
      });
    }

    // Update the request status
    const updated = await prisma.productEditRequest.update({
      where: { id },
      data: { status: action, adminNote: adminNote || null },
    });

    revalidatePath("/", "layout");
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PRODUCT_REQUEST_PATCH]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET /api/product-requests/[id] — Get a single request with diff details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const editRequest = await prisma.productEditRequest.findUnique({
      where: { id },
      include: {
        product: { include: { images: true } },
        staff: { include: { staffProfile: true } },
      },
    });

    if (!editRequest) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(editRequest);
  } catch (error) {
    console.error("[PRODUCT_REQUEST_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
