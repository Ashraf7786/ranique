"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/account", label: "Dashboard", exact: true },
  { href: "/account/orders", label: "My Orders", exact: false },
  { href: "/account/wishlist", label: "Wishlist", exact: false },
  { href: "/account/settings", label: "Settings", exact: false },
];

const MEMBERSHIP_CONFIG = {
  standard: {
    label: "Member",
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    accent: "#9ca3af",
  },
  elite: {
    label: "Elite Pass",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    accent: "#7c3aed",
  },
  gold: {
    label: "Gold Elite",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "#d97706",
  },
};

interface AccountSidebarProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    image: string | null;
    isEmailVerified: boolean;
    createdAt: Date;
  };
  membershipTier: "standard" | "elite" | "gold";
  totalOrders: number;
}

// Instagram-style blue verified tick
function BlueTick() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M9.37 5.51A7.35 7.35 0 0 1 12 4.8c.95 0 1.86.25 2.63.71.5-.72 1.2-1.28 2.02-1.59a4.12 4.12 0 0 1 2.55-.12c.85.23 1.6.72 2.17 1.4.57.69.93 1.53 1.03 2.42.1.89-.07 1.8-.48 2.6.72.5 1.28 1.2 1.59 2.02.31.82.36 1.72.12 2.55-.23.85-.72 1.6-1.4 2.17-.69.57-1.53.93-2.42 1.03-.89.1-1.8-.07-2.6-.48-.5.72-1.2 1.28-2.02 1.59-.82.31-1.72.36-2.55.12a4.12 4.12 0 0 1-2.17-1.4 4.12 4.12 0 0 1-1.03-2.42c-.1-.89.07-1.8.48-2.6a4.12 4.12 0 0 1-1.59-2.02 4.12 4.12 0 0 1-.12-2.55c.23-.85.72-1.6 1.4-2.17.69-.57 1.53-.93 2.42-1.03z"
        fill="#1D9BF0"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AccountSidebar({
  user,
  membershipTier,
  totalOrders,
}: AccountSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const tier = MEMBERSHIP_CONFIG[membershipTier];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Clean minimal gradient header */}
        <div className="h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative" />

        <div className="px-6 pb-6 -mt-8 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg bg-gray-900 text-white flex items-center justify-center text-xl font-serif font-bold overflow-hidden">
            {user.image ? (
              <img
                src={user.image}
                alt={user.firstName || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              (user.firstName?.[0] || user.email[0]).toUpperCase()
            )}
          </div>

          {/* Name + Blue Tick */}
          <div className="flex items-center gap-1 mt-3">
            <h2 className="font-serif font-bold text-base text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            {user.isEmailVerified && <BlueTick />}
          </div>

          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-full">
            {user.email}
          </p>

          {/* Membership Badge */}
          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${tier.bg} ${tier.color} ${tier.border}`}
          >
            {membershipTier === "gold" && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tier.accent }}
              />
            )}
            {membershipTier === "elite" && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tier.accent }}
              />
            )}
            {tier.label}
          </div>

          {/* Member since + orders */}
          <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-400">
            <span>Since {memberSince}</span>
            <span className="w-px h-3 bg-gray-200" />
            <span>{totalOrders} orders</span>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <nav className="flex flex-col py-2">
          {NAV_ITEMS.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center justify-between px-6 py-3.5 text-sm font-medium transition-all duration-200 relative
                  ${
                    active
                      ? "text-gray-900 bg-gray-50"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                  }
                `}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gray-900" />
                )}
                <span>{label}</span>
                {active && (
                  <span className="text-[10px] text-gray-400 font-normal">
                    &#8250;
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-gray-100 px-2 py-2">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-colors ${
                  active ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {active && (
                  <span className="w-1 h-1 rounded-full bg-gray-900" />
                )}
                <span>{label.replace("My ", "")}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
