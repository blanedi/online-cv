"use client";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

const LANGS = [
  { code: "en", label: "English", flag: "gb" }, // Using GB flag for English
  { code: "es", label: "Español", flag: "es" },
  { code: "fr", label: "Français", flag: "fr" },
];

export default function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (langCode: string) => {
    // Replace the first segment of the path with the new lang
    const segments = pathname.split("/");
    segments[1] = langCode;
    router.push(segments.join("/"));
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex gap-2">
        {LANGS.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleClick(lang.code)}
            className="transition-all duration-200 hover:scale-110"
            title={lang.label}
            aria-label={`Switch to ${lang.label}`}
          >
            <span className={`fi fi-${lang.flag} circular border shadow-sm border-gray-200 dark:border-gray-600 transition-all duration-200 cursor-pointer hover:opacity-90 hover:scale-105 ${
              current === lang.code 
                ? 'opacity-100 transform scale-110 shadow-md' 
                : 'opacity-60'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
