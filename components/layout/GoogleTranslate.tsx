"use client";

import { useEffect } from "react";
import Script from "next/script";

export function GoogleTranslate() {
  useEffect(() => {
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

  return (
    <div className="flex items-center">
      {/* This div is where the Google Translate widget will render */}
      <div id="google_translate_element" className="translate-widget" />

      {/* The Google Translate script */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </div>
  );
}
