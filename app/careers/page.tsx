import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers at Ranique | Join Our Team — Work from Anywhere in India",
  description:
    "Join the Ranique family! We're hiring passionate people from across India — Tier 2, Tier 3 cities and villages welcome. Work from home opportunities available. Apply via WhatsApp.",
  keywords: ["Ranique careers", "jobs in India", "work from home India", "fashion jobs India", "Tier 2 city jobs", "women jobs India", "Jaipur jobs"],
  openGraph: {
    title: "Careers at Ranique | Join Our Team",
    description: "Passionate about fashion & beauty? Join Ranique. Work-from-home roles open for people across India.",
    type: "website",
    locale: "en_IN",
  },
};

const WA_NUMBER = "919288467633";

const PERKS = [
  { emoji: "🏠", title: "Work from Home", desc: "Chahe aap Jaipur mein hon ya kisi chhote gaon mein — ghar se kaam karo. Internet aur phone kaafi hai!" },
  { emoji: "💰", title: "Fair & Timely Pay", desc: "Salary time pe, every month. Performance bonuses bhi milte hain. Hum hamesha transparent hain." },
  { emoji: "📈", title: "Grow with Us", desc: "Startup hai, toh grow karne ka mauka bhi hai. Aaj ka team member, kal ka manager — yahi hamari soch hai." },
  { emoji: "👩‍💼", title: "Women-First Culture", desc: "Ranique mein majority women hain. Safe, supportive, aur inspiring environment guaranteed." },
  { emoji: "🎓", title: "Seekhne Ka Mauka", desc: "E-commerce, social media, fashion — ye sab seekhne ko milega. Experience chahiye ya nahin, seekhao hum." },
  { emoji: "🌸", title: "Staff Discounts", desc: "Team members ko Ranique products pe exclusive discounts milti hain. Kya baat hai! 💕" },
];

const OPENINGS = [
  {
    id: "social-media",
    title: "Social Media Executive",
    type: "Full-time / Part-time",
    location: "Work from Home (Anywhere in India)",
    salary: "₹8,000 – ₹18,000 / month",
    description:
      "Instagram Reels banana, content plan karna, aur Ranique ki online presence grow karna. Agar aap social media pe active hain aur fashion pasand hai — ye role aapke liye hai!",
    requirements: ["Instagram ka achha knowledge", "Basic editing (CapCut / Canva chalega)", "Creative thinking", "Hindi + basic English"],
    waMsg: "Hii Ranique! 🌸 Mujhe Social Media Executive role ke liye apply karna hai.",
  },
  {
    id: "customer-support",
    title: "Customer Support Executive",
    type: "Full-time",
    location: "Work from Home (Anywhere in India)",
    salary: "₹7,000 – ₹14,000 / month",
    description:
      "WhatsApp, Instagram DMs aur email pe customers ke sawaalon ka jawab dena, orders track karna, aur unhe happy rakhna. Agar aap logon se baat karna pasand karte hain — ye aapke liye perfect hai!",
    requirements: ["Good communication (Hindi + basic English)", "Patience aur politeness", "Smartphone with good internet", "Availability: 10 AM–7 PM"],
    waMsg: "Hii Ranique! 🌸 Mujhe Customer Support Executive role ke liye apply karna hai.",
  },
  {
    id: "reseller",
    title: "Ranique Reseller / Affiliate",
    type: "Freelance / Commission-based",
    location: "Anywhere in India",
    salary: "₹5,000 – ₹30,000+ / month (commission)",
    description:
      "Apne sheher mein Ranique products sell karo — ghar baith ke! Apni existing network use karo aur har sale pe attractive commission kamao. No investment required.",
    requirements: ["Active WhatsApp / Instagram", "Thoda bhi social network", "Sales mein interest", "Any city, any village — sab welcome!"],
    waMsg: "Hii Ranique! 🌸 Mujhe Reseller / Affiliate program join karna hai.",
  },
  {
    id: "content-creator",
    title: "Content Creator / Brand Ambassador",
    type: "Part-time / Freelance",
    location: "Work from Home",
    salary: "₹3,000 – ₹20,000 / month + free products",
    description:
      "Ranique products use karo, videos aur photos banao, apne followers ko batao — aur earn karo! Aapke paas zyada followers hone ki zaroorat nahi — genuine content kaafi hai.",
    requirements: ["Phone camera theek ho", "Genuinely products pasand ho", "Content banana aata ho (beginner bhi apply kar sakte hain)", "Any social platform"],
    waMsg: "Hii Ranique! 🌸 Mujhe Content Creator / Brand Ambassador banna hai.",
  },
];

