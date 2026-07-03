"use client";

import React from "react";
import Link from "next/link";

const FOOTER_LINKS = {
  Shop: [
    { href: "/shop?category=cosmetics",    label: "Cosmetics" },
    { href: "/shop?category=accessories",  label: "Accessories" },
    { href: "/shop?category=bangles",      label: "Bangles" },
    { href: "/shop?category=purses",       label: "Purses" },
  ],
  Help: [
    { href: "/faq",       label: "FAQ" },
    { href: "/shipping",  label: "Shipping & Returns" },
    { href: "/contact",   label: "Contact Us" },
    { href: "/size-guide",label: "Size Guide" },
  ],
  Company: [
    { href: "/about",    label: "About Ranique" },
    { href: "/journal",  label: "Journal" },
    { href: "/careers",  label: "Careers" },
    { href: "/privacy",  label: "Privacy Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-brand-ink text-white mt-20">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Join the Ranique Circle
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Exclusive offers, new arrivals, and beauty secrets — delivered to your inbox.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md gap-2"
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              className="flex-1 h-11 px-4 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-brand-rose-light transition-colors"
            />
            <button
              type="submit"
              id="newsletter-submit"
              className="h-11 px-6 rounded-full bg-brand-rose text-white text-sm font-medium hover:bg-brand-rose-dark transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-2xl font-semibold">Ranique</span>
            <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-[200px]">
              Curated luxury for the modern woman. Cosmetics, accessories, bangles & purses.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {["Instagram", "Pinterest", "TikTok"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-rose transition-colors flex items-center justify-center text-xs font-bold"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Ranique. All rights reserved.</p>
          <div className="flex gap-1 items-center">
            {["💳", "💳", "🔒"].map((icon, i) => (
              <span key={i} className="text-base opacity-50">{icon}</span>
            ))}
            <span className="ml-2">Secure checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
