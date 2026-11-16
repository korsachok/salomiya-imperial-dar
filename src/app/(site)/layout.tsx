import type { Metadata } from "next";
import "./globals.css";
import { getSiteContent } from "@/lib/content";
import { t } from "@/lib/i18n";
import { NAV } from "@/lib/nav";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export const metadata: Metadata = {
  title: "Salomiya Imperial Dar — питомник померанских шпицев",
  description: "Питомник Salomiya Imperial Dar. Померанский шпиц: взрослые собаки и щенки.",
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  const brand = t(content.get("brand.name")) || "Salomiya Imperial Dar";
  const tagline = t(content.get("hero.subtitle"));
  const phone = t(content.get("contacts.phone"));
  const email = t(content.get("contacts.email"));
  const social = t(content.get("contacts.social"));
  const footerNote = t(content.get("footer.note"));

  return (
    <>
      <SiteHeader brand={brand} tagline={tagline} links={NAV} />
      {children}
      <SiteFooter brand={brand} tagline={footerNote || tagline} phone={phone} email={email} social={social} />
    </>
  );
}
