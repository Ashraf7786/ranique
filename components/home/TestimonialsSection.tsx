"use client";

import { useState, useRef, useEffect } from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    avatar: "PS",
    avatarBg: "from-[#C9748A] to-[#A85970]",
    product: "Rose Glow Lip Serum",
    review:
      "Yaar ye lip serum toh kamaal ka hai! 😍 Maine pehle socha tha ki itna costly kyun hai, but trust me — bilkul paisa vasool! Lips itne soft ho gaye hain, aur glow bhi aata hai. Meri saheliyaan bhi order kar rahi hain ab!",
    verified: true,
  },
  {
    id: 2,
    name: "Sunita Devi",
    location: "Jaipur, Rajasthan",
    rating: 5,
    avatar: "SD",
    avatarBg: "from-[#C9A96E] to-[#B8882A]",
    product: "Gold Crystal Bangles",
    review:
      "बहुत ही सुंदर चूड़ियाँ हैं! शादी में पहनकर गई तो सबने पूछा कहाँ से लिया। सोने जैसी चमक है और बहुत हल्की भी हैं। पैकेजिंग भी बहुत अच्छी थी, बिल्कुल gift जैसी। Ranique se bahut khush hoon! ⭐⭐⭐⭐⭐",
    verified: true,
  },
  {
    id: 3,
    name: "Roshni Patel",
    location: "Surat, Gujarat",
    rating: 5,
    avatar: "RP",
    avatarBg: "from-[#8B9DB8] to-[#6B7DA8]",
    product: "Velvet Crossbody Purse",
    review:
      "Omg this purse is EVERYTHING! College ke liye perfect size hai aur velvet material toh ekdum premium feel deta hai. Delivery bhi 2 din mein aa gayi — I was shocked! Definitely mera favourite online store ban gaya hai Ranique. 💜",
    verified: true,
  },
  {
    id: 4,
    name: "Meenakshi Iyer",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    avatar: "MI",
    avatarBg: "from-[#C9748A] to-[#C9A96E]",
    product: "Pearl Drop Earrings",
    review:
      "इतनी सुंदर बालियाँ! मैंने अपनी बेटी की सगाई के लिए खरीदी थीं। सबने तारीफ की। Quality देखकर लगा hi नहीं कि इतने कम दाम में मिली हैं। बिल्कुल असली मोतियों जैसी लगती हैं। Next order already kar diya hai! 🙏",
    verified: true,
  },
  {
    id: 5,
    name: "Anjali Verma",
    location: "Lucknow, UP",
    rating: 5,
    avatar: "AV",
    avatarBg: "from-[#A85970] to-[#8B4560]",
    product: "Illuminating Highlighter",
    review:
      "Bhai kya highlighter hai yaar! 😭✨ Skin pe lagao toh literally glow karna shuru ho jaati ho. Office mein meri colleague ne pucha 'kya tum facials karwa ke aati ho?' — maine sirf ye highlighter lagaya tha lol. Ranique is QUEEN!",
    verified: true,
  },
  {
    id: 6,
    name: "Kavita Rajput",
    location: "Bhopal, MP",
    rating: 5,
    avatar: "KR",
    avatarBg: "from-[#C9A96E] to-[#C9748A]",
    product: "Embroidered Tote Bag",
    review:
      "बैग देखकर दिल खुश हो गया! 😊 कढ़ाई का काम इतना बारीक है — लगता है किसी कारीगर ने हाथ से बनाया हो। Size भी बड़ा है, office का सारा सामान आ जाता है। दाम भी वाजिब हैं। पक्का फिर से मँगाऊँगी!",
    verified: true,
  },
  {
    id: 7,
    name: "Divya Nair",
    location: "Kochi, Kerala",
    rating: 5,
    avatar: "DN",
    avatarBg: "from-[#C9748A] to-[#8B9DB8]",
    product: "Rose Gold Headband",
    review:
      "Yeh headband toh meri bestie ban gayi hai 😂 Har outfit ke saath match ho jaata hai. College, parties, everywhere I wear it. Quality ekdum top-notch hai aur itne affordable price mein? Ranique you are amazing! Will always shop from here. 🌹",
    verified: true,
  },
  {
    id: 8,
    name: "Fatima Siddiqui",
    location: "Hyderabad, Telangana",
    rating: 5,
    avatar: "FS",
    avatarBg: "from-[#8B9DB8] to-[#A85970]",
    product: "Premium Fragrance Mist",
    review:
      "Mashallah kya fragrance hai! 🌸 Subah lagao toh shaam tak rehta hai. Itni meheki rehti hoon ki log poochte hain 'kaunsa perfume hai?' — bada wala flaunt moment hota hai. Packaging gift dene ke liye perfect hai. 5 stars se bhi zyada dena chahti hoon!",
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "text-brand-gold fill-brand-gold" : "text-brand-border"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[0] }) {
  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[340px] bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-brand-border group hover:-translate-y-1">
      {/* Quote icon */}
      <div className="mb-4">
        <Quote className="w-7 h-7 text-brand-rose opacity-30" strokeWidth={1.5} />
      </div>

      {/* Review text */}
      <p className="font-sans text-sm text-brand-slate leading-relaxed mb-5 line-clamp-4">
        {testimonial.review}
      </p>

      {/* Product badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blush text-brand-rose text-xs font-medium mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
        {testimonial.product}
      </div>

      {/* Footer: avatar + name + stars */}
      <div className="flex items-center justify-between pt-4 border-t border-brand-border">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${testimonial.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}
          >
            {testimonial.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-sans font-semibold text-sm text-brand-ink">{testimonial.name}</p>
              {testimonial.verified && (
                <span title="Verified Purchase">
                  <svg className="w-3.5 h-3.5 text-brand-rose" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 6.5l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.44-3.44a.75.75 0 111.06 1.06z" />
                  </svg>
                </span>
              )}
            </div>
            <p className="font-sans text-xs text-brand-slate">{testimonial.location}</p>
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>
    </div>
  );
}

