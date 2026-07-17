"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function GoogleTranslate() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    // Check if google cookie already set a language
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match && match[2]) {
      const currentLang = match[2].split('/')[2];
      if (currentLang) setLang(currentLang);
    }

    // Add the callback function to the window object
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { 
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);

  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    
    // Set google translate cookie manually to ensure it triggers correctly
    document.cookie = `googtrans=/en/${newLang}; path=/`;
    document.cookie = `googtrans=/en/${newLang}; domain=.${window.location.hostname}; path=/`;

    // Find the hidden Google select and trigger it
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = newLang;
      select.dispatchEvent(new Event('change'));
    } else {
      // Fallback reload if widget isn't fully loaded yet
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* Hide the actual google widget completely */}
      <div id="google_translate_element" className="absolute opacity-0 pointer-events-none z-[-1]" />

      <div className="relative flex items-center group">
        <Globe className="w-4 h-4 text-brand-slate absolute left-2 pointer-events-none group-hover:text-brand-rose transition-colors" />
        <select
          value={lang}
          onChange={(e) => changeLanguage(e.target.value)}
          className="pl-7 pr-6 py-1.5 bg-brand-mist/50 border border-brand-border/50 text-brand-ink text-xs font-semibold rounded-full hover:bg-brand-blush hover:border-brand-rose/30 transition-all appearance-none cursor-pointer focus:outline-none"
        >
          <option value="en">ENG</option>
          <option value="hi">HIN</option>
        </select>
        <ChevronDown className="w-3 h-3 text-brand-slate absolute right-2 pointer-events-none group-hover:text-brand-rose transition-colors" />
      </div>

      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </div>
  );
}
