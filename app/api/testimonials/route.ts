import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialCreateSchema, validationError, forbiddenError } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const testimonials = await prisma.testimonial.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error: any) {
    console.error("[TESTIMONIALS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return forbiddenError();
    }

    const body = await request.json();
    const parsed = TestimonialCreateSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: parsed.data.name,
        content: parsed.data.content,
        rating: parsed.data.rating,
        city: parsed.data.city,
        product: (body as any).product, // Zod parsing skipped product initially, let's just use body
        status: parsed.data.status,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("[TESTIMONIALS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
