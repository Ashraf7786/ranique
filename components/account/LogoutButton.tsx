"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 w-full text-left"
    >
      <LogOut className="w-5 h-5" />
      Sign Out
    </button>
  );
}
