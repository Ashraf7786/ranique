"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

const STORAGE_KEY = "ranique_wishlist";

function loadLocalWishlist(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function useWishlist() {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);

  // On mount: if logged in, fetch from DB; otherwise use localStorage
  useEffect(() => {
    if (session?.user) {
      // Fetch from API
      fetch("/api/wishlist")
        .then(r => r.json())
        .then(data => {
          const ids = (data.items ?? []).map((i: any) => i.productId);
          setWishlist(new Set(ids));
          setSynced(true);
        })
        .catch(() => setSynced(true));
    } else {
      setWishlist(loadLocalWishlist());
      setSynced(true);
    }
  }, [session]);

  // Persist to localStorage when not logged in
  useEffect(() => {
    if (!session?.user && synced) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...wishlist]));
      } catch {}
    }
  }, [wishlist, session, synced]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!session?.user) {
        // Guest: just toggle localStorage
        setWishlist(prev => {
          const next = new Set(prev);
          if (next.has(productId)) next.delete(productId);
          else next.add(productId);
          return next;
        });
        return;
      }

      // Optimistic update
      setWishlist(prev => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });

      // Sync with DB
      try {
        setLoading(true);
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } catch {
        // Revert on error
        setWishlist(prev => {
          const next = new Set(prev);
          if (next.has(productId)) next.delete(productId);
          else next.add(productId);
          return next;
        });
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.has(productId),
    [wishlist]
  );

  return { wishlist, toggle, isWishlisted, loading };
}
