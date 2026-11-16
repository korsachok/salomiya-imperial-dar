import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import { t } from "@/lib/i18n";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
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
