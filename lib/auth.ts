import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("User not found or using Google Auth");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.firstName + (user.lastName ? ` ${user.lastName}` : ''),
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Find or create user
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        if (!dbUser) {
          // If no user exists, create one via Google
          // Generate random secure password for Google users
          const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
          
          dbUser = await prisma.user.create({
            data: {
              email: user.email!,
              password: randomPassword,
              firstName: (profile as any)?.given_name || user.name?.split(' ')[0] || 'Google',
              lastName: (profile as any)?.family_name || user.name?.split(' ').slice(1).join(' ') || 'User',
              isEmailVerified: true,
              provider: 'GOOGLE',
              providerId: account.providerAccountId,
              image: user.image,
              role: 'CUSTOMER'
            }
          });
        }
        
        user.id = dbUser.id;
        (user as any).role = dbUser.role;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
};
