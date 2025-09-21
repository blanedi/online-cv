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


async function getCVData(lang: string) {
  try {
    const filePath = path.join(process.cwd(), "src/data/cv." + lang + ".json");
    const file = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(file);
  } catch {
    return null;
  }
}



export default async function Page({ params }: { params: { lang: string } }) {
  // Await params as required by Next.js 15+
  const awaitedParams = await Promise.resolve(params);
  const lang = awaitedParams.lang;
  if (!LOCALES.includes(lang)) notFound();
  const data = await getCVData(lang);
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
