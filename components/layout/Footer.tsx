"use client";

import React from "react";
import Link from "next/link";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Award,
  Headphones,
  CreditCard
} from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=cosmetics", label: "Cosmetics" },
  { href: "/shop?category=bangles", label: "Bangles" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/shop?category=purses", label: "Purses" },
  { href: "/shop?collection=new-arrivals", label: "New Arrivals" },
  { href: "/shop?collection=best-sellers", label: "Best Sellers" },
];

const SUPPORT_LINKS = [
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/return-refund-policy", label: "Return & Refund Policy" },
  { href: "/cancellation-policy", label: "Cancellation Policy" },
  { href: "/track-order", label: "Track Order" },
  { href: "/size-guide", label: "Size Guide" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/our-story", label: "Our Story" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/sitemap", label: "Sitemap" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Award, label: "GST Registered Business" },
  { icon: Truck, label: "Fast Shipping Across India" },
  { icon: Award, label: "Premium Quality Products" },
  { icon: Headphones, label: "Customer Support" },
  { icon: ShieldCheck, label: "Safe & Secure Checkout" },
];

const PAYMENT_METHODS = [
  "UPI", "Visa", "Mastercard", "RuPay", "American Express", "Net Banking", "Wallets", "Cash on Delivery"
];

export function Footer() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Ranique",
    "legalName": "RANI SHRINGAR & GENERAL STORE",
    "description": "Curated luxury for the modern woman. Discover premium cosmetics, elegant bangles, accessories, purses, and lifestyle essentials designed to elevate your everyday style.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Aurangabad",
      "addressRegion": "Bihar",
      "addressCountry": "IN"
    }
  };

  return (
    <footer className="bg-brand-ink text-white mt-20 border-t border-brand-border/20">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-3xl font-semibold tracking-wide inline-block mb-6 text-brand-blush hover:text-white transition-colors">
              Ranique
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-md">
              Curated luxury for the modern woman. Discover premium cosmetics, elegant bangles, accessories, purses, and lifestyle essentials designed to elevate your everyday style.
            </p>
            
            <address className="not-italic space-y-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-rose shrink-0" />
                <p>
                  <strong className="text-white block mb-1">Store</strong>
                  Rani Sringar Store, Obra<br />
                  Aurangabad, Bihar, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-rose shrink-0" />
                <a href="mailto:support@ranique.in" className="hover:text-brand-rose-light transition-colors">
                  [support@ranique.in]
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-rose shrink-0" />
                <a href="tel:+919288467633" className="hover:text-brand-rose-light transition-colors">
                  +91 92884 67633
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-rose shrink-0" />
                <p>Mon - Sat: 10:00 AM - 7:00 PM (IST)</p>
              </div>
            </address>

            {/* Social Media Links */}
            <div className="mt-8 flex gap-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-rose hover:border-brand-rose transition-all group">
                <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-rose hover:border-brand-rose transition-all group">
                <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" aria-label="Pinterest" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-rose hover:border-brand-rose transition-all group">
                <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.43 2.981 7.43 6.953 0 4.156-2.617 7.502-6.257 7.502-1.22 0-2.368-.633-2.763-1.385l-.752 2.868c-.272 1.039-.997 2.339-1.488 3.131 1.135.347 2.338.534 3.582.534 6.621 0 11.988-5.367 11.988-11.988 0-6.62-5.367-11.987-11.988-11.987z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-rose hover:border-brand-rose transition-all group">
                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <nav aria-label="Shop Footer Navigation">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold-light mb-6">
              Shop
            </h3>
            <ul className="space-y-3.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-brand-rose-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Customer Support */}
          <nav aria-label="Support Footer Navigation">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold-light mb-6">
              Customer Support
            </h3>
            <ul className="space-y-3.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-brand-rose-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Company */}
          <nav aria-label="Company Footer Navigation">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold-light mb-6">
              Company
            </h3>
            <ul className="space-y-3.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-brand-rose-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>



        {/* Trust & Security + Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-b border-white/10 pb-12 mb-8">
          
          {/* Trust Badges */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-6">Why Choose Us</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
              {TRUST_BADGES.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-rose/20 flex items-center justify-center shrink-0">
                    <badge.icon className="w-4 h-4 text-brand-rose-light" />
                  </div>
                  <span className="text-xs text-white/70 font-medium leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:pl-10 lg:border-l border-white/10">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-6">100% Secure Payments</h4>
            <div className="flex flex-wrap gap-2.5">
              {PAYMENT_METHODS.map((method, idx) => (
                <div key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/70 font-medium">
                  {method}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-white/50">
              <CreditCard className="w-4 h-4" />
              <span>All major credit cards, UPI, and wallets accepted.</span>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimers & Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 text-xs text-white/40">
          
          {/* Disclaimers */}
          <div className="space-y-2 max-w-2xl">
            <p>Disclaimer: Product colors may slightly vary due to photography lighting and different screen settings.</p>
            <p>Prices, offers, and product availability are subject to change without prior notice.</p>
          </div>

          {/* Copyright */}
          <div className="lg:text-right space-y-2 shrink-0">
            <p>© 2026 Ranique. All Rights Reserved.</p>
            <p>Store operated under the name of <strong>Rani Sringar Store (Ranique)</strong>.</p>
            <p>GST Trade Name: RANI SHRINGAR & GENERAL STORE</p>
            <p>GSTIN: 10AVTPV6245L1ZX</p>
            <p className="pt-2 mt-4 border-t border-white/5 text-white/30">
              Designed & Developed by <a href="https://iamashraf.in" target="_blank" rel="noopener noreferrer" className="hover:text-brand-rose-light transition-colors">Ashraf Siddiqui (iamashraf.in)</a>
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
