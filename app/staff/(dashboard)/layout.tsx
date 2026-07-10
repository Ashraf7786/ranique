import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, LogOut, LayoutDashboard } from "lucide-react";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "STAFF") {
    redirect("/staff/login");
  }

  const initial = session.user.name?.charAt(0).toUpperCase() || "S";

  const NAV = [
    { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
    { href: "/staff/products", label: "My Products", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div>
            <p className="font-serif text-lg font-bold text-brand-ink">Ranique</p>
            <p className="text-xs text-brand-gold font-medium">Staff Portal</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Icon className="w-5 h-5 text-gray-400" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-10">
          <p className="text-sm text-gray-500">Welcome back, <span className="font-semibold text-gray-900">{session.user.name}</span></p>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
