import React from "react";
import { BadgeType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgeProps {
  type: BadgeType;
  className?: string;
}

const badgeConfig: Record<BadgeType, { label: string; classes: string }> = {
  NEW:        { label: "New",        classes: "bg-brand-rose text-white" },
  SALE:       { label: "Sale",       classes: "bg-brand-gold text-white" },
  BESTSELLER: { label: "Best Seller",classes: "bg-brand-ink text-white" },
  LIMITED:    { label: "Limited",    classes: "bg-[#6B2D5E] text-white" },
};

export function Badge({ type, className }: BadgeProps) {
  const { label, classes } = badgeConfig[type];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full font-sans font-semibold text-2xs tracking-wide uppercase",
        classes,
        className
      )}
    >
      {label}
    </span>
  );
}
