import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getSiteContent } from "@/lib/content";
import { t } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
  const brand = t(content.get("brand.name")) || SITE_NAME;
  const subtitle = t(content.get("hero.subtitle"));
  const title = subtitle ? `${brand} — ${subtitle}` : brand;
  const description = subtitle || "Питомник померанских шпицев";

  // Читать заголовки здесь нельзя: headers() переводит все страницы в
  // динамический рендер и отключает ISR/CDN-кэш. Превью-домен закрываем
  // заголовком X-Robots-Tag в middleware.
  const ogImage = `${SITE_URL}/images/hero/pomespitz.jpg`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${brand}`,
    },
    description,
    applicationName: brand,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: brand,
      title,
      description,
      url: SITE_URL,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
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
