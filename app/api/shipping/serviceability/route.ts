import { NextResponse } from 'next/server';
import { z } from 'zod';

// ── Zod schema for query parameter validation ──────────────────────────────
const PincodeSchema = z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits');

// ── Raw postal_code block returned inside each delivery_codes entry ────────
interface DelhiveryPostalCode {
  pin?: string;
  inc_cod?: string;      // 'Y' | 'N'
  district_name?: string;
  state_code?: string;
  remark?: string;       // e.g. 'Embargo' when area is under delivery restriction
  pre_paid?: string;
  cash?: string;
  pickup?: string;
  repl?: string;
  cod?: string;
  surface?: string;
  air?: string;
}

// ── Shape of the data we return to the UI ──────────────────────────────────
interface DelhiveryServiceabilityResult {
  serviceable: boolean;
  codAvailable: boolean;
  state: string;
  district: string;
  remark: string | null; // Populated when Delhivery flags the area (e.g. 'Embargo')
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const rawPincode = searchParams.get('pincode');

    // Validate input
    const parsed = PincodeSchema.safeParse(rawPincode);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid pincode. Must be exactly 6 digits.', details: parsed.error.flatten().formErrors },
        { status: 400 }
      );
    }
    const pincode = parsed.data;

    const token = process.env.DELHIVERY_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'Delhivery API token is not configured on the server.' },
        { status: 503 }
      );
    }

    // Call Delhivery Serviceability API
    // Docs: https://developers.delhivery.com/#tag/Serviceability/operation/getPincodeServiceabilityStatus
    const delhiveryUrl = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;

    let delhiveryResponse: Response;
    try {
      delhiveryResponse = await fetch(delhiveryUrl, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // 8-second timeout to avoid hanging serverless function
        signal: AbortSignal.timeout(8000),
      });
    } catch (fetchError: any) {
      console.error('[serviceability] Network error calling Delhivery:', fetchError.message);
      return NextResponse.json(
        { error: 'Could not reach Delhivery API. Please try again.' },
        { status: 502 }
      );
    }

    if (!delhiveryResponse.ok) {
      const errorText = await delhiveryResponse.text().catch(() => '');
      console.error('[serviceability] Delhivery returned non-OK:', delhiveryResponse.status, errorText);
      return NextResponse.json(
        { error: `Delhivery API error: ${delhiveryResponse.status}` },
        { status: 502 }
      );
    }

    // Parse and type-guard the response
    let rawData: any;
    try {
      rawData = await delhiveryResponse.json();
    } catch {
      return NextResponse.json(
        { error: 'Received malformed JSON from Delhivery API.' },
        { status: 502 }
      );
    }

    // Delhivery returns { delivery_codes: [{ postal_code: { pin, inc_cod, district_name, state_code, ... } }] }
    const deliveryCodes: any[] = rawData?.delivery_codes ?? [];
    if (deliveryCodes.length === 0) {
      // Pincode not found in Delhivery database — not serviceable
      const result: DelhiveryServiceabilityResult = {
        serviceable: false,
        codAvailable: false,
        state: '',
        district: '',
        remark: null,
      };
      return NextResponse.json(result);
    }

    const postalCode: DelhiveryPostalCode = deliveryCodes[0]?.postal_code ?? {};

    // ── Embargo check ─────────────────────────────────────────────────────
    // Delhivery sets postal_code.remark = "Embargo" when an area is under
    // a temporary or permanent delivery restriction. Even though the pincode
    // exists in their database, we must treat it as non-serviceable.
    const remark: string | null = postalCode.remark?.trim() ?? null;
    const isEmbargoed = remark !== null && remark.toLowerCase().includes('embargo');

    if (isEmbargoed) {
      console.warn(`[serviceability] Pincode ${pincode} is under Embargo. Remark: ${remark}`);
      const embargoResult: DelhiveryServiceabilityResult = {
        serviceable: false,
        codAvailable: false,
        state: postalCode.state_code ?? '',
        district: postalCode.district_name ?? '',
        remark,
      };
      return NextResponse.json(embargoResult);
    }

    const result: DelhiveryServiceabilityResult = {
      serviceable: true,
      // inc_cod: 'Y' means Cash on Delivery is available for this pincode
      codAvailable: postalCode.inc_cod === 'Y',
      state: postalCode.state_code ?? '',
      district: postalCode.district_name ?? '',
      remark,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[serviceability] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error during serviceability check.' },
      { status: 500 }
    );
  }
}
