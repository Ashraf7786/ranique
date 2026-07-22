import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number,
  currency = "INR",
  locale = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clampNumber(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function formatDateIST(
  date: string | Date | number | null | undefined,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      ...options
    });
  } catch (e) {
    return String(date);
  }
}

export function flyToCart(
  startElement: HTMLElement | null,
  imgSrc: string,
  onComplete?: () => void
) {
  // Prefer the actual product image if startElement is a container/button
  let rectElement = startElement;
  const parent = startElement?.closest("article") || startElement?.closest("div");
  const imgElement = parent?.querySelector("img");
  if (imgElement) {
    rectElement = imgElement as HTMLElement;
  }

  const cartIcon = document.getElementById("header-cart-btn");
  if (!cartIcon || !rectElement) {
    if (onComplete) onComplete();
    return;
  }

  const startRect = rectElement.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  const flyImg = document.createElement("img");
  flyImg.src = imgSrc;
  flyImg.style.position = "fixed";
  flyImg.style.top = `${startRect.top}px`;
  flyImg.style.left = `${startRect.left}px`;
  flyImg.style.width = `${startRect.width}px`;
  flyImg.style.height = `${startRect.height}px`;
  flyImg.style.objectFit = "cover";
  flyImg.style.borderRadius = "8px"; // Initial slightly rounded
  flyImg.style.zIndex = "999999";
  flyImg.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  flyImg.style.pointerEvents = "none";
  flyImg.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.2)";

  document.body.appendChild(flyImg);

  // Force reflow
  flyImg.getBoundingClientRect();

  // Animate to cart
  flyImg.style.top = `${endRect.top + endRect.height / 2 - 10}px`;
  flyImg.style.left = `${endRect.left + endRect.width / 2 - 10}px`;
  flyImg.style.width = "20px";
  flyImg.style.height = "20px";
  flyImg.style.opacity = "0.5";
  flyImg.style.borderRadius = "50%";

  setTimeout(() => {
    flyImg.remove();
    // Add a little pop effect to the cart icon
    cartIcon.style.transform = "scale(1.2)";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 200);
    if (onComplete) onComplete();
  }, 800);
}

