"use client";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

export default function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    // Replace the first segment of the path with the new lang
    const segments = pathname.split("/");
    segments[1] = lang;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex justify-end mb-6">
      <select
        className="border rounded px-2 py-1 text-sm bg-white dark:bg-[#222] dark:text-white"
        value={current}
        onChange={handleChange}
        aria-label="Select language"
      >
        {LANGS.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