const structuredData = OPENINGS.map((job) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: job.title,
  description: job.description,
  hiringOrganization: { "@type": "Organization", name: "Ranique", sameAs: "https://ranique.in" },
  jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "IN" } },
  employmentType: job.type.toUpperCase().replace(/ \/ /g, "_"),
  baseSalary: { "@type": "MonetaryAmount", currency: "INR" },
  datePosted: "2025-01-01",
}));

export default function CareersPage() {
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
            We&apos;re Hiring
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-ink leading-tight mb-6">
            Ranique Family Mein{" "}
            <em className="not-italic text-brand-rose">Shaamil Ho Jao</em>
          </h1>
          <p className="font-sans text-base sm:text-lg text-brand-slate max-w-2xl mx-auto leading-relaxed mb-8">
            Hum ek growing Indian brand hain — aur hume chahiye passionate log jo humari journey ka hissa banein. Bade sheher ki zaroorat nahi, ghar se kaam ho sakta hai! 🌸
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#openings"
              className="inline-flex items-center h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm"
            >
              Open Positions Dekho
            </a>
            <Link
              href="/about"
              className="inline-flex items-center h-12 px-8 rounded-full border border-brand-border bg-white text-brand-ink font-sans font-semibold text-sm hover:border-brand-rose hover:text-brand-rose active:scale-95 transition-all"
            >
              About Ranique
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Work With Us ─────────────────────────────────────────── */}
      <section className="bg-brand-mist py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
              Why Ranique?
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
              Yahaan Kaam Karna Alag Kyun Hai
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERKS.map((perk) => (
              <div key={perk.title} className="bg-white rounded-2xl border border-brand-border shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">{perk.emoji}</div>
                <h3 className="font-serif text-base font-semibold text-brand-ink mb-2">{perk.title}</h3>
                <p className="font-sans text-xs text-brand-slate leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Positions ───────────────────────────────────────────── */}
      <section id="openings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
            {OPENINGS.length} Positions Open
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
            Current Openings
          </h2>
          <p className="font-sans text-sm text-brand-slate mt-2">
            Apply karo — seedha WhatsApp pe. No CV format ki tension, bas honestly batao.
          </p>
        </div>

        <div className="space-y-5">
          {OPENINGS.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-brand-border shadow-card p-6 sm:p-7 hover:shadow-card-hover transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-rose text-[10px] font-semibold uppercase tracking-wide">
                      {job.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-gold-light text-brand-ink text-[10px] font-semibold">
                      {job.location}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-brand-ink mb-1">{job.title}</h3>
                  <p className="font-sans text-sm font-bold text-brand-rose mb-3">{job.salary}</p>
                  <p className="font-sans text-sm text-brand-slate leading-relaxed mb-4">{job.description}</p>
                  <div>
                    <p className="font-sans text-xs font-semibold text-brand-ink mb-2 uppercase tracking-wide">Requirements:</p>
                    <ul className="space-y-1">
                      {job.requirements.map((r) => (
                        <li key={r} className="flex items-start gap-2 font-sans text-xs text-brand-slate">
                          <span className="text-brand-rose mt-0.5">✓</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="shrink-0">
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(job.waMsg)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm whitespace-nowrap"
                  >
                    Apply on WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── General Application CTA ──────────────────────────────────── */}
      <section className="bg-brand-ink py-14 text-center">
        <div className="max-w-xl mx-auto px-4">
          <p className="font-sans text-xs text-white/40 uppercase tracking-widest mb-3">Can&apos;t find your role?</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3">
            General Application Bhejo
          </h2>
          <p className="font-sans text-sm text-white/60 mb-7">
            Koi specific role nahi dikh raha? Koi baat nahi — apna intro WhatsApp pe bhejo aur batao ki tum Ranique ke liye kya kar sakte ho!
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hii Ranique! 🌸 Mujhe aapki team mein join karna hai. Mera naam hai... aur main ye kar sakta/sakti hoon...")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm"
          >
            Apna Intro Bhejo
          </a>
        </div>
      </section>
    </>
  );
}
