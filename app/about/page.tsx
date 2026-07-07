import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Star, Globe, Leaf, Users, Award, ShieldCheck, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Ranique — Premium Ladies' Boutique",
  description:
    "Learn about Ranique — India's curated premium boutique for women. Discover our mission, values, and the story behind our premium cosmetics, bangles, accessories, and purses.",
  keywords: ["about Ranique", "premium boutique India", "women's fashion brand", "Ranique story", "premium cosmetics India"],
  openGraph: {
    title: "About Us | Ranique",
    description: "India's curated premium boutique for modern women. Premium cosmetics, bangles, accessories & purses.",
    type: "website",
    locale: "en_IN",
  },
};

const VALUES = [
  {
    icon: Star,
    color: "text-brand-gold",
    bg: "from-[#F0DDB8] to-[#E8D5A3]",
    title: "Uncompromising Quality",
    desc: "Every product is hand-selected and quality-tested before it reaches you. We believe premium should feel real — not just look it.",
  },
  {
    icon: Heart,
    color: "text-brand-rose",
    bg: "from-[#F7E8E8] to-[#EEC5CF]",
    title: "Made for Every Woman",
    desc: "From the college student to the working professional, our collections are designed to celebrate every woman's unique identity.",
  },
  {
    icon: Globe,
    color: "text-[#8B9DB8]",
    bg: "from-[#E8EEF7] to-[#C5D5EE]",
    title: "Rooted in India",
    desc: "We are proudly Indian — celebrating the artistry of our craftsmen while bringing globally-inspired designs to your doorstep.",
  },
  {
    icon: Leaf,
    color: "text-[#5A8A6A]",
    bg: "from-[#E8F5E9] to-[#C8E6C9]",
    title: "Thoughtful Sourcing",
    desc: "We partner with responsible suppliers who share our commitment to ethical production and sustainable packaging practices.",
  },
];

const STATS = [
  { value: "500+", label: "Premium Products" },
  { value: "10,000+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "50+", label: "Cities Served" },
];

const TEAM = [
  {
    name: "Rania Kapoor",
    role: "Founder & Creative Director",
    emoji: "👩‍💼",
    bio: "With a passion for fashion and a decade of retail experience, Rania started Ranique to bring affordable premium to every Indian woman.",
  },
  {
    name: "Priya Mehta",
    role: "Head of Product Curation",
    emoji: "💄",
    bio: "Former beauty editor turned buyer — Priya's eye for trend and quality ensures every piece in our collection is worthy of your collection.",
  },
  {
    name: "Aarav Sharma",
    role: "Operations & Logistics",
    emoji: "🚚",
    bio: "Aarav keeps the gears turning — from supplier relationships to last-mile delivery, ensuring your order reaches you perfectly.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ranique",
  legalName: "Rani Sringar & General Store",
  url: "https://ranique.in",
  description:
    "Ranique is India's premier curated premium boutique for women, offering premium cosmetics, bangles, accessories, purses, and lifestyle essentials.",
  foundingDate: "2019",
  foundingLocation: "Jaipur, Rajasthan, India",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  sameAs: ["https://instagram.com/ranique.official"],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-white to-brand-gold-light/30 py-20 md:py-28">
        <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
        <div aria-hidden className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            About Ranique
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-ink leading-tight mb-6">
            Curated Premium,{" "}
            <em className="not-italic text-brand-rose">Crafted for You</em>
          </h1>
          <p className="font-sans text-base sm:text-lg text-brand-slate max-w-2xl mx-auto leading-relaxed mb-8">
            Ranique is more than a boutique — it's a celebration of the modern Indian woman. From premium cosmetics to hand-crafted bangles and designer purses, we bring you the finest things in life, delivered with care.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm"
            >
              Explore Collections
            </Link>
            <Link
              href="/our-story"
              className="inline-flex items-center h-12 px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-95 transition-all"
            >
              Our Story →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────── */}
      <section aria-label="Brand statistics" className="border-y border-brand-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-brand-rose">{s.value}</p>
                <p className="font-sans text-sm text-brand-slate mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
              Our Mission
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink mb-5 leading-tight">
              Empowering Women Through{" "}
              <em className="not-italic text-brand-rose">Beautiful Things</em>
            </h2>
            <p className="font-sans text-brand-slate leading-relaxed mb-4">
              We believe every woman deserves to feel extraordinary — not just on special occasions, but every single day. Ranique was born from the idea that premium quality shouldn't come with an unreachable price tag.
            </p>
            <p className="font-sans text-brand-slate leading-relaxed mb-4">
              From the vibrant markets of Jaipur to the fashion capitals of the world, we source the finest cosmetics, jewellery, and accessories, bringing them directly to your hands with the warmth and trust of a personal stylist.
            </p>
            <p className="font-sans text-brand-slate leading-relaxed">
              Our team of passionate women curates every piece, ensuring it meets our three golden standards: <strong className="text-brand-ink">beauty</strong>, <strong className="text-brand-ink">quality</strong>, and <strong className="text-brand-ink">value</strong>.
            </p>
          </div>

          {/* Visual placeholder */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-blush to-brand-rose-light aspect-[4/3] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🌸</div>
              <p className="font-serif text-xl text-brand-rose-dark font-semibold">Beauty. Quality. Value.</p>
              <p className="font-sans text-sm text-brand-slate mt-2">Our three golden standards</p>
            </div>
            <div aria-hidden className="absolute top-4 right-4 w-24 h-24 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="bg-brand-mist py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
              What We Stand For
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 border border-brand-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-base font-semibold text-brand-ink mb-2">{v.title}</h3>
                <p className="font-sans text-xs text-brand-slate leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            The People Behind Ranique
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
            Meet Our Team
          </h2>
          <p className="font-sans text-sm text-brand-slate mt-2">
            A passionate team of women who live and breathe fashion, beauty, and excellence.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-brand-border shadow-card p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-blush to-brand-rose-light flex items-center justify-center text-4xl mx-auto mb-4">
                {member.emoji}
              </div>
              <h3 className="font-serif text-base font-semibold text-brand-ink">{member.name}</h3>
              <p className="font-sans text-xs text-brand-rose font-medium mt-1 mb-3">{member.role}</p>
              <p className="font-sans text-xs text-brand-slate leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust Bar ────────────────────────────────────────────────── */}
      <section className="bg-brand-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: "Secure Payments", desc: "256-bit SSL encryption" },
              { icon: Truck, label: "Pan-India Delivery", desc: "Fast & reliable shipping" },
              { icon: Award, label: "GST Registered", desc: "Trusted Indian business" },
              { icon: Users, label: "10,000+ Customers", desc: "And counting every day" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-rose/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-brand-rose-light" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm text-white">{item.label}</p>
                  <p className="font-sans text-xs text-white/50 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-blush via-white to-brand-gold-light/30 border-t border-brand-border py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink mb-3">
            Ready to Discover Ranique?
          </h2>
          <p className="font-sans text-sm text-brand-slate mb-7">
            Explore our full collection and find your next favourite piece.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="inline-flex items-center h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm">
              Shop Now
            </Link>
            <Link href="/contact" className="inline-flex items-center h-12 px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-95 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
