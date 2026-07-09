# Ranique Project Brain / Context

This file serves as a persistent memory and context for the Ranique project to ensure continuity between sessions. It contains the history of changes, current project state, and pending tasks.

## 🚀 Recent Accomplishments (Latest Session)

**Backend Architecture & Security Hardening**:
- **Zod Validation**: Implemented strict schema validation for all 14 API routes (`lib/validation.ts`).
- **Rate Limiting**: Built a zero-dependency in-memory rate limiter (`lib/rate-limit.ts`) applied to OTP, registration, and Razorpay endpoints to prevent spam.
- **Security Auth Guards**: Fixed 7 critical security gaps by adding missing admin authentication to `products`, `categories`, `brands`, and `offers` routes.
- **Security Headers**: Configured strict HTTP security headers in `next.config.ts` (X-Frame-Options, HSTS, nosniff, Permissions-Policy, etc.).
- **Testing**: Set up Vitest with 28 passing unit tests covering all Zod schemas (`__tests__/validation.test.ts`).
- **Build Fixes**:
  - Fixed Next.js 16 `revalidateTag` API changes (requires 2 args) by replacing them with `revalidatePath`.
  - Fixed Zod v4 compatibility by removing the deprecated `invalid_type_error` option from `z.number()`.

## 🏗️ Project Architecture Overview

- **Framework**: Next.js (App Router API routes) v16+
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Authentication**: Auth.js (NextAuth) - Google & Credentials (OTP based verification)
- **File Storage**: Cloudinary
- **Payments**: Razorpay
- **Deployment**: Vercel

## 📌 Pending Tasks / Next Steps

- **Sentry (Monitoring & Logging)**: Queued for future (currently skipped as no account is available).
- **Redis (Caching)**: Queued for future (currently skipped as no account is available).
- **Playwright (E2E Testing)**: Queued for future work.
- Add any frontend alignment or additional feature requests here.

## 💡 Notes for AI Assistant

- **Always refer to this file** to understand the current state of the project upon starting a new session.
- **Update this file** at the end of major tasks or significant chats to keep the context fresh.
- **Zod v4**: The project uses Zod v4. Use compatible syntax (e.g., avoid `z.number({ invalid_type_error: ... })`).
- **Next.js 16**: `revalidateTag` requires 2 arguments `(tag, type)`. Use `revalidatePath` when a single path needs revalidation.
