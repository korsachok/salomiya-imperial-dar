import Link from "next/link";
import { NAV } from "@/lib/nav";

type Props = {
  brand: string;
  tagline?: string;
  phone?: string;
  email?: string;
  social?: string;
};

export function SiteFooter({ brand, tagline, phone, email, social }: Props) {
  return (
    <footer className="bg-ink text-sand">
      <div className="mx-auto max-w-[88rem] px-6 pt-20 pb-10 sm:px-8 md:px-10 lg:px-16">
        <div className="grid gap-14 border-b border-sand/15 pb-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-2xl tracking-[0.2em] uppercase">{brand}</p>
            {tagline ? <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand/55">{tagline}</p> : null}
          </div>

          <div className="md:col-span-5">
            <p className="text-[0.5625rem] tracking-[0.24em] uppercase text-sand/40">Навигация</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sand/70 transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[0.5625rem] tracking-[0.24em] uppercase text-sand/40">Контакты</p>
            <ul className="mt-6 space-y-3 text-sm text-sand/70">
              {phone ? (
                <li>
                  <a className="transition-colors hover:text-gold" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                    {phone}
                  </a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a className="transition-colors hover:text-gold" href={`mailto:${email}`}>
                    {email}
                  </a>
                </li>
              ) : null}
              {social ? (
                <li>
                  <a
                    className="transition-colors hover:text-gold"
                    href={social.startsWith("http") ? social : `https://${social}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Мессенджер
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-[0.5625rem] tracking-[0.22em] uppercase text-sand/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand}
          </p>
          <p>{tagline || "Питомник"}</p>
        </div>
      </div>
    </footer>
  );
}
