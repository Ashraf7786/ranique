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
  ClipboardList
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/offers", label: "Offers", icon: Gift },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/brands", label: "Brands", icon: Box },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
  { href: "/admin/product-requests", label: "Edit Requests", icon: ClipboardList },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/enquiries", label: "Bugs & Queries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {NAV_LINKS.map((link) => {
        const Icon = link.icon;
        // Exact match for /admin, prefix match for others (e.g., /admin/orders/123)
        const isActive = link.href === "/admin" 
          ? pathname === "/admin" 
          : pathname?.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={twMerge(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.96]",
              isActive 
                ? "bg-[#FDF2F4] text-brand-rose border border-brand-rose/20 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon className={twMerge(
              "w-5 h-5 transition-colors",
              isActive ? "text-brand-rose" : "text-gray-400 group-hover:text-gray-500"
            )} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
