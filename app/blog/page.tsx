import type { Metadata } from "next";
import Link from "next/link";

const WA_NUMBER = "919288467633";

export const metadata: Metadata = {
  title: "Blog | Ranique — Beauty, Fashion & Lifestyle Tips for Indian Women",
  description:
    "Ranique Blog — beauty tips, fashion guides, skincare routines, and lifestyle advice for Indian women. Tier 2, Tier 3 city friendly tips in Hindi & English.",
  keywords: ["Indian beauty tips", "fashion tips India", "skincare routine India", "bangle styling", "cosmetics tips Hindi", "women fashion blog India"],
  openGraph: {
    title: "Ranique Blog — Beauty & Fashion for Every Indian Woman",
    description: "Beauty tips, fashion guides, skincare routines & lifestyle advice — made for Indian women everywhere.",
    type: "website",
    locale: "en_IN",
  },
};

const CATEGORIES = ["All", "Beauty & Skincare", "Fashion & Styling", "Jewellery & Bangles", "Lifestyle", "Festive Looks"];

const POSTS = [
  {
    slug: "best-lip-serums-under-500-rupees",
    category: "Beauty & Skincare",
    emoji: "💄",
    title: "Best Lip Serums Under ₹500 — Ranique Picks for Every Budget",
    excerpt: "Acche lip serum ke liye haazar rupaye kharach karne ki zaroorat nahi. Ye hain humare top picks jo ₹200–₹500 mein milte hain aur ekdum kamaal ka result dete hain!",
    readTime: "5 min read",
    date: "June 28, 2025",
    tag: "Budget Friendly",
    featured: true,
  },
  {
    slug: "bangles-styling-guide-indian-women",
    category: "Jewellery & Bangles",
    emoji: "💍",
    title: "Bangles Styling Guide — Ek Bangle Se 5 Different Looks",
    excerpt: "Kya aap bhi same bangles ko baar baar same tarike se pehnti hain? Iss guide mein hum batayenge 5 unique ways to style your favourite bangles — office se shaadi tak!",
    readTime: "7 min read",
    date: "June 22, 2025",
    tag: "Styling Guide",
    featured: false,
  },
  {
    slug: "skincare-routine-for-indian-skin",
    category: "Beauty & Skincare",
    emoji: "🌿",
    title: "Indian Skin Ke Liye Perfect Morning Skincare Routine — ₹300 Mein",
    excerpt: "Gori, saaf aur glowing skin ke liye aapko mehnga product nahi chahiye. Ye simple 5-step routine follow karo aur 30 din mein farq dekhna shuru ho jaayega.",
    readTime: "8 min read",
    date: "June 15, 2025",
    tag: "Skincare",
    featured: false,
  },
  {
    slug: "teej-karwa-chauth-makeup-look",
    category: "Festive Looks",
    emoji: "🌸",
    title: "Teej & Karwa Chauth 2025 — Complete Makeup & Jewellery Look",
    excerpt: "Teej ka tyohaar aur aap taiyaar nahi? Chinta mat karo! Yahan hai ek complete guide — makeup, bangles, bindi aur dupatta — sab kuch step by step.",
    readTime: "10 min read",
    date: "June 10, 2025",
    tag: "Festival Special",
    featured: false,
  },
  {
    slug: "purse-guide-working-women-india",
    category: "Fashion & Styling",
    emoji: "👜",
    title: "Working Women Ke Liye Best Purses Under ₹1,500 — 2025 Guide",
    excerpt: "Office, market, shaadi — ek hi purse sab jagah kaam aaye, ye possible hai! Hum suggest kar rahe hain 6 aise versatile bags jo har Indian working woman ko chahiye.",
    readTime: "6 min read",
    date: "June 5, 2025",
    tag: "Budget Shopping",
    featured: false,
  },
  {
    slug: "glow-highlighter-tips-dark-skin",
    category: "Beauty & Skincare",
    emoji: "✨",
    title: "Dark Skin Pe Highlighter Kaise Lagayein — Step-by-Step Guide",
    excerpt: "Dusky aur dark skin tones pe highlighter apply karna ek art hai. Yahan hain woh tips jo aapko ekdum natural aur gorgeous glow denge — bina cakey look ke!",
    readTime: "6 min read",
    date: "May 30, 2025",
    tag: "Makeup Tips",
    featured: false,
  },
  {
    slug: "accessories-for-college-girls-india",
    category: "Fashion & Styling",
    emoji: "🎓",
    title: "College Girls Ke Liye Top 10 Accessories — ₹100–₹500 Budget",
    excerpt: "College mein stylish dikhna chahti ho lekin pocket money tight hai? Ye 10 accessories aapki har outfit ko upgrade karenge — aur ₹500 se zyada kharach nahi hoga!",
    readTime: "5 min read",
    date: "May 22, 2025",
    tag: "College Style",
    featured: false,
  },
];

