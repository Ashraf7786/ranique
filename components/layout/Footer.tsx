"use client";

import React from "react";
import Link from "next/link";
import { 
  Instagram, 
  Facebook, 
  Youtube, 
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
    "legalName": "Rani Sringar & General Store",
    "description": "Curated luxury for the modern woman. Discover premium cosmetics, elegant bangles, accessories, purses, and lifestyle essentials designed to elevate your everyday style.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jaipur",
      "addressRegion": "Rajasthan",
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
                  <strong className="text-white block mb-1">Head Office</strong>
                  [Your Registered Address Line 1]<br />
                  Jaipur, Rajasthan, India
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
                <a href="tel:+910000000000" className="hover:text-brand-rose-light transition-colors">
                  +91 [00000 00000]
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
                <Instagram className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-rose hover:border-brand-rose transition-all group">
                <Facebook className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </a>
              <a href="#" aria-label="Pinterest" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-rose hover:border-brand-rose transition-all group">
                {/* SVG for Pinterest since lucide doesn't have it natively sometimes, using custom SVG */}
                <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.43 2.981 7.43 6.953 0 4.156-2.617 7.502-6.257 7.502-1.22 0-2.368-.633-2.763-1.385l-.752 2.868c-.272 1.039-.997 2.339-1.488 3.131 1.135.347 2.338.534 3.582.534 6.621 0 11.988-5.367 11.988-11.988 0-6.62-5.367-11.987-11.988-11.987z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-rose hover:border-brand-rose transition-all group">
                <Youtube className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
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

        {/* Legal Information Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 mb-12">
          <h3 className="font-serif text-xl font-semibold mb-6 text-brand-blush">Legal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <strong className="text-white/90 block mb-1">Brand Name</strong>
              <span className="text-white/60">Ranique</span>
            </div>
            <div>
              <strong className="text-white/90 block mb-1">Legal Business Name</strong>
              <span className="text-white/60">Rani Sringar & General Store</span>
            </div>
            <div>
              <strong className="text-white/90 block mb-1">Business Type</strong>
              <span className="text-white/60">Proprietorship</span>
            </div>
            <div>
              <strong className="text-white/90 block mb-1">GSTIN</strong>
              <span className="text-white/60">[Your GSTIN Number]</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-sm">
            <p className="text-brand-gold-light/90 italic">
              "Ranique is a brand owned and operated by Rani Sringar & General Store. All invoices and GST tax invoices are issued under the legal business name Rani Sringar & General Store."
            </p>
          </div>
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
            <p>Ranique is a brand owned and operated by Rani Sringar & General Store.</p>
          </div>

        </div>

      </div>
    </footer>
  );
}
