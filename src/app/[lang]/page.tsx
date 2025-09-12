// Required for static export: generateStaticParams for all supported languages
export function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "es" },
    { lang: "fr" },
  ];
}
import { notFound } from "next/navigation";
import CVSection from "@/components/CVSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import fs from "fs";
import path from "path";

const LOCALES = ["en", "es", "fr"];

function getCVData(lang: string) {
  try {
    const filePath = path.join(process.cwd(), "src/data/cv." + lang + ".json");
    const file = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(file);
  } catch {
    return null;
  }
}

export default function Page({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  if (!LOCALES.includes(lang)) notFound();
  const data = getCVData(lang);
  if (!data) notFound();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#101010] py-8 px-2">
      <div className="w-full max-w-4xl">
        <LanguageSwitcher current={lang} />
        <CVSection data={data} />
      </div>
    </div>
  );
}
