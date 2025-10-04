
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Cintya Huaire – CV & Portfolio",
  description: "The professional CV and portfolio of Cintya Huaire: Data & Policy Analyst, Policy Specialist, and Digital Innovation for Migration & Social Protection. Multilingual, downloadable, and deployed on GitHub Pages.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout: always use 'en' as default lang
  return (
    <html lang="en">
      <head>
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Cintya Huaire – CV & Portfolio" />
        <meta property="og:description" content="The professional CV and portfolio of Cintya Huaire: Data & Policy Analyst, Policy Specialist, and Digital Innovation for Migration & Social Protection." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blanedi.github.io/online-cv/" />
        <meta property="og:site_name" content="Cintya Huaire – CV & Portfolio" />
        <meta property="og:image" content="/favicon.svg" />
        <meta property="og:image:width" content="64" />
        <meta property="og:image:height" content="64" />
        <meta property="og:locale" content="en_US" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Cintya Huaire – CV & Portfolio" />
        <meta name="twitter:description" content="The professional CV and portfolio of Cintya Huaire: Data & Policy Analyst, Policy Specialist, and Digital Innovation for Migration & Social Protection." />
        <meta name="twitter:image" content="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
