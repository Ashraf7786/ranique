"use client";

import { useCallback } from "react";
import { useCartContext } from "@/components/providers/CartProvider";
import { Product, ColorVariant, SizeVariant } from "@/lib/types";

export function useCart() {
  const { state, dispatch, totalItems, totalPrice } = useCartContext();

  const addItem = useCallback(
    (
      product: Product,
      quantity = 1,
      selectedColor?: ColorVariant,
      selectedSize?: SizeVariant
    ) => {
      dispatch({
        type: "ADD_ITEM",
        payload: { product, selectedColor, selectedSize, quantity },
      });
      // Open drawer after add
      dispatch({ type: "OPEN_CART" });
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      dispatch({ type: "REMOVE_ITEM", payload: { cartItemId } });
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      dispatch({ type: "UPDATE_QTY", payload: { cartItemId, quantity } });
    },
    [dispatch]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), [dispatch]);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), [dispatch]);

  return {
    items: state.items,
    isOpen: state.isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  };
}
