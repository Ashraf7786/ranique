"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { formatPrice, cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  // Prevent hydration mismatch: cart state comes from localStorage
  // which doesn't exist on the server. Render nothing until mounted.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Don't render until client hydration complete
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-brand-ink/30 backdrop-blur-sm",
          "transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={cn(
          "fixed top-0 right-0 h-full z-50 w-full max-w-md",
          "bg-white shadow-drawer flex flex-col",
          "transition-transform duration-400 ease-spring",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-semibold text-brand-ink">
              Your Bag
            </h2>
            {totalItems > 0 && (
              <span className="text-sm text-brand-slate">
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            id="cart-close-btn"
            aria-label="Close shopping bag"
            className="p-2 rounded-full hover:bg-brand-mist transition-colors"
          >
            <XIcon className="w-5 h-5 text-brand-slate" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <span className="text-6xl">👜</span>
              <div>
                <p className="font-serif text-lg text-brand-ink mb-1">Your bag is empty</p>
                <p className="text-sm text-brand-slate">Add something beautiful to get started.</p>
              </div>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 h-10 px-6 rounded-full bg-brand-rose text-white text-sm font-medium hover:bg-brand-rose-dark transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const hasActiveOffer = item.product.offer && item.product.offer.isActive && new Date(item.product.offer.endsAt) > new Date();
              const basePrice = hasActiveOffer ? item.product.offer!.offerPrice : item.product.price;
              const price = basePrice + (item.selectedColor?.priceModifier ?? 0);
              return (
                <div
                  key={item.cartItemId}
                  className="flex gap-3 p-3 rounded-2xl bg-brand-mist border border-brand-border/50 animate-slide-up"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.product.slug}`}
                    onClick={closeCart}
                    className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-brand-blush"
                    tabIndex={-1}
                    aria-hidden
                  >
                    <Image
                      src={item.product.images[0].src}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-2xs text-brand-slate font-medium uppercase tracking-wider">
                      {item.product.brand}
                    </p>
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-serif text-sm font-medium text-brand-ink line-clamp-2 leading-snug hover:text-brand-rose transition-colors"
                    >
                      {item.product.name}
                    </Link>

                    {/* Variant info */}
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.selectedColor && (
                          <span className="inline-flex items-center gap-1 text-2xs text-brand-slate">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-brand-border"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.label}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="text-2xs text-brand-slate">
                            {item.selectedSize.label}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Qty + price row */}
                    <div className="flex items-center justify-between mt-auto pt-1">
                      {/* Qty control */}
                      <div className="flex items-center border border-brand-border rounded-full overflow-hidden h-7">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="px-2.5 h-full text-brand-slate hover:text-brand-rose hover:bg-brand-blush transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-brand-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-2.5 h-full text-brand-slate hover:text-brand-rose hover:bg-brand-blush transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-sans font-semibold text-sm text-brand-ink">
                          {formatPrice(price * item.quantity, item.product.currency)}
                        </span>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          aria-label={`Remove ${item.product.name}`}
                          className="p-1.5 rounded-full hover:bg-red-50 text-brand-slate hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-border px-5 py-4 space-y-3 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-brand-slate">Subtotal</span>
              <span className="font-sans font-semibold text-brand-ink">
                {formatPrice(totalPrice, "INR")}
              </span>
            </div>
            <p className="text-2xs text-brand-slate">
              Shipping & taxes calculated at checkout
            </p>
            {/* CTA */}
            <button
              id="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full h-12 flex justify-center items-center rounded-full bg-brand-rose text-white font-sans font-semibold text-sm hover:bg-brand-rose-dark active:scale-[0.98] transition-all shadow-sm disabled:opacity-70 disabled:cursor-wait"
            >
              {isCheckingOut ? (
                <span className="animate-pulse">Processing Secure Checkout...</span>
              ) : (
                `Checkout · ${formatPrice(totalPrice, "INR")}`
              )}
            </button>
            <button
              onClick={closeCart}
              className="w-full h-10 rounded-full border border-brand-border text-brand-slate text-sm font-medium hover:border-brand-rose hover:text-brand-rose transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
