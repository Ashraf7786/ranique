import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// ── Request body schema ────────────────────────────────────────────────────
const LabelRequestSchema = z.object({
  awb: z
    .string()
    .min(8, 'AWB must be at least 8 characters')
    .regex(/^[A-Za-z0-9-]+$/, 'AWB must contain only alphanumeric characters and hyphens'),
});

// ── Typed shape of what we return on success ───────────────────────────────
interface LabelFetchResult {
  success: true;
  awb: string;
  orderId: string | null;
  contentType: string;
  sizeBytes: number;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // ── Auth guard: ADMIN only ─────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Parse and validate body ───────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const parsed = LabelRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const { awb } = parsed.data;

    // ── Environment checks ────────────────────────────────────────────────
    const token = process.env.DELHIVERY_API_TOKEN;
    const baseUrl = process.env.DELHIVERY_BASE_URL ?? 'https://track.delhivery.com';
    if (!token) {
      return NextResponse.json(
        { error: 'DELHIVERY_API_TOKEN is not configured on the server.' },
        { status: 503 }
      );
    }

    // ── Resolve which order this AWB belongs to (optional enrichment) ─────
    let linkedOrderId: string | null = null;
    try {
      const linkedOrder = await prisma.order.findUnique({
        where: { deliveryAwb: awb },
        select: { id: true },
      });
      linkedOrderId = linkedOrder?.id ?? null;
    } catch (dbError: any) {
      // Non-fatal — we still serve the label even if DB lookup fails
      console.warn('[label] Could not resolve order for AWB', awb, dbError?.message);
    }

    // ── Fetch the raw label PDF from Delhivery ────────────────────────────
    // Endpoint: GET /api/v1/packages/label/?wbns={awb}&token={token}
    // Delhivery returns the PDF as a binary octet-stream response.
    const labelUrl = `${baseUrl}/api/v1/packages/label/?wbns=${encodeURIComponent(awb)}&token=${token}`;

    let delhiveryResponse: Response;
    try {
      delhiveryResponse = await fetch(labelUrl, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          Accept: 'application/pdf, application/octet-stream',
        },
        signal: AbortSignal.timeout(20000), // 20s — label PDFs can be slower
      });
    } catch (fetchError: any) {
      console.error('[label] Network error fetching Delhivery label for AWB', awb, fetchError.message);
      return NextResponse.json(
        { error: `Could not reach Delhivery API: ${fetchError.message}` },
        { status: 502 }
      );
    }

    if (!delhiveryResponse.ok) {
      const errorText = await delhiveryResponse.text().catch(() => '');
      console.error('[label] Delhivery label fetch non-OK:', delhiveryResponse.status, errorText);
      return NextResponse.json(
        {
          error: `Delhivery returned HTTP ${delhiveryResponse.status} while fetching label.`,
          awb,
          hint: delhiveryResponse.status === 404
            ? 'The AWB does not exist or the shipment has not been manifested yet.'
            : 'Check your DELHIVERY_API_TOKEN and that the AWB is valid.',
        },
        { status: 502 }
      );
    }

    // ── Read response as binary buffer ────────────────────────────────────
    let pdfBuffer: ArrayBuffer;
    try {
      pdfBuffer = await delhiveryResponse.arrayBuffer();
    } catch (readError: any) {
      console.error('[label] Failed to read label response body for AWB', awb, readError.message);
      return NextResponse.json(
        { error: 'Failed to read label PDF from Delhivery response stream.' },
        { status: 502 }
      );
    }

    if (pdfBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Delhivery returned an empty label PDF body.', awb },
        { status: 502 }
      );
    }

    // Validate the response is actually a PDF (magic bytes: %PDF)
    const headerBytes = new Uint8Array(pdfBuffer.slice(0, 4));
    const isPdf =
      headerBytes[0] === 0x25 && // %
      headerBytes[1] === 0x50 && // P
      headerBytes[2] === 0x44 && // D
      headerBytes[3] === 0x46;   // F

    if (!isPdf) {
      console.error(
        '[label] Delhivery response is not a PDF for AWB',
        awb,
        'First 8 bytes:',
        Buffer.from(pdfBuffer.slice(0, 8)).toString('hex')
      );
      return NextResponse.json(
        {
          error: 'Delhivery did not return a valid PDF. The AWB may be invalid or not yet manifested.',
          awb,
        },
        { status: 502 }
      );
    }

    // ── Update deliveryLabelUrl on the linked order (if found) ─────────────
    // We store the Delhivery label endpoint URL so admins can re-fetch at any time.
    if (linkedOrderId) {
      try {
        await prisma.order.update({
          where: { id: linkedOrderId },
          data: {
            deliveryLabelUrl: labelUrl,
          },
        });
      } catch (updateError: any) {
        // Non-fatal — label still returned even if DB update fails
        console.warn('[label] Could not update deliveryLabelUrl on order', linkedOrderId, updateError?.message);
      }
    }

    console.info(
      `[label] Serving label PDF for AWB ${awb} (${pdfBuffer.byteLength} bytes), linked order: ${linkedOrderId ?? 'none'}`
    );

    // ── Stream the PDF back to the caller ─────────────────────────────────
    // The consumer (browser or admin UI) can either display inline or trigger download.
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdfBuffer.byteLength),
        // Content-Disposition: 'inline' lets browser render it in a PDF viewer.
        // Change to 'attachment' if you want forced download.
        'Content-Disposition': `inline; filename="delhivery_label_${awb}.pdf"`,
        // Prevent caching of sensitive shipping labels
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('[label] Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error while fetching shipping label.' },
      { status: 500 }
    );
  }
}

// ── GET: Quick status check — returns label metadata without streaming PDF ─
// Useful for admin UI to verify an AWB has a label before triggering download.
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const rawAwb = searchParams.get('awb');

    const parsed = LabelRequestSchema.safeParse({ awb: rawAwb });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid AWB parameter.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { awb } = parsed.data;

    const token = process.env.DELHIVERY_API_TOKEN;
    const baseUrl = process.env.DELHIVERY_BASE_URL ?? 'https://track.delhivery.com';
    if (!token) {
      return NextResponse.json({ error: 'DELHIVERY_API_TOKEN is not configured.' }, { status: 503 });
    }

    // Resolve linked order
    const linkedOrder = await prisma.order.findUnique({
      where: { deliveryAwb: awb },
      select: { id: true, deliveryStatus: true, deliveryLabelUrl: true },
    });

    // HEAD request to Delhivery to verify the label exists without downloading it
    const labelUrl = `${baseUrl}/api/v1/packages/label/?wbns=${encodeURIComponent(awb)}&token=${token}`;
    let labelAvailable = false;
    let contentLength = 0;

    try {
      const headResponse = await fetch(labelUrl, {
        method: 'HEAD',
        headers: { Authorization: `Token ${token}` },
        signal: AbortSignal.timeout(8000),
      });
      labelAvailable = headResponse.ok;
      contentLength = parseInt(headResponse.headers.get('content-length') ?? '0', 10);
    } catch {
      // Non-fatal — just report as unavailable
    }

    return NextResponse.json({
      awb,
      labelAvailable,
      contentLength,
      orderId: linkedOrder?.id ?? null,
      deliveryStatus: linkedOrder?.deliveryStatus ?? null,
      deliveryLabelUrl: linkedOrder?.deliveryLabelUrl ?? null,
    });
  } catch (error: any) {
    console.error('[label] GET unexpected error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error during label status check.' },
      { status: 500 }
    );
  }
}