export default function BlogPage() {
  const featuredPost = POSTS.find((p) => p.featured)!;
  const regularPosts = POSTS.filter((p) => !p.featured);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-white to-brand-gold-light/30 py-16">
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            Ranique Blog
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-brand-ink mb-4">
            Beauty, Fashion &{" "}
            <em className="not-italic text-brand-rose">Indian Lifestyle</em>
          </h1>
          <p className="font-sans text-base text-brand-slate max-w-xl mx-auto">
            Tips, guides aur ideas — aam Indian woman ke liye. Budget-friendly, relatable aur real. 🌸
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Category Filter ───────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`shrink-0 px-4 py-1.5 rounded-full font-sans text-xs font-semibold transition-all duration-200 ${
                cat === "All"
                  ? "bg-brand-rose text-white shadow-sm"
                  : "bg-white border border-brand-border text-brand-slate hover:border-brand-rose hover:text-brand-rose"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Featured Post ─────────────────────────────────────────── */}
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group block mb-10"
        >
          <div className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-brand-blush to-brand-rose-light/60 flex items-center justify-center min-h-[220px] text-8xl">
              {featuredPost.emoji}
            </div>
            <div className="p-7 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-rose text-white text-[10px] font-bold uppercase tracking-wide">
                  Featured
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-rose text-[10px] font-semibold">
                  {featuredPost.category}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-brand-ink leading-snug mb-3 group-hover:text-brand-rose transition-colors">
                {featuredPost.title}
              </h2>
              <p className="font-sans text-sm text-brand-slate leading-relaxed mb-5 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-brand-slate">
                  <span>{featuredPost.date}</span>
                  <span>·</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <span className="text-brand-rose text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  Read More →
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* ── Posts Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {regularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <div className="bg-gradient-to-br from-brand-blush to-brand-gold-light/40 flex items-center justify-center py-10 text-6xl">
                {post.emoji}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-rose text-[10px] font-semibold">
                    {post.tag}
                  </span>
                </div>
                <h3 className="font-serif text-base font-semibold text-brand-ink leading-snug mb-2 group-hover:text-brand-rose transition-colors flex-1">
                  {post.title}
                </h3>
                <p className="font-sans text-xs text-brand-slate leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-brand-slate mt-auto pt-3 border-t border-brand-border">
                  <span>{post.date}</span>
                  <span className="text-brand-rose font-medium">{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Newsletter Signup ─────────────────────────────────────── */}
        <div className="mt-14 bg-gradient-to-br from-brand-blush to-white rounded-2xl border border-brand-border p-7 sm:p-10 text-center max-w-2xl mx-auto">
          <div className="text-4xl mb-3">💌</div>
          <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">
            Naye Blog Posts Sabse Pehle Pao
          </h2>
          <p className="font-sans text-sm text-brand-slate mb-5">
            WhatsApp pe hume &ldquo;BLOG&rdquo; bhejo aur jab bhi naya article aaye — seedha aapke phone pe pahuchega! 📱
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("BLOG — Mujhe Ranique ke naye blog posts WhatsApp pe chahiye! 🌸")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm"
          >
            Subscribe via WhatsApp
          </a>
        </div>

      </div>
    </>
  );
}
