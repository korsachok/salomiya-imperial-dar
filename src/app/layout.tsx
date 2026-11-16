import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getSiteContent } from "@/lib/content";
import { t } from "@/lib/i18n";

const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-cyrillic-ext.woff2", weight: "300 500", style: "normal" },
    { path: "../fonts/cormorant-cyrillic.woff2", weight: "300 500", style: "normal" },
    { path: "../fonts/cormorant-latin-ext.woff2", weight: "300 500", style: "normal" },
    { path: "../fonts/cormorant-latin.woff2", weight: "300 500", style: "normal" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
});

const manrope = localFont({
  src: [
    { path: "../fonts/manrope-cyrillic-ext.woff2", weight: "200 800", style: "normal" },
    { path: "../fonts/manrope-cyrillic.woff2", weight: "200 800", style: "normal" },
    { path: "../fonts/manrope-latin-ext.woff2", weight: "200 800", style: "normal" },
    { path: "../fonts/manrope-latin.woff2", weight: "200 800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const brand = t(content.get("brand.name")) || "Salomiya Imperial Dar";
  const subtitle = t(content.get("hero.subtitle"));
  return {
    title: subtitle ? `${brand} — ${subtitle}` : brand,
    description: subtitle || "Питомник",
  };
}

export const viewport: Viewport = {
  themeColor: "#f5f1ea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