export function TestimonialsSection({ dynamicTestimonials = [] }: { dynamicTestimonials?: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Map dynamic testimonials to match the expected format
  const mappedDynamic = dynamicTestimonials.map((t, idx) => {
    // Generate random but deterministic colors based on ID length or index
    const bgs = [
      "from-[#C9748A] to-[#A85970]",
      "from-[#C9A96E] to-[#B8882A]",
      "from-[#8B9DB8] to-[#6B7DA8]",
      "from-[#A85970] to-[#8B4560]"
    ];
    return {
      id: t.id,
      name: t.name,
      location: t.city || "India",
      rating: t.rating,
      avatar: t.name.substring(0, 2).toUpperCase(),
      avatarBg: bgs[idx % bgs.length],
      product: t.product || "Ranique Customer",
      review: t.content,
      verified: true,
    };
  });

  // Use dynamic if we have any, otherwise fallback to hardcoded
  const activeTestimonials = mappedDynamic.length > 0 ? mappedDynamic : TESTIMONIALS;

  // Duplicate for seamless infinite scroll
  const items = [...activeTestimonials, ...activeTestimonials];

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth / 2; // half because we duplicated
        if (scrollLeft >= maxScroll) {
          scrollRef.current.scrollTo({ left: 0, behavior: "instant" });
        } else {
          scrollRef.current.scrollBy({ left: 1, behavior: "instant" });
        }
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section
      aria-label="Customer testimonials"
      className="py-14 overflow-hidden bg-gradient-to-br from-brand-blush/60 via-white to-brand-gold-light/30"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rose animate-pulse" />
              Loved by Customers
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
              What Our Customers Say
            </h2>
            <p className="font-sans text-sm text-brand-slate mt-1">
              Real reviews from real customers who love Ranique
            </p>
          </div>

          {/* Overall rating summary */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-card border border-brand-border shrink-0">
            <div className="text-center">
              <p className="font-serif text-3xl font-bold text-brand-ink leading-none">4.9</p>
              <StarRating rating={5} />
              <p className="font-sans text-xs text-brand-slate mt-1">500+ reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling cards */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-[#fdf5f0] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-[#f8f0e8] to-transparent" />

        <div
          ref={scrollRef}
          className="flex gap-4 px-4 sm:px-8 pb-4 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((testimonial, i) => (
            <TestimonialCard key={`${testimonial.id}-${i}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
