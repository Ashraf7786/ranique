import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const nextAuthHandler = NextAuth(authOptions);

const wrapHandler = (handler: any) => async (req: Request, context: any) => {
  if (req.url) {
    try {
      const url = new URL(req.url);
      process.env.NEXTAUTH_URL = `${url.protocol}//${url.host}`;
    } catch (e) {
      console.error("Failed to parse request URL in NextAuth:", e);
    }
  }
  return handler(req, context);
};

const GET = wrapHandler(nextAuthHandler);
const POST = wrapHandler(nextAuthHandler);

export { GET, POST };
