import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialUpdateSchema, validationError, forbiddenError } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return forbiddenError();
    }

    const body = await request.json();
    const parsed = TestimonialUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const testimonial = await prisma.testimonial.update({
      where: {
        id,
      },
      data: parsed.data,
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("[TESTIMONIAL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return forbiddenError();
    }

    const testimonial = await prisma.testimonial.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("[TESTIMONIAL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
