"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type AdminTheme = "light" | "dark";

interface AdminThemeContextValue {
  theme: AdminTheme;
  toggleTheme: () => void;
  isDark: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>("light");

  // Load persisted preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin-theme") as AdminTheme | null;
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem("admin-theme", next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
