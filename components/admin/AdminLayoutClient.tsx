"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName: string;
  userInitial: string;
}

export function AdminLayoutClient({ children, userName, userInitial }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on outside scroll (iOS momentum scroll UX)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200
          flex flex-col z-40 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-64 lg:z-10
        `}
      >
        <AdminSidebarNav onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-sm">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors mr-2"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand name — visible on mobile when sidebar closed */}
          <span className="font-serif text-base font-bold text-brand-ink lg:hidden">
            Ranique Admin
          </span>

          {/* Welcome text — desktop */}
          <div className="hidden lg:block font-sans text-sm text-gray-500">
            Welcome, {userName}
          </div>

          {/* Avatar */}
          <div className="ml-auto w-8 h-8 rounded-full bg-brand-rose text-white flex items-center justify-center font-bold text-sm shrink-0">
            {userInitial}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
