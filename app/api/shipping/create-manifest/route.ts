import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// ── Request body schema ────────────────────────────────────────────────────
const ManifestRequestSchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
});

// ── Delhivery CMU response shape (partial) ─────────────────────────────────
interface DelhiveryCMUResponse {
  packages?: Array<{
    waybill?: string;
    status?: string;
    remarks?: string | string[];
  }>;
  upload_wbn?: string;
  success?: boolean;
  cod?: string;
  error?: string | null;
}

// ── Default weight per item in grams (used when product has no weight field) ─
// Conservative fallback of 500g covers most cosmetics + packaging weight.
const DEFAULT_ITEM_WEIGHT_GRAMS = 500;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // ── Auth guard: ADMIN only ─────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Validate request body ─────────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const parsed = ManifestRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const { orderId } = parsed.data;

    // ── Fetch order with all required relations ────────────────────────────
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: `Order not found: ${orderId}` }, { status: 404 });
    }

    // Guard: don't re-manifest an order that already has an AWB
    if (order.deliveryAwb) {
      return NextResponse.json(
        { error: `Order ${orderId} already has a Delhivery AWB: ${order.deliveryAwb}` },
        { status: 409 }
      );
    }

    // ── Validate that required shipping fields are present ────────────────
    const {
      shippingName,
      shippingPhone,
      shippingEmail,
      shippingLine1,
      shippingLine2,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      totalAmount,
      paymentMethod,
      pickupLocation,
    } = order;

    if (!shippingName || !shippingPhone || !shippingLine1 || !shippingCity || !shippingState || !shippingZip) {
      return NextResponse.json(
        { error: 'Order is missing required shipping address fields. Cannot create manifest.' },
        { status: 422 }
      );
    }

    // ── Environment checks ────────────────────────────────────────────────
    const token = process.env.DELHIVERY_API_TOKEN;
    const baseUrl = process.env.DELHIVERY_BASE_URL ?? 'https://track.delhivery.com';
    if (!token) {
      return NextResponse.json(
        { error: 'DELHIVERY_API_TOKEN is not configured on the server.' },
        { status: 503 }
      );
    }

    // ── Calculate total shipment weight ───────────────────────────────────
    // Product model has no weight field yet — use a safe per-item default.
    const totalWeightKg =
      order.items.reduce((sum, item) => sum + DEFAULT_ITEM_WEIGHT_GRAMS * item.quantity, 0) / 1000;

    // Delhivery requires weight in kg, minimum 0.1
    const shipmentWeight = Math.max(totalWeightKg, 0.1);

    // ── Determine payment type for Delhivery ──────────────────────────────
    // Delhivery: 'COD' for Cash on Delivery, 'Prepaid' for all online payments
    const delhiveryPaymentType = paymentMethod === 'COD' ? 'COD' : 'Prepaid';
    const codAmount = paymentMethod === 'COD' ? Math.round(totalAmount) : 0;

    // ── Build the CMU data payload ────────────────────────────────────────
    // Delhivery CMU format: data=<URL-encoded JSON>
    // Ref: https://developers.delhivery.com/#tag/Shipment/operation/createShipment
    const cmuData = {
      shipments: [
        {
          name: shippingName.trim(),
          add: [shippingLine1.trim(), shippingLine2?.trim() ?? ''].filter(Boolean).join(', '),
          city: shippingCity.trim(),
          state: shippingState.trim(),
          pin: shippingZip.trim(),
          country: (shippingCountry ?? 'India').trim(),
          phone: shippingPhone.trim().replace(/\D/g, '').slice(-10), // ensure 10-digit
          order: order.id,
          payment_mode: delhiveryPaymentType,
          return_pin: shippingZip.trim(),
          return_city: shippingCity.trim(),
          return_phone: shippingPhone.trim().replace(/\D/g, '').slice(-10),
          return_add: shippingLine1.trim(),
          return_name: 'Ranique Store',
          return_state: shippingState.trim(),
          return_country: 'India',
          products_desc: order.items.map((i) => i.product.title).join(', '),
          hsn_code: order.items[0]?.product.hsnCode ?? '',
          cod_amount: codAmount,
          order_date: order.createdAt.toISOString(),
          total_amount: Math.round(totalAmount),
          seller_add: 'Ranique Store, India',
          seller_name: 'Ranique',
          seller_inv: order.id.slice(-8).toUpperCase(),
          quantity: order.items.reduce((sum, i) => sum + i.quantity, 0),
          waybill: '',        // Leave empty — Delhivery auto-assigns AWB
          shipment_width: 15, // cm
          shipment_height: 10, // cm
          weight: shipmentWeight,
          seller_gst_tin: process.env.DELHIVERY_GST ?? '',
          shipping_mode: 'Surface',
          pickup_location: pickupLocation ?? 'Primary_Warehouse',
        },
      ],
    };

    const formBody = new URLSearchParams();
    formBody.set('format', 'json');
    formBody.set('data', JSON.stringify(cmuData));

    // ── POST to Delhivery CMU endpoint ────────────────────────────────────
    let delhiveryResponse: Response;
    try {
      delhiveryResponse = await fetch(`${baseUrl}/api/cmu/create.json`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formBody.toString(),
        signal: AbortSignal.timeout(15000),
      });
    } catch (fetchError: any) {
      console.error('[create-manifest] Network error calling Delhivery CMU:', fetchError.message);
      return NextResponse.json(
        { error: 'Could not reach Delhivery API. Please try again.' },
        { status: 502 }
      );
    }

    if (!delhiveryResponse.ok) {
      const errorText = await delhiveryResponse.text().catch(() => '');
      console.error('[create-manifest] Delhivery CMU non-OK:', delhiveryResponse.status, errorText);
      return NextResponse.json(
        { error: `Delhivery API error: ${delhiveryResponse.status}`, raw: errorText },
        { status: 502 }
      );
    }

    let rawResult: DelhiveryCMUResponse;
    try {
      rawResult = (await delhiveryResponse.json()) as DelhiveryCMUResponse;
    } catch {
      return NextResponse.json(
        { error: 'Received malformed JSON from Delhivery CMU API.' },
        { status: 502 }
      );
    }

    // ── Extract AWB from response ─────────────────────────────────────────
    const pkg = rawResult?.packages?.[0];
    const awb = pkg?.waybill?.trim() ?? '';

    if (!awb) {
      const remarks = Array.isArray(pkg?.remarks) ? pkg.remarks.join('; ') : (pkg?.remarks ?? '');
      console.error('[create-manifest] No AWB returned. Remarks:', remarks, 'Full response:', rawResult);
      return NextResponse.json(
        {
          error: 'Delhivery did not return a valid AWB number.',
          remarks,
          raw: rawResult,
        },
        { status: 502 }
      );
    }

    // ── Update Prisma order with AWB and new status ───────────────────────
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryAwb: awb,
        deliveryStatus: 'MANIFESTED',
        trackingNumber: awb, // mirrors AWB into existing trackingNumber field
      },
    });

    console.info(`[create-manifest] Order ${orderId} manifested. AWB: ${awb}`);

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      awb,
      deliveryStatus: updatedOrder.deliveryStatus,
      trackingNumber: updatedOrder.trackingNumber,
    });
  } catch (error: any) {
    console.error('[create-manifest] Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error during manifest creation.' },
      { status: 500 }
    );
  }
}
