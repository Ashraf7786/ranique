# 🏷️ Ranique Store — Project Information & Tech Stack

This document details the architecture, technical stacks, databases, APIs, and companion systems utilized in the **Ranique** e-commerce project ecosystem.

---

## 💻 Tech Stack Overview
Ranique is a modern, high-performance, full-stack e-commerce web application designed for premium beauty, cosmetics, bangles, and lifestyle essentials.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Programming Language** | **TypeScript** | Strong typing across the entire codebase (frontend components, API routes, and database schemas). |
| **Frontend Framework** | **Next.js (App Router)** | v16.2.9 with Turbopack for server-side rendering, routing, and static page optimization. |
| **Core UI Library** | **React** | v19.2.4 for component-based interactive design. |
| **Styling (CSS)** | **Tailwind CSS** | v4.0.0 for utility-first styling, grid systems, and custom thematic styling. |
| **Database Engine** | **PostgreSQL** | Serverless relational database hosted on **Neon**. |
| **Database ORM** | **Prisma** | v5.22.0 for type-safe schema definitions, migrations, and database queries. |
| **Authentication** | **NextAuth.js** | Next-auth configuration supporting standard credentials (email/password) and Google OAuth login. |
| **Payment Gateway** | **Razorpay** | Online payments integration (UPI, Cards, Wallets, NetBanking) with webhooks and signature verification. |
| **Media Storage / CDN** | **Cloudinary** | Image uploads and asset optimizations using `next-cloudinary`. |
| **Email Delivery** | **Nodemailer** | SMTP client integration for OTPs, order confirmation emails, and customer communications. |
| **Testing Suite** | **Vitest** | Fast unit and integration testing framework with Turbopack support. |
| **Utilities** | **Zod, Lucide React, Clsx, Tailwind-merge** | Form schema validation, vector SVG icon support, and CSS class merging. |

---

## 🗄️ Database Architecture
The backend uses **PostgreSQL** managed by Neon. Database modeling and relationships are handled by **Prisma**.

### Core Schema Structures:
1. **User Management**:
   - `User` - Base account entity storing roles (`ADMIN`, `STAFF`, `CUSTOMER`), Google Auth integration, and profile data.
   - `StaffProfile` - Dedicated profiles for staff operators with authorization codes.
   - `Address` - Delivery addresses linked to customer accounts.
   - `OtpRequest` - Storing OTP codes for registrations and password resets.

2. **Customer Experience**:
   - `Wishlist` & `WishlistItem` - Storing customer wishlist arrays.
   - `Cart` & `CartItem` - Real-time persistent shopping carts.
   - `RecentlyViewed` - User history arrays for personalized views.
   - `Wallet` - Storing digital wallet balances in INR.

3. **Catalog & Inventory**:
   - `Product` - Comprehensive inventory details, pricing (original/cost/selling), variant mapping, and status rules.
   - `Category` - Hierarchical category trees (Parent-Child relationships).
   - `Brand` - Store brand mappings.
   - `ProductImage` - Digital CDN links for catalog pictures.
   - `ProductOffer` - Dynamic discounts and promotional prices with expiration dates.
   - `ProductEditRequest` - Approval workflows for staff inventory changes before going live.

4. **Transactions & CRM**:
   - `Order` & `OrderItem` - Complete purchase records, tracking codes, Razorpay order IDs, and payment verification indicators.
   - `Coupon` - Promo code calculations, maximum usage limits, and order conditions.
   - `Testimonial`, `Review`, `Enquiry` - Interactive customer reviews, ratings, and bug reports / contact enquiries.
   - `Announcement`, `HeroBanner` - Customizable header banners and promotional sliders.

---

## 🛠️ Companion Utility Software (Desktop Toolkit)
In addition to the Next.js e-commerce application, the workspace contains a companion tool suite (**Ranique Store Toolkit**) under the directory `d:\Ranique Software\`:
- **Programming Language**: **Python 3.13**
- **Micro-Framework**: **Flask** (runs locally on port `5000`)
- **Label Stamper**: A PDF layout overlay generator built on **PyMuPDF**, **qrcode**, and **Pillow** to stamp custom storefront branding on direct thermal invoices.
- **Address Verifier**: Offline address verification executing **Windows native WinRT OCR** via PowerShell integration (`win_ocr.ps1`) to parse and validate recipient pin codes.
