import { z } from 'zod';

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().max(50).optional(),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export const ProductCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  shortDescription: z.string().max(1000).optional().nullable(),
  sku: z.string().min(1, 'SKU is required').max(100),
  sellingPrice: z.number().min(0, 'Price cannot be negative'),
  originalPrice: z.number().min(0).optional().nullable(),
  currentStock: z.number().int().min(0, 'Stock cannot be negative'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  colors: z.string().optional().nullable(),
  variantGroupId: z.string().optional().nullable(),
  boughtLastWeek: z.number().int().min(0).optional().nullable(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url('Each image must have a valid URL'),
        isCover: z.boolean().optional().default(false),
      })
    )
    .optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export const ReviewCreateSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  customerName: z.string().min(1, 'Customer name is required').max(100),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().max(2000).optional().nullable(),
  isVerified: z.boolean().optional().default(true),
  isGenuine: z.boolean().optional().default(false),
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────

const ShippingAddressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone is required'),
  email: z.string().email('Valid email is required'),
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional().nullable(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(4, 'Valid ZIP code is required'),
  country: z.string().optional().default('India'),
});

const OrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const OrderCreateSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'Cart cannot be empty'),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(['COD', 'ONLINE', 'WHATSAPP']),
  totalAmount: z.number().min(0).optional(),
  couponCode: z.string().optional().nullable(),
  razorpayOrderId: z.string().optional().nullable(),
  razorpayPaymentId: z.string().optional().nullable(),
  razorpaySignature: z.string().optional().nullable(),
});

// ─── USER / PROFILE ──────────────────────────────────────────────────────────

export const ProfileUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().max(50).optional().nullable(),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .optional()
    .nullable(),
  dob: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional().nullable(),
  address: z
    .object({
      name: z.string().min(1),
      phone: z.string().min(10),
      line1: z.string().min(1),
      line2: z.string().optional().nullable(),
      city: z.string().min(1),
      state: z.string().min(1),
      zip: z.string().min(4),
      country: z.string().optional(),
    })
    .optional()
    .nullable(),
});

// ─── CART ────────────────────────────────────────────────────────────────────

export const CartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  variantSku: z.string().optional().nullable(),
});

// ─── WISHLIST ────────────────────────────────────────────────────────────────

export const WishlistItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

// ─── COUPONS ─────────────────────────────────────────────────────────────────

export const CouponValidateSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(50),
  cartSubtotal: z.number().min(0, 'Cart subtotal must be a positive number'),
  cartItems: z.array(z.any()).optional(),
});

export const CouponCreateSchema = z.object({
  code: z.string().min(1).max(50).toUpperCase(),
  discountPercent: z.number().min(0.01).max(100),
  productId: z.string().optional().nullable(),
  minOrderValue: z.number().min(0).optional().default(0),
  maxUses: z.number().int().min(1).optional().nullable(),
  endsAt: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const CategoryCreateSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, hyphens only'),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  parentId: z.string().optional().nullable(),
});

// ─── BRANDS ──────────────────────────────────────────────────────────────────

export const BrandCreateSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, hyphens only'),
  description: z.string().optional().nullable(),
  logo: z.string().url().optional().nullable(),
});

// ─── OFFERS ──────────────────────────────────────────────────────────────────

export const OfferCreateSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  discount: z.number().min(0.01).max(100, 'Discount cannot exceed 100%'),
  offerPrice: z.number().min(0),
  endsAt: z.string().min(1, 'End date is required'),
  isActive: z.boolean().optional().default(true),
});

// ─── RAZORPAY ────────────────────────────────────────────────────────────────

export const RazorpayCreateOrderSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
});

// ─── HELPER ──────────────────────────────────────────────────────────────────

/**
 * Returns a standardized 422 validation error response from a Zod SafeParseError.
 * Usage: return validationError(parsed.error);
 */
import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

export function validationError(error: ZodError) {
  return NextResponse.json(
    { error: 'Validation failed', details: error.flatten().fieldErrors },
    { status: 422 }
  );
}

/**
 * Returns a standardized 403 Forbidden response.
 */
export function forbiddenError() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
