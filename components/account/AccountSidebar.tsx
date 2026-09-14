"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package, exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
  { href: "/account/settings", label: "Settings", icon: Settings, exact: false },
];

interface AccountSidebarProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
  };
}

export function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top gradient strip */}
        <div className="h-20 bg-gradient-to-br from-[#b76e79] via-[#c98a93] to-[#e8c4c0] relative">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 80">
              <defs>
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="400" height="80" fill="url(#dots)" />
            </svg>
          </div>
        </div>

        <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-[#b76e79] text-white flex items-center justify-center text-2xl font-serif font-bold overflow-hidden ring-2 ring-[#b76e79]/20">
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

          <h2 className="font-serif font-bold text-lg text-gray-900 mt-3">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-gray-500 truncate max-w-full">{user.email}</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-2">Member since {memberSince}</p>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <nav className="flex flex-col py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-200 relative group
                  ${
                    active
                      ? "text-[#b76e79] bg-[#fdf2f3]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#b76e79]" />
                )}
                <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#b76e79]" : "text-gray-400 group-hover:text-gray-600"}`} />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight className="w-4 h-4 text-[#b76e79]/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-gray-100 px-2 py-2">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar (visible on small screens only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-colors ${
                  active ? "text-[#b76e79]" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label.replace("My ", "")}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
