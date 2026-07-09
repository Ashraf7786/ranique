import { describe, it, expect } from 'vitest';
import {
  RegisterSchema,
  ForgotPasswordSchema,
  VerifyOtpSchema,
  ResetPasswordSchema,
  ProductCreateSchema,
  ReviewCreateSchema,
  CartItemSchema,
  WishlistItemSchema,
  CouponValidateSchema,
  RazorpayCreateOrderSchema,
} from '../lib/validation';

// ─── REGISTER ────────────────────────────────────────────────────────────────

describe('RegisterSchema', () => {
  it('accepts valid registration data', () => {
    const result = RegisterSchema.safeParse({
      firstName: 'Riya',
      email: 'riya@example.com',
      password: 'securePass123',
      mobileNumber: '9876543210',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = RegisterSchema.safeParse({
      firstName: 'Riya',
      email: 'not-an-email',
      password: 'securePass123',
      mobileNumber: '9876543210',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = RegisterSchema.safeParse({
      firstName: 'Riya',
      email: 'riya@example.com',
      password: 'abc',
      mobileNumber: '9876543210',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a mobile number with fewer than 10 digits', () => {
    const result = RegisterSchema.safeParse({
      firstName: 'Riya',
      email: 'riya@example.com',
      password: 'securePass123',
      mobileNumber: '98765',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing firstName', () => {
    const result = RegisterSchema.safeParse({
      email: 'riya@example.com',
      password: 'securePass123',
      mobileNumber: '9876543210',
    });
    expect(result.success).toBe(false);
  });
});

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────

describe('ForgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    expect(ForgotPasswordSchema.safeParse({ email: 'test@ranique.in' }).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(ForgotPasswordSchema.safeParse({ email: 'notvalid' }).success).toBe(false);
  });
});

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────

describe('VerifyOtpSchema', () => {
  it('accepts a valid 6-digit OTP', () => {
    expect(VerifyOtpSchema.safeParse({ email: 'a@b.com', otp: '123456' }).success).toBe(true);
  });

  it('rejects OTP with fewer than 6 digits', () => {
    expect(VerifyOtpSchema.safeParse({ email: 'a@b.com', otp: '123' }).success).toBe(false);
  });

  it('rejects OTP with letters', () => {
    expect(VerifyOtpSchema.safeParse({ email: 'a@b.com', otp: 'abcdef' }).success).toBe(false);
  });
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

describe('ResetPasswordSchema', () => {
  it('accepts valid reset data', () => {
    expect(ResetPasswordSchema.safeParse({
      email: 'a@b.com', otp: '123456', newPassword: 'newPass123'
    }).success).toBe(true);
  });

  it('rejects a short new password', () => {
    expect(ResetPasswordSchema.safeParse({
      email: 'a@b.com', otp: '123456', newPassword: 'short'
    }).success).toBe(false);
  });
});

// ─── PRODUCT CREATE ───────────────────────────────────────────────────────────

describe('ProductCreateSchema', () => {
  const validProduct = {
    title: 'Kashmiri Silver Bangles',
    slug: 'kashmiri-silver-bangles',
    sku: 'KSB-001',
    sellingPrice: 1299,
    currentStock: 50,
    status: 'PUBLISHED' as const,
  };

  it('accepts a valid product', () => {
    expect(ProductCreateSchema.safeParse(validProduct).success).toBe(true);
  });

  it('rejects a negative price', () => {
    expect(ProductCreateSchema.safeParse({ ...validProduct, sellingPrice: -10 }).success).toBe(false);
  });

  it('rejects a negative stock', () => {
    expect(ProductCreateSchema.safeParse({ ...validProduct, currentStock: -5 }).success).toBe(false);
  });

  it('rejects an invalid status', () => {
    expect(ProductCreateSchema.safeParse({ ...validProduct, status: 'INVALID' }).success).toBe(false);
  });

  it('rejects a slug with uppercase letters', () => {
    expect(ProductCreateSchema.safeParse({ ...validProduct, slug: 'Invalid-Slug' }).success).toBe(false);
  });
});

// ─── REVIEW CREATE ────────────────────────────────────────────────────────────

describe('ReviewCreateSchema', () => {
  it('accepts a valid review', () => {
    expect(ReviewCreateSchema.safeParse({
      productId: 'uuid-123',
      customerName: 'Priya S.',
      rating: 5,
    }).success).toBe(true);
  });

  it('rejects a rating above 5', () => {
    expect(ReviewCreateSchema.safeParse({
      productId: 'uuid-123',
      customerName: 'Priya S.',
      rating: 6,
    }).success).toBe(false);
  });

  it('rejects a rating of 0', () => {
    expect(ReviewCreateSchema.safeParse({
      productId: 'uuid-123',
      customerName: 'Priya S.',
      rating: 0,
    }).success).toBe(false);
  });
});

// ─── CART ITEM ────────────────────────────────────────────────────────────────

describe('CartItemSchema', () => {
  it('accepts a valid cart item', () => {
    expect(CartItemSchema.safeParse({ productId: 'p1', quantity: 2 }).success).toBe(true);
  });

  it('rejects quantity of 0', () => {
    expect(CartItemSchema.safeParse({ productId: 'p1', quantity: 0 }).success).toBe(false);
  });

  it('rejects a missing productId', () => {
    expect(CartItemSchema.safeParse({ quantity: 1 }).success).toBe(false);
  });
});

// ─── WISHLIST ─────────────────────────────────────────────────────────────────

describe('WishlistItemSchema', () => {
  it('accepts a valid productId', () => {
    expect(WishlistItemSchema.safeParse({ productId: 'uuid-abc' }).success).toBe(true);
  });

  it('rejects an empty productId', () => {
    expect(WishlistItemSchema.safeParse({ productId: '' }).success).toBe(false);
  });
});

// ─── RAZORPAY ─────────────────────────────────────────────────────────────────

describe('RazorpayCreateOrderSchema', () => {
  it('accepts a valid positive amount', () => {
    expect(RazorpayCreateOrderSchema.safeParse({ amount: 1299 }).success).toBe(true);
  });

  it('rejects amount of 0', () => {
    expect(RazorpayCreateOrderSchema.safeParse({ amount: 0 }).success).toBe(false);
  });

  it('rejects a negative amount', () => {
    expect(RazorpayCreateOrderSchema.safeParse({ amount: -500 }).success).toBe(false);
  });
});
