import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { RazorpayCreateOrderSchema, validationError } from "@/lib/validation";
import { paymentRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Rate limit: 10 payment attempts per minute per IP
    const limit = paymentRateLimit(req);
    if (!limit.success) {
      return NextResponse.json({ success: false, message: limit.error }, { status: 429 });
    }

    const body = await req.json();

    // Zod validation
    const parsed = RazorpayCreateOrderSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { amount } = parsed.data;

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create an order in Razorpay
    const options = {
      amount: Math.round(amount * 100), // Razorpay requires amount in subunits (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
