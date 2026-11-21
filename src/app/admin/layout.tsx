import type { Metadata } from "next";
import "../globals.css";
import "./admin.css";
import { getSiteContent } from "@/lib/content";
import { t } from "@/lib/i18n";
import { AdminNav } from "@/components/admin/AdminNav";
import { SessionGuard } from "@/components/admin/SessionGuard";

export const metadata: Metadata = {
  title: "Админ-панель — Salomiya Imperial Dar",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const brand = t((await getSiteContent()).get("brand.name")) || "Salomiya Imperial Dar";

  return (
    <div className="admin-shell">
      <SessionGuard />
      <AdminNav brand={brand} />
      <div className="admin-main">{children}</div>
    </div>
  );
}