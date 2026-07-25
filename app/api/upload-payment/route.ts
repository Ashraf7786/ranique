import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Only allow authenticated customers to upload payment proofs
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paramsToSign } = body;

    // Enforce that this endpoint is only used for payment proofs
    // The client should pass folder: "payment_proofs" in paramsToSign
    // Cloudinary's api_sign_request will sign whatever is passed, so we 
    // just sign it. We trust our authenticated users, but to be strictly safe
    // we could validate paramsToSign.folder === 'payment_proofs'.
    if (paramsToSign.folder !== 'payment_proofs') {
       // Force the folder in the signature if we wanted to, but next-cloudinary
       // requires the signature to match the exact params sent by the client.
       // So we just validate the client is asking to upload to the correct folder.
       if (!paramsToSign.folder || !paramsToSign.folder.includes('payment_proofs')) {
           return NextResponse.json({ error: 'Invalid upload folder' }, { status: 400 });
       }
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary Signature Error:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
