"use client";

import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { Sun, Moon } from "lucide-react";

export function AdminThemeToggle() {
  const { isDark, toggleTheme, theme } = useAdminTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`
        relative inline-flex items-center justify-center
        w-9 h-9 rounded-full transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose focus-visible:ring-offset-2
        ${isDark
          ? "bg-slate-700 text-yellow-300 hover:bg-slate-600 shadow-inner"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }
      `}
    >
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"}`}>
        <Moon className="w-4 h-4" />
      </span>
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${!isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}>
        <Sun className="w-4 h-4" />
      </span>
    </button>
  );
}
