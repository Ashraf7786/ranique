import { Product } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  // ── COSMETICS ────────────────────────────────────────────────
  {
    id: "cos-001",
    slug: "velvet-rose-lip-serum",
    name: "Velvet Rose Lip Serum",
    brand: "Maison Lumière",
    category: "cosmetics",
    price: 42,
    compareAtPrice: 58,
    currency: "INR",
    rating: 4.8,
    reviewCount: 312,
    badge: "BESTSELLER",
    images: [
      { src: "/images/lip-serum-1.jpg", alt: "Velvet Rose Lip Serum front" },
      { src: "/images/lip-serum-2.svg", alt: "Velvet Rose Lip Serum texture" },
      { src: "/images/lip-serum-3.svg", alt: "Velvet Rose Lip Serum swatch" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Rosewood", hex: "#8B4A5A", stock: 15 },
        { id: "c2", label: "Petal Pink", hex: "#E8A0B4", stock: 8 },
        { id: "c3", label: "Nude Champagne", hex: "#D4A882", stock: 12 },
        { id: "c4", label: "Berry Glam", hex: "#6B2D5E", stock: 3 },
      ],
    },
    description:
      "A luxurious, plumping lip serum enriched with hyaluronic acid and rosa damascena extract. Delivers 72-hour hydration with a buildable velvet finish that never feels heavy.",
    details: [
      "Key ingredients: Hyaluronic Acid, Rosa Damascena, Vitamin E",
      "Vegan & cruelty-free certified",
      "Dermatologist tested",
      "Net weight: 5ml",
      "Shelf life: 24 months after opening",
    ],
    shipping:
      "Free standard shipping on orders over ₹3999. Express (2-day) available at checkout. International shipping to 40+ countries.",
    material: "Cosmetic Grade",
    reviews: [
      {
        id: "r1", author: "Sophia M.", rating: 5, date: "2025-11-12",
        body: "Absolutely love this! My lips feel so soft and the color is gorgeous.",
        verified: true,
      },
      {
        id: "r2", author: "Isabelle K.", rating: 5, date: "2025-10-28",
        body: "The rosewood shade is stunning and the hydration lasts all day.",
        verified: true,
      },
    ],
  },
  {
    id: "cos-002",
    slug: "golden-glow-highlighter",
    name: "Golden Glow Highlighter",
    brand: "Éclat Paris",
    category: "cosmetics",
    price: 38,
    currency: "INR",
    rating: 4.6,
    reviewCount: 198,
    badge: "NEW",
    images: [
      { src: "/images/highlighter-1.jpg", alt: "Golden Glow Highlighter palette" },
      { src: "/images/highlighter-2.svg", alt: "Golden Glow Highlighter swatches" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Solar Gold", hex: "#D4AF37", stock: 20 },
        { id: "c2", label: "Rose Quartz", hex: "#F4A7B9", stock: 14 },
        { id: "c3", label: "Moonbeam", hex: "#E8E8E0", stock: 9 },
      ],
    },
    description:
      "Finely milled highlighting powder that melts into skin for an ethereal, lit-from-within radiance. Buildable from subtle sheen to intense luminosity.",
    details: [
      "Finely milled micro-pearls",
      "Long-wearing formula — up to 12 hours",
      "Fragrance-free, suitable for sensitive skin",
      "Net weight: 8g",
    ],
    shipping: "Free standard shipping on orders over ₹3999. Express available.",
    material: "Pressed Powder",
  },
  {
    id: "cos-003",
    slug: "midnight-orchid-perfume",
    name: "Midnight Orchid Eau de Parfum",
    brand: "Fleur Noir",
    category: "cosmetics",
    price: 128,
    compareAtPrice: 160,
    currency: "INR",
    rating: 4.9,
    reviewCount: 547,
    badge: "LIMITED",
    images: [
      { src: "/images/perfume-1.svg", alt: "Midnight Orchid Perfume bottle" },
      { src: "/images/perfume-2.svg", alt: "Midnight Orchid Perfume lifestyle" },
    ],
    variants: {
      sizes: [
        { id: "s1", label: "30ml", stock: 25 },
        { id: "s2", label: "50ml", stock: 18 },
        { id: "s3", label: "100ml", stock: 7 },
      ],
    },
    description:
      "An intoxicating floral oriental with top notes of black orchid and bergamot, heart of jasmine and peony, and a warm base of sandalwood and amber.",
    details: [
      "Top: Black Orchid, Bergamot",
      "Heart: Jasmine, Peony, Iris",
      "Base: Sandalwood, Amber, Musk",
      "Long-lasting: 8–12 hour sillage",
      "Cruelty-free",
    ],
    shipping: "Fragrance ships ground only (domestic). Gift packaging available.",
    material: "Fine Fragrance",
  },

  // ── ACCESSORIES ──────────────────────────────────────────────
  {
    id: "acc-001",
    slug: "pearl-drop-earrings",
    name: "Pearl Drop Earrings",
    brand: "Lumina Jewels",
    category: "accessories",
    price: 64,
    currency: "INR",
    rating: 4.7,
    reviewCount: 243,
    badge: "BESTSELLER",
    images: [
      { src: "/images/earrings-1.jpg", alt: "Pearl Drop Earrings front" },
      { src: "/images/earrings-2.svg", alt: "Pearl Drop Earrings worn" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "White Gold", hex: "#E8E8D0", stock: 12 },
        { id: "c2", label: "Rose Gold", hex: "#B76E79", stock: 8 },
        { id: "c3", label: "Yellow Gold", hex: "#C9A96E", stock: 5 },
      ],
    },
    description:
      "Effortlessly elegant freshwater pearl drops set in 18k gold-plated sterling silver. Hypoallergenic posts, perfect for sensitive ears.",
    details: [
      "8mm freshwater pearl",
      "18k gold-plated 925 sterling silver",
      "Hypoallergenic",
      "Length: 3.5cm drop",
      "Presented in luxury gift box",
    ],
    shipping: "Free shipping & free returns. Gift wrapping available.",
    material: "Sterling Silver / Gold Plated",
  },
  {
    id: "acc-002",
    slug: "silk-floral-headband",
    name: "Silk Floral Headband",
    brand: "Atelier Bloom",
    category: "accessories",
    price: 29,
    currency: "INR",
    rating: 4.5,
    reviewCount: 88,
    badge: "NEW",
    images: [
      { src: "/images/headband-1.svg", alt: "Silk Floral Headband" },
      { src: "/images/headband-2.svg", alt: "Silk Floral Headband worn" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Ivory", hex: "#FFFFF0", stock: 20 },
        { id: "c2", label: "Blush Pink", hex: "#FFB6C1", stock: 15 },
        { id: "c3", label: "Sage", hex: "#9DC183", stock: 10 },
        { id: "c4", label: "Mauve", hex: "#D4A5A5", stock: 7 },
      ],
    },
    description:
      "Handcrafted silk floral headband featuring hand-tied blooms. A romantic accent for any occasion — from brunch to weddings.",
    details: [
      "100% mulberry silk flowers",
      "Padded velvet interior lining",
      "One-size fits all with flexible frame",
      "Hand wash only",
    ],
    shipping: "Standard shipping 3–5 business days.",
    material: "Silk",
  },
  {
    id: "acc-003",
    slug: "tortoise-sunglasses",
    name: "Tortoise Oversized Sunglasses",
    brand: "Soleil Studio",
    category: "accessories",
    price: 85,
    compareAtPrice: 110,
    currency: "INR",
    rating: 4.6,
    reviewCount: 174,
    images: [
      { src: "/images/sunglasses-1.svg", alt: "Tortoise Sunglasses front" },
      { src: "/images/sunglasses-2.svg", alt: "Tortoise Sunglasses side profile" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Classic Tortoise", hex: "#8B5E3C", stock: 18 },
        { id: "c2", label: "Black", hex: "#1A1A1A", stock: 22 },
        { id: "c3", label: "Warm Honey", hex: "#DAA520", stock: 9 },
      ],
    },
    description:
      "Glamorous oversized frames with UV400 polarized lenses. Lightweight acetate construction with spring hinges for all-day comfort.",
    details: [
      "UV400 polarized lenses",
      "Premium acetate frame",
      "Spring hinges",
      "Includes microfiber pouch and hard case",
    ],
    shipping: "Free shipping on orders over ₹5999.",
    material: "Acetate",
  },

  // ── BANGLES ──────────────────────────────────────────────────
  {
    id: "ban-001",
    slug: "rose-gold-twisted-bangle",
    name: "Rose Gold Twisted Bangle",
    brand: "Lumina Jewels",
    category: "bangles",
    price: 78,
    currency: "INR",
    rating: 4.8,
    reviewCount: 329,
    badge: "BESTSELLER",
    images: [
      { src: "/images/bangle-rose-1.jpg", alt: "Rose Gold Twisted Bangle" },
      { src: "/images/bangle-rose-2.svg", alt: "Rose Gold Twisted Bangle wrist" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Rose Gold", hex: "#B76E79", stock: 14 },
        { id: "c2", label: "Silver", hex: "#C0C0C0", stock: 11 },
        { id: "c3", label: "Gold", hex: "#C9A96E", stock: 8 },
      ],
      sizes: [
        { id: "s1", label: "XS (56mm)", stock: 6 },
        { id: "s2", label: "S (58mm)", stock: 12 },
        { id: "s3", label: "M (60mm)", stock: 9 },
        { id: "s4", label: "L (62mm)", stock: 4 },
      ],
    },
    description:
      "A beautifully twisted bangle in 18k rose gold-plated brass. Wearable stacked or solo — a timeless everyday staple.",
    details: [
      "18k rose gold-plated brass",
      "Nickel-free, hypoallergenic",
      "Width: 4mm",
      "Presented in satin pouch",
    ],
    shipping: "Free shipping & returns on all jewelry.",
    material: "Gold Plated Brass",
  },
  {
    id: "ban-002",
    slug: "crystal-cuff-bangle",
    name: "Crystal Encrusted Cuff",
    brand: "Opulent",
    category: "bangles",
    price: 145,
    compareAtPrice: 195,
    currency: "INR",
    rating: 4.9,
    reviewCount: 91,
    badge: "SALE",
    images: [
      { src: "/images/bangle-crystal-1.svg", alt: "Crystal Cuff Bangle" },
      { src: "/images/bangle-crystal-2.svg", alt: "Crystal Cuff Bangle close-up" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Clear Crystal", hex: "#E8F0FE", stock: 10 },
        { id: "c2", label: "Rose Crystal", hex: "#FFB6C1", stock: 6 },
        { id: "c3", label: "Champagne", hex: "#F7E7CE", stock: 4 },
      ],
    },
    description:
      "An opulent statement cuff paved with Swarovski-grade crystals. Hand-set in rhodium-plated brass — catches the light from every angle.",
    details: [
      "Hand-set crystal pavé",
      "Rhodium-plated brass",
      "Adjustable open-cuff design",
      "Width: 18mm",
    ],
    shipping: "Complimentary express shipping on all Opulent pieces.",
    material: "Rhodium Plated Brass / Crystal",
  },
  {
    id: "ban-003",
    slug: "enamel-floral-bangle",
    name: "Enamel Floral Bangle Set",
    brand: "Bloom & Brass",
    category: "bangles",
    price: 52,
    currency: "INR",
    rating: 4.4,
    reviewCount: 156,
    badge: "NEW",
    images: [
      { src: "/images/bangle-enamel-1.svg", alt: "Enamel Floral Bangle Set" },
      { src: "/images/bangle-enamel-2.svg", alt: "Enamel Floral Bangle worn" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Coral & Gold", hex: "#FF6B6B", stock: 15 },
        { id: "c2", label: "Turquoise & Gold", hex: "#40E0D0", stock: 12 },
        { id: "c3", label: "Ivory & Rose", hex: "#FFFFF0", stock: 9 },
      ],
    },
    description:
      "A set of 3 hand-painted enamel bangles with intricate floral motifs. Perfect for stacking or gifting.",
    details: [
      "Set of 3 bangles",
      "Hand-painted enamel on brass",
      "Width: 6mm each",
      "Gift boxed",
    ],
    shipping: "Standard 3–5 business days. Gift wrapping available.",
    material: "Enamel / Brass",
  },

  // ── PURSES ───────────────────────────────────────────────────
  {
    id: "pur-001",
    slug: "velvet-evening-clutch",
    name: "Velvet Evening Clutch",
    brand: "Maison Aurel",
    category: "purses",
    price: 168,
    compareAtPrice: 220,
    currency: "INR",
    rating: 4.8,
    reviewCount: 203,
    badge: "SALE",
    images: [
      { src: "/images/clutch-1.jpg", alt: "Velvet Evening Clutch front" },
      { src: "/images/clutch-2.svg", alt: "Velvet Evening Clutch interior" },
      { src: "/images/clutch-3.svg", alt: "Velvet Evening Clutch carried" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Midnight Navy", hex: "#1B2A4A", stock: 8 },
        { id: "c2", label: "Burgundy", hex: "#722F37", stock: 6 },
        { id: "c3", label: "Emerald", hex: "#2D5A27", stock: 5 },
        { id: "c4", label: "Blush", hex: "#F4C2C2", stock: 10 },
      ],
    },
    description:
      "An exquisite evening clutch in luxurious Italian velvet. Gold-tone frame clasp, detachable chain strap, and full satin lining with interior slip pocket.",
    details: [
      "Italian crushed velvet exterior",
      "Gold-tone brass frame",
      "Detachable 120cm chain strap",
      "Full satin lining with interior pocket",
      "Dimensions: 22cm × 12cm × 5cm",
    ],
    shipping: "Complimentary express shipping. 30-day returns.",
    material: "Velvet / Brass",
  },
  {
    id: "pur-002",
    slug: "mini-quilted-crossbody",
    name: "Mini Quilted Crossbody",
    brand: "Petit Luxe",
    category: "purses",
    price: 245,
    currency: "INR",
    rating: 4.7,
    reviewCount: 388,
    badge: "BESTSELLER",
    images: [
      { src: "/images/crossbody-1.jpg", alt: "Mini Quilted Crossbody front" },
      { src: "/images/crossbody-2.svg", alt: "Mini Quilted Crossbody detail" },
      { src: "/images/crossbody-3.svg", alt: "Mini Quilted Crossbody worn" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Warm Beige", hex: "#C8B89A", stock: 12 },
        { id: "c2", label: "Classic Black", hex: "#1A1A1A", stock: 20 },
        { id: "c3", label: "Dusty Rose", hex: "#C9748A", stock: 9 },
        { id: "c4", label: "Chocolate", hex: "#4A2C17", stock: 6 },
      ],
    },
    description:
      "Icon meets everyday luxury. Diamond-quilted lambskin leather with 24k gold-tone hardware. Adjustable chain strap — wear as crossbody or shoulder.",
    details: [
      "Diamond-quilted lambskin leather",
      "24k gold-plated hardware",
      "Adjustable chain strap (60–120cm)",
      "Magnetic snap closure",
      "Interior: zip pocket + card slots",
      "Dimensions: 18cm × 14cm × 6cm",
    ],
    shipping: "Complimentary worldwide express shipping on all Petit Luxe orders.",
    material: "Lambskin Leather",
  },
  {
    id: "pur-003",
    slug: "woven-straw-tote",
    name: "Woven Straw Tote",
    brand: "Côte Soleil",
    category: "purses",
    price: 92,
    currency: "INR",
    rating: 4.5,
    reviewCount: 117,
    badge: "NEW",
    images: [
      { src: "/images/tote-1.svg", alt: "Woven Straw Tote front" },
      { src: "/images/tote-2.svg", alt: "Woven Straw Tote detail" },
    ],
    variants: {
      colors: [
        { id: "c1", label: "Natural", hex: "#D4B896", stock: 18 },
        { id: "c2", label: "Black Trim", hex: "#1A1A1A", stock: 14 },
        { id: "c3", label: "Rose Trim", hex: "#C9748A", stock: 11 },
      ],
    },
    description:
      "Artisan-woven natural seagrass tote with genuine leather trim handles. Roomy interior with canvas lining and zip pocket.",
    details: [
      "Handwoven natural seagrass",
      "Genuine leather handles",
      "Canvas lining with zip interior pocket",
      "Dimensions: 38cm × 30cm × 14cm",
      "Spot clean only",
    ],
    shipping: "Standard shipping 3–5 business days.",
    material: "Seagrass / Leather",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "cosmetics", label: "Cosmetics", emoji: "💄" },
  { id: "accessories", label: "Accessories", emoji: "💎" },
  { id: "bangles", label: "Bangles", emoji: "📿" },
  { id: "purses", label: "Purses", emoji: "👜" },
] as const;

export const BRANDS = [
  "Maison Lumière",
  "Éclat Paris",
  "Fleur Noir",
  "Lumina Jewels",
  "Atelier Bloom",
  "Soleil Studio",
  "Opulent",
  "Bloom & Brass",
  "Maison Aurel",
  "Petit Luxe",
  "Côte Soleil",
];

export const MATERIALS = [
  "Sterling Silver",
  "Gold Plated",
  "Lambskin Leather",
  "Velvet",
  "Silk",
  "Brass",
  "Acetate",
];
