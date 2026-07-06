"use client";

import { useEffect, useState } from "react";

export function FlashMessage() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const flash = sessionStorage.getItem("flash_success");
    if (flash) {
      setMsg(flash);
      sessionStorage.removeItem("flash_success");
    }
  }, []);

  if (!msg) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center justify-between mb-6 shadow-sm">
      <p className="font-medium">{msg}</p>
      <button onClick={() => setMsg("")} className="text-green-600 hover:text-green-900 text-xl font-bold">&times;</button>
    </div>
  );
}
