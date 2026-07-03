"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "ranique_wishlist";

function loadWishlist(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Hydrate from localStorage after mount
  useEffect(() => {
    setWishlist(loadWishlist());
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...wishlist]));
    } catch {}
  }, [wishlist]);

  const toggle = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.has(productId),
    [wishlist]
  );

  return { wishlist, toggle, isWishlisted };
}
