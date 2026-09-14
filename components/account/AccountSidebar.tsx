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
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
  elite: {
    label: "Elite Pass",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  gold: {
    label: "Gold Elite",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
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

/* Instagram-style blue verified badge — exact replica */
function VerifiedBadge() {
  return (
    <svg
      viewBox="0 0 40 40"
      width="16"
      height="16"
      className="shrink-0"
      aria-label="Verified"
    >
      <path
        d="M19.998 3.094L14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.972-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.641l-5.436-3.137V5.15h-6.234L25.358 0l-5.36 3.094z"
        fill="#1D9BF0"
      />
      <path
        d="M17.204 27.377l-6.548-6.36 3.145-3.056 3.403 3.305 8.74-8.482 3.146 3.055-11.886 11.538z"
        fill="white"
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
      {/* Profile Card — no overflow hidden so nothing clips */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-[72px] h-[72px] rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-serif font-bold overflow-hidden shadow-md">
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
          <div className="flex items-center gap-1 mt-4">
            <h2 className="font-serif font-bold text-base text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            {user.isEmailVerified && <VerifiedBadge />}
          </div>

          <p className="text-xs text-gray-400 mt-1 truncate max-w-full">
            {user.email}
          </p>

          {/* Membership Badge */}
          <div
            className={`mt-4 inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${tier.bg} ${tier.color} ${tier.border}`}
          >
            {tier.label}
          </div>

          {/* Member since + orders */}
          <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-400">
            <span>Since {memberSince}</span>
            <span className="w-px h-3 bg-gray-200" />
            <span>
              {totalOrders} order{totalOrders !== 1 ? "s" : ""}
            </span>
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
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gray-900" />
                )}
                <span>{label}</span>
                {active && (
                  <span className="text-gray-300 text-lg leading-none">
                    &#8250;
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

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
