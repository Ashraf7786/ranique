"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";
import { useWishlist } from "@/hooks/useWishlist";
import { useEffect, useState } from "react";

const WA_NUMBER = "919288467633";

export default function WishlistClient({ initialProducts }: { initialProducts: Product[] }) {
  const { wishlist, toggle, isWishlisted } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only filter once mounted to avoid hydration mismatch
  const wishlistProducts = mounted
    ? initialProducts.filter((p) => isWishlisted(p.id))
    : [];

  const shareOnWhatsApp = () => {
    const names = wishlistProducts.map((p) => `• ${p.name} — ₹${p.price}`).join("\n");
    const msg = encodeURIComponent(
      `Hii Ranique! 🌸 Mujhe ye products order karne hain:\n\n${names}\n\nKya sab available hain?`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-white to-brand-gold-light/30 py-16">
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C9748A 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-border text-brand-rose text-xs font-semibold uppercase tracking-widest mb-4">
                <Heart className="w-3 h-3 fill-brand-rose text-brand-rose" />
                Wishlist
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-ink mb-2">
                Aapki Pasand 💕
              </h1>
              <p className="font-sans text-sm text-brand-slate">
                {mounted
                  ? `${wishlistProducts.length} item${wishlistProducts.length !== 1 ? "s" : ""} saved`
                  : "Loading your wishlist…"}
              </p>
            </div>
            {mounted && wishlistProducts.length > 0 && (
              <button
                onClick={shareOnWhatsApp}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#25D366] text-white font-sans font-semibold text-sm hover:brightness-105 active:scale-95 transition-all shadow-sm shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp pe Order Karo
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!mounted ? (
          // Loading skeleton
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          /* ── Empty State ─────────────────────────────────────────── */
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-brand-blush flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-brand-rose-light" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-brand-ink mb-3">
              Wishlist Abhi Khali Hai
            </h2>
            <p className="font-sans text-sm text-brand-slate mb-7 max-w-sm mx-auto">
              Koi bhi product jo pasand aaye — uska heart dabao aur wishlist mein save karo! Baad mein easily order kar sakti hain. 💕
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Shopping Shuru Karo
            </Link>
          </div>
        ) : (
          /* ── Wishlist Grid ─────────────────────────────────────── */
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-brand-blush to-brand-rose-light/50 flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0].src} alt={product.images[0].alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-4xl">🛍️</span>
                    )}
                    {/* Remove button */}
                    <button
                      onClick={() => toggle(product.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-blush"
                    >
                      <Trash2 className="w-4 h-4 text-brand-rose" strokeWidth={1.5} />
                    </button>
                    {product.compareAtPrice && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-rose text-white text-[10px] font-bold">
                        SALE
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="font-sans text-[10px] text-brand-slate uppercase tracking-wide mb-1">{product.category}</p>
                    <h3 className="font-sans font-semibold text-xs text-brand-ink line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <span className="font-sans font-bold text-sm text-brand-ink">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.compareAtPrice && (
                          <span className="font-sans text-[10px] text-brand-slate line-through ml-1">₹{product.compareAtPrice.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="mt-3 flex items-center justify-center w-full h-8 rounded-full bg-brand-rose text-white font-sans font-semibold text-xs hover:bg-brand-rose-dark active:scale-95 transition-all"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp order all */}
            <div className="bg-gradient-to-br from-brand-blush to-white rounded-2xl border border-brand-border p-6 text-center max-w-md mx-auto">
              <p className="font-serif text-base font-semibold text-brand-ink mb-1">Sab ek saath order karna hai? 🎀</p>
              <p className="font-sans text-xs text-brand-slate mb-4">
                WhatsApp pe apni poori wishlist bhejo — hum ek hi baar mein sab arrange kar denge!
              </p>
              <button
                onClick={shareOnWhatsApp}
                className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-95 transition-all shadow-sm"
              >
                Poori Wishlist WhatsApp Karo ({wishlistProducts.length} items)
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
