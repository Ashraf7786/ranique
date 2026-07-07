import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const WA_NUMBER = "919288467633";

const ALL_POSTS = [
  {
    slug: "best-lip-serums-under-500-rupees",
    category: "Beauty & Skincare",
    emoji: "💄",
    title: "Best Lip Serums Under ₹500 — Ranique Picks for Every Budget",
    excerpt: "Acche lip serum ke liye haazar rupaye kharach karne ki zaroorat nahi. Ye hain humare top picks jo ₹200–₹500 mein milte hain aur ekdum kamaal ka result dete hain!",
    readTime: "5 min read",
    date: "June 28, 2025",
    tag: "Budget Friendly",
    author: "Priya Mehta, Head of Product Curation",
    content: [
      {
        heading: "Lip Serum Kya Hota Hai?",
        body: "Lip serum ek lightweight formula hota hai jo lips ko deeply moisturise karta hai, pigmentation kam karta hai, aur soft aur plump banata hai. Ye lip balm se zyada effective hota hai kyunki isme active ingredients hote hain.",
      },
      {
        heading: "Ranique Ke Top 3 Picks — ₹500 Se Kam Mein",
        body: "1. **Rose Glow Lip Serum (₹299)** — Humare bestseller! Rose extract aur hyaluronic acid se bana ye serum ek hi hafte mein lips ko soft bana deta hai.\n\n2. **Honey & Vitamin E Lip Serum (₹249)** — Raat ko lagao, subah lips ekdum baby soft milenge. Dry lips ke liye best hai.\n\n3. **Tinted Berry Serum (₹349)** — Thoda sa color bhi, moisture bhi. Roshan lips ke liye perfect — office aur college dono ke liye.",
      },
      {
        heading: "Lip Serum Kaise Lagayein?",
        body: "Raat ko sone se pehle clean lips pe ek drop lagao aur halke haath se massage karo. Subah aap farq khud mehsoos karenge. Din mein bhi lagaya ja sakta hai — lipstick ke neeche base ke roop mein.",
      },
      {
        heading: "Kya COD Pe Milega?",
        body: "Haan! Ranique ke sabhi products COD pe available hain — ghar baithe order karo, aane pe pay karo. Delivery pan-India hoti hai — chhote sheher, town, gaon — everywhere! Delivery 4–7 working days mein hoti hai.",
      },
      {
        heading: "Order Kaise Karein?",
        body: "Simply WhatsApp karo +91 92884 67633 pe — product name aur apna address bhejo, aur hum process kar denge. Asaan hai, fast hai! 🌸",
      },
    ],
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
    author: "Rania Kapoor, Founder",
    content: [
      {
        heading: "Bangles — India Ki Pehchaan",
        body: "Bangles sirf jewellery nahi hain — ye ek tradition hain, ek feeling hain. Haath pe ek bangle pehenke bhi aap complete feel karti hain. Aur agar sahi style kiya jaaye, toh ye aapki puri personality badal dete hain.",
      },
      {
        heading: "Look 1 — Office Ready: Minimal Stacking",
        body: "2–3 thin gold bangles ek haath pe, doosra haath khali. Simple kurti ya formal shirt ke saath. Professional bhi dikhega, traditional bhi.",
      },
      {
        heading: "Look 2 — College Casual: Mixed Metal Mix",
        body: "Gold aur silver bangles mix karo — ye trend ab India mein bahut popular hai. Jeans-kurta ke saath perfect lagta hai. 5–6 thin bangles mixed — effortless aur cool!",
      },
      {
        heading: "Look 3 — Shaadi/Function: Full Stack Glam",
        body: "Dono haathon pe glass aur metal bangles full stack karo. Saree ya lehenga ke saath ye look toh ekdum shaahi lagta hai. Rang match karo dupatte se.",
      },
      {
        heading: "Look 4 — Daily Wear: One Statement Bangle",
        body: "Ek thick gold-plated bangle, baki kuch nahi. Yahi simple look sometimes sabse zyada attention leta hai. Salwar suit ya simple kurti ke saath try karo.",
      },
      {
        heading: "Look 5 — Indo-Western: Crystal + Cuff Combo",
        body: "Crystal bangles ke saath ek metal cuff — modern western look ke saath ye combination bohot trendy hai. Jeans aur top ya short kurti ke saath perfect.",
      },
    ],
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
    author: "Priya Mehta, Head of Product Curation",
    content: [
      {
        heading: "Indian Skin Ke Liye Special Care Kyun Chahiye?",
        body: "India ka climate — garmi, humidity, dhool — alag alag regions mein bahut different hai. Tier 2 aur Tier 3 cities mein water quality bhi alag hoti hai. Isliye ek simple, effective routine chahiye jo kisi bhi environment mein kaam kare.",
      },
      {
        heading: "Step 1 — Gentle Cleanser (₹50–₹80)",
        body: "Subah uthke face ko thande paani se dhoye aur mild face wash lagao. Harsh soap use mat karo — ye natural oils cheen leta hai.",
      },
      {
        heading: "Step 2 — Toner (Optional, ₹60–₹100)",
        body: "Rose water ya aloe vera based toner — skin ko hydrate aur fresh rakhta hai. Cotton ball pe lagao, gentle pat karo.",
      },
      {
        heading: "Step 3 — Moisturiser (₹80–₹120)",
        body: "Light gel-based moisturiser oily skin ke liye, cream-based dry skin ke liye. Ye step kabhi skip mat karo — even if you have oily skin!",
      },
      {
        heading: "Step 4 — Sunscreen (₹80–₹150) — MOST IMPORTANT",
        body: "India mein sunscreen mandatory hai. SPF 30+ use karo. Ghar ke andar ho ya bahar — UV rays har jagah hain. Ye skin ko kala hone aur damage hone se bachata hai.",
      },
      {
        heading: "Step 5 — Lip Care (₹50–₹80)",
        body: "Lips ko bhi moisturise karna zaroori hai. Ek good lip serum ya balm lagao. Ranique ka Rose Glow Lip Serum specifically Indian climate ke liye designed hai.",
      },
      {
        heading: "Total Cost: ₹320–₹530",
        body: "Poori morning skincare routine ₹320 se ₹530 mein ho sakti hai — koi zaroori nahi ki kharcha zyada ho. Consistency is key. 30 din follow karo aur farq khud dikhega! 🌸",
      },
    ],
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
    author: "Rania Kapoor, Founder",
    content: [
      {
        heading: "Teej 2025 — Kya Trend Hai Is Saal?",
        body: "Is saal ka trend hai — minimal lekin impactful. Zyada nahi, lekin jo bhi lagao, achhe se lagao. Natural glow, bold bindi, aur ek statement jewellery piece — yahi kaafi hai.",
      },
      {
        heading: "Base Makeup — Natural Glow Ke Liye",
        body: "Tinted moisturiser ya lightweight foundation. Heavy nahi — skin jaisi dikhni chahiye, plastic nahi. Concealer sirf zaroorat ki jagah. Setting powder brush se halka lagao.",
      },
      {
        heading: "Cheeks — Healthy Flush",
        body: "Peach ya pink blush cheeks ke upar halka sa lagao. Cream blush zyada natural dikhta hai. Highlighter nose ki nok pe aur cheekbones pe — Ranique Illuminating Highlighter best hai!",
      },
      {
        heading: "Eyes — Classic Kajal Look",
        body: "Kajal waterline pe — ye India ka evergreen look hai. Aankhen badi aur expressive lagengi. Eyeshadow optional — agar lagana hai toh gold ya copper shade acha lagega.",
      },
      {
        heading: "Lips — Red Ya Deep Pink",
        body: "Teej ke liye red lips ek tradition hai. Matte lipstick ya lip stain jo dinner tak tika rahe. Pehle lip liner lagao — color zyada der taka rahega.",
      },
      {
        heading: "Jewellery — Bangles + Maang Tikka",
        body: "Red aur green glass bangles traditional choice hain. Sone ke kangan bhi perfect hain. Maang tikka simple — zyada heavy mat lo. Nath ya simple jhumka ears mein.",
      },
      {
        heading: "Bindi — The Cherry on Top",
        body: "Round red bindi — teej ka signature. Forehead ke beech mein, eyebrows ke thoda upar. Ye ek simple cheez poori look ko complete kar deti hai.",
      },
    ],
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
    author: "Priya Mehta, Head of Product Curation",
    content: [
      {
        heading: "Right Purse Kyu Zaroori Hai?",
        body: "Purse sirf ek bag nahi — ye aapka daily companion hai. Office mein laptop, market mein samaan, shaadi mein makeup kit — sab kuch isme hi hota hai. Isliye sahi size, sahi material aur sahi look choose karna zaroori hai.",
      },
      {
        heading: "Type 1 — Structured Tote (₹800–₹1,200)",
        body: "Office ke liye best. A4 papers, laptop (14 inch), water bottle sab aata hai. Black ya navy — har outfit ke saath match karta hai.",
      },
      {
        heading: "Type 2 — Sling / Crossbody (₹400–₹800)",
        body: "Market, college, casual outings ke liye. Haath free rehta hai — bahut convenient. Ranique ke velvet crossbody bags ₹599 se shuru hote hain.",
      },
      {
        heading: "Type 3 — Clutch (₹200–₹500)",
        body: "Shaadi, function, date — clutch ek premium feel deta hai. Embroidered ya metallic — haath mein pakad ke chalo, confidence naturally aayega.",
      },
      {
        heading: "Type 4 — Drawstring Pouch (₹150–₹300)",
        body: "Gym, morning walk, ya quick errands ke liye. Light, compact — basics hi jaate hain isme.",
      },
      {
        heading: "Ranique Ka Recommendation",
        body: "Ek versatile tote bag + ek sling bag — ye combination har Indian working woman ke paas honi chahiye. Dono milake ₹1,200–₹1,800 mein aa jaate hain — lifelong investment! 💼",
      },
    ],
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
    author: "Priya Mehta, Head of Product Curation",
    content: [
      {
        heading: "Dark Skin Pe Glow — Bilkul Possible Hai!",
        body: "Bahut baar log sochte hain ki highlighter sirf fair skin pe dikhta hai. Ye bilkul galat hai! Dark aur dusky skin pe highlighter aur bhi zyada stunning lagta hai — bas sahi shade aur technique chahiye.",
      },
      {
        heading: "Sahi Shade Choose Karo",
        body: "Dark skin ke liye: Gold, copper, bronze, aur rose gold shades best hain. White ya silver shades avoid karo — ye ashy aur unnatural lagega. Ranique ka Illuminating Highlighter in golden tones mein aata hai — dark skin ke liye specially curated.",
      },
      {
        heading: "Highlighter Kahan Lagayein?",
        body: "1. Cheekbones ke upar\n2. Nose bridge ke upar (thoda sa)\n3. Brow bone ke neeche\n4. Cupid's bow (upper lip)\n5. Inner corner of eyes\n\nYe 5 points hi kaafi hain ek gorgeous glow ke liye.",
      },
      {
        heading: "Technique — Fan Brush Ya Fingers?",
        body: "Fan brush se highlighter dab karo — zyada blend hoga. Fingers se press karke lagane se zyada intense glow milta hai. Dono try karo — dekho kya better suit karta hai.",
      },
      {
        heading: "Setting Kaise Karein?",
        body: "Highlighter ke baad face pe koi powder mat lagao un areas pe — powder glow ko kill kar deta hai. Setting spray use karo agar longer lasting chahiye.",
      },
      {
        heading: "Ranique Highlighter Kahan Se Order Karein?",
        body: "WhatsApp karo +91 92884 67633 pe. ₹599 mein milta hai, COD available. 🌟",
      },
    ],
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
    author: "Rania Kapoor, Founder",
    content: [
      {
        heading: "Budget Mein Style — Possible Hai!",
        body: "College ka time hai jab style banana hota hai lekin budget tight rehta hai. Good news — accessories sabse cost-effective tarika hai apni look upgrade karne ka. Ek ₹200 ka earring bhi poori outfit badal sakta hai!",
      },
      {
        heading: "Top 10 Must-Have Accessories for College",
        body: "1. **Pearl Drop Earrings (₹199)** — Classy, versatile, har dress ke saath\n2. **Rose Gold Headband (₹149)** — Baalon ko style karo easily\n3. **Thin Stackable Bangles Set (₹249)** — Mix & match karo\n4. **Layered Necklace (₹199)** — Tops aur kurtis dono ke saath\n5. **Mini Tote Bag (₹299)** — Books + water bottle + phone sab aata hai\n6. **Sunglasses (₹199)** — Style + eye protection\n7. **Scrunchie Set (₹99)** — Cute aur practical\n8. **Anklet (₹99)** — Chappals ke saath cute lagta hai\n9. **Beaded Bracelet (₹149)** — Casual OOTD ke liye\n10. **Mini Crossbody Bag (₹349)** — Canteen run ke liye perfect",
      },
      {
        heading: "Total Budget: ₹1,780 — But Start With ₹500",
        body: "Sab ek saath nahi khareedne ki zaroorat nahi. Top 5 se start karo — earrings, headband, bangles, necklace aur tote — ye ₹995 mein aa jaayenge aur kaafi versatile hain.",
      },
      {
        heading: "Order Kaise Karein?",
        body: "Ranique pe sab available hai. COD pe order karo, pocket money aane pe pay karo! WhatsApp: +91 92884 67633 🌸",
      },
    ],
  },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = ALL_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Blog Post Not Found | Ranique" };
  return {
    title: `${post.title} | Ranique Blog`,
    description: post.excerpt,
    keywords: ["Ranique blog", post.category, "Indian beauty tips", "fashion India"],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      locale: "en_IN",
    },
  };
}

