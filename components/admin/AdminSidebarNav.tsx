"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Box,
  Settings,
  Users,
  ShoppingCart,
  MessageSquare,
  Inbox,
  Gift,
  Ticket,
  CreditCard,
  Star,
  UserCog,
  ClipboardList,
  Megaphone,
  SlidersHorizontal,
  Truck,
  X,
  ArrowLeft,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/shipping", label: "Delhivery Shipping", icon: Truck },
  { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/offers", label: "Offers", icon: Gift },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/brands", label: "Brands", icon: Box },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/staff", label: "Team", icon: UserCog },
  { href: "/admin/product-requests", label: "Edit Requests", icon: ClipboardList },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/enquiries", label: "Bugs & Queries", icon: Inbox },
  { href: "/admin/announcements", label: "Announcement Bar", icon: Megaphone },
  { href: "/admin/hero-banners", label: "Hero Banners", icon: SlidersHorizontal },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarNavProps {
  onClose?: () => void;
}

export function AdminSidebarNav({ onClose }: AdminSidebarNavProps) {
  const pathname = usePathname();
  const { isDark } = useAdminTheme();

  return (
    <>
      {/* Sidebar header — brand + close button */}
      <div
        className={`flex items-center justify-between h-14 lg:h-16 px-5 shrink-0 border-b transition-colors duration-300 ${
          isDark ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <span
          className={`font-serif text-lg lg:text-xl font-bold transition-colors duration-300 ${
            isDark ? "text-white" : "text-brand-ink"
          }`}
        >
          Ranique Admin
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className={`lg:hidden p-1.5 rounded-lg transition-colors ${
              isDark
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={twMerge(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.97]",
                isActive
                  ? isDark
                    ? "bg-brand-rose/20 text-brand-rose border border-brand-rose/30 shadow-sm"
                    : "bg-[#FDF2F4] text-brand-rose border border-brand-rose/20 shadow-sm"
                  : isDark
                  ? "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon
                className={twMerge(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-brand-rose" : isDark ? "text-gray-500" : "text-gray-400"
                )}
              />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to store */}
      <div
        className={`p-4 border-t shrink-0 transition-colors duration-300 ${
          isDark ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <Link
          href="/"
          onClick={onClose}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isDark
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    </>
  );
}
