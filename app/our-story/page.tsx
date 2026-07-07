import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story | Ranique — From Jaipur to Every Indian Woman",
  description:
    "The story of Ranique — how a vision born in the lanes of Jaipur became India's most loved women's premium boutique. Read about our journey, milestones, and dreams.",
  keywords: ["Ranique story", "Ranique history", "Indian women boutique", "premium brand India", "Jaipur fashion brand"],
  openGraph: {
    title: "Our Story | Ranique",
    description: "From a small passion project in Jaipur to serving 10,000+ women across India — this is the Ranique story.",
    type: "article",
    locale: "en_IN",
  },
};

const TIMELINE = [
  {
    year: "2019",
    emoji: "🌱",
    title: "The Seed is Planted",
    desc: "Rania, a fashion-obsessed girl from Jaipur, starts gifting hand-curated beauty hampers to friends and family. The response is overwhelming — 'You should sell these!'",
    side: "left",
  },
  {
    year: "2020",
    emoji: "📦",
    title: "First 100 Orders",
    desc: "Operating from her bedroom with an Instagram page and a WhatsApp number, Ranique takes its first 100 orders. Every package was wrapped by hand with a handwritten note.",
    side: "right",
  },
  {
    year: "2021",
    emoji: "💎",
    title: "Expanding the Collection",
    desc: "Bangles, accessories, and purses join the catalogue. Ranique partners with 12 artisan suppliers from Jaipur, Mumbai, and Surat to bring wider variety without compromising quality.",
    side: "left",
  },
  {
    year: "2022",
    emoji: "🚀",
    title: "Going Digital",
    desc: "The official Ranique website launches. Orders pour in from across India — from Kanyakumari to Kashmir. The team grows from 1 to 8 passionate women.",
    side: "right",
  },
  {
    year: "2023",
    emoji: "🏆",
    title: "10,000 Happy Customers",
    desc: "Ranique crosses a milestone — 10,000 orders shipped, a 4.9-star average rating, and features in two regional lifestyle magazines. The dream is very much alive.",
    side: "left",
  },
  {
    year: "2024–25",
    emoji: "🌸",
    title: "The Next Chapter",
    desc: "New product lines, collaborations with Indian designers, and the launch of our full-service e-commerce platform. Ranique is just getting started.",
    side: "right",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Story of Ranique — Premium Crafted for Every Indian Woman",
  description:
    "From a passion project in Jaipur to India's favourite women's premium boutique — the journey of Ranique.",
  author: { "@type": "Organization", name: "Ranique" },
  publisher: { "@type": "Organization", name: "Ranique" },
  datePublished: "2024-01-01",
  dateModified: "2025-06-01",
};

export default function OurStoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-white to-brand-gold-light/30 py-24 md:py-32">
        <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
        <div aria-hidden className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            Our Story
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-ink leading-tight mb-6">
            A Dream Born in{" "}
            <em className="not-italic text-brand-rose">Jaipur's Pink City</em>
          </h1>
          <p className="font-sans text-base sm:text-lg text-brand-slate max-w-2xl mx-auto leading-relaxed">
            Every great brand begins with a simple idea. Ours began with a girl, a passion for beautiful things, and the belief that every woman deserves to feel like royalty — without breaking the bank.
          </p>
        </div>
      </section>

      {/* ── Pull Quote ───────────────────────────────────────────────── */}
      <section className="border-y border-brand-border bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote>
            <p className="font-serif text-2xl sm:text-3xl text-brand-rose italic leading-relaxed mb-4">
              "I didn't start Ranique to build a business. I started it because I genuinely believed every woman around me deserved something more beautiful."
            </p>
            <footer className="font-sans text-sm text-brand-slate">
              — <cite>Rania, Founder of Ranique</cite>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            Our Journey
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
            From Bedroom to Boutique
          </h2>
        </div>

        <div className="relative">
          {/* Centre line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-brand-border -translate-x-1/2" />

          <div className="space-y-12">
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                  item.side === "right" ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Card */}
                <div className="flex-1 md:max-w-[45%]">
                  <div className={`bg-white rounded-2xl border border-brand-border shadow-card p-6 hover:shadow-card-hover transition-shadow ${
                    item.side === "right" ? "md:ml-auto" : ""
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="font-sans text-xs font-bold text-brand-rose uppercase tracking-widest">{item.year}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-brand-ink mb-2">{item.title}</h3>
                    <p className="font-sans text-sm text-brand-slate leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Centre dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-brand-rose items-center justify-center text-sm z-10">
                  {i + 1}
                </div>

                {/* Spacer */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────────────────── */}
      <section className="bg-brand-mist py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🎯",
                title: "Our Vision",
                text: "To become India's most trusted women's lifestyle brand — one that women turn to not just for products, but for inspiration, confidence, and joy.",
              },
              {
                emoji: "💡",
                title: "Our Mission",
                text: "To curate and deliver premium-quality beauty and fashion products to every Indian woman, with the warmth of personal service and the trust of a friend.",
              },
              {
                emoji: "💎",
                title: "Our Promise",
                text: "Every product that bears the Ranique name has passed our quality check. If it isn't something we'd proudly gift to our own family — it doesn't make the cut.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-brand-border shadow-card p-7 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="font-serif text-lg font-semibold text-brand-ink mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-brand-slate leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-brand-border bg-white py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink mb-3">
            Be Part of Our Story
          </h2>
          <p className="font-sans text-sm text-brand-slate mb-7">
            Join thousands of women who have made Ranique a part of their everyday beauty ritual.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="inline-flex items-center h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm">
              Shop the Collection
            </Link>
            <Link href="/careers" className="inline-flex items-center h-12 px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-95 transition-all">
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