export async function generateStaticParams() {
  return ALL_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = ALL_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = ALL_POSTS.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Ranique", url: "https://ranique.in" },
    datePublished: post.date,
    articleSection: post.category,
    inLanguage: "hi-IN",
    keywords: post.tag,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-white to-brand-gold-light/30 py-16">
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Link href="/blog" className="font-sans text-xs text-brand-slate hover:text-brand-rose transition-colors">
              ← Back to Blog
            </Link>
            <span className="text-brand-border">·</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-rose text-xs font-semibold">{post.category}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-brand-ink leading-snug mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs text-brand-slate">
            <span>✍️ {post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* ── Emoji Banner ─────────────────────────────────────────────── */}
      <div className="flex justify-center -mt-2 mb-8">
        <div className="w-20 h-20 rounded-full bg-white border-4 border-brand-blush shadow-card flex items-center justify-center text-4xl">
          {post.emoji}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <article className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        {/* Excerpt / intro */}
        <div className="bg-brand-blush rounded-2xl border border-brand-rose-light p-5 mb-8">
          <p className="font-sans text-sm text-brand-rose-dark leading-relaxed italic">{post.excerpt}</p>
        </div>

        {/* Body sections */}
        <div className="space-y-8">
          {post.content.map((section, i) => (
            <div key={i}>
              <h2 className="font-serif text-lg font-semibold text-brand-ink mb-3">{section.heading}</h2>
              <div className="font-sans text-sm text-brand-slate leading-relaxed space-y-2">
                {section.body.split("\n\n").map((para, j) => (
                  <p key={j} dangerouslySetInnerHTML={{
                    __html: para
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-ink">$1</strong>')
                      .replace(/\n/g, "<br />")
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tag */}
        <div className="mt-8 pt-6 border-t border-brand-border flex items-center gap-2">
          <span className="font-sans text-xs text-brand-slate">Tagged:</span>
          <span className="px-3 py-1 rounded-full bg-brand-blush text-brand-rose text-xs font-semibold">{post.tag}</span>
          <span className="px-3 py-1 rounded-full bg-brand-blush text-brand-rose text-xs font-semibold">{post.category}</span>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-8 bg-gradient-to-br from-brand-blush to-white rounded-2xl border border-brand-border p-6 text-center">
          <p className="font-serif text-base font-semibold text-brand-ink mb-1">Is article ke baare mein koi sawaal hai? 💬</p>
          <p className="font-sans text-xs text-brand-slate mb-4">Ya koi product order karna hai — WhatsApp pe seedha baat karo!</p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hii Ranique! 🌸 Maine aapka blog padha "${post.title}" — mujhe kuch poochna tha...`)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm"
          >
            WhatsApp pe Poochho
          </a>
        </div>
      </article>

      {/* ── Related Posts ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-brand-border bg-brand-mist py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-lg font-semibold text-brand-ink text-center mb-6">Ye Bhi Padho 📖</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-5 flex items-start gap-4"
                >
                  <span className="text-3xl shrink-0">{rp.emoji}</span>
                  <div>
                    <span className="font-sans text-[10px] text-brand-rose font-semibold uppercase tracking-wide">{rp.tag}</span>
                    <h3 className="font-sans text-sm font-semibold text-brand-ink mt-1 group-hover:text-brand-rose transition-colors line-clamp-2">{rp.title}</h3>
                    <p className="font-sans text-xs text-brand-slate mt-1">{rp.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
