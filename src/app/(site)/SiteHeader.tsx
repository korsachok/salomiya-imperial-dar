import type { NavLink } from "@/lib/nav";

type Props = {
  brand: string;
  tagline?: string;
  links: NavLink[];
};

export function SiteHeader({ brand, tagline, links }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-sand/80 backdrop-blur-md">
      <input id="nav-toggle" type="checkbox" className="peer sr-only" aria-hidden="true" />

      <div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between px-6 sm:px-8 md:px-10 lg:px-14">
        <a href="/" className="group block shrink-0 leading-none">
          <span className="block font-display text-[1.0625rem] tracking-[0.2em] uppercase transition-colors group-hover:text-gold sm:text-[1.375rem] sm:tracking-[0.24em]">
            {brand}
          </span>
          {tagline ? (
            <span className="mt-1.5 hidden max-w-[18rem] truncate text-[0.5625rem] tracking-[0.28em] uppercase text-ink-soft/60 xl:block">
              {tagline}
            </span>
          ) : null}
        </a>

        <nav className="hidden items-center gap-7 xl:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.625rem] tracking-[0.2em] uppercase whitespace-nowrap text-ink-soft transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/contacts" className="btn btn-outline hidden !px-6 !py-3 !text-[0.625rem] md:inline-flex">
            Связаться
          </a>
          <label
            htmlFor="nav-toggle"
            className="flex h-10 w-10 cursor-pointer items-center justify-center border border-line xl:hidden"
          >
            <span className="sr-only">Меню</span>
            <span className="block h-px w-5 bg-ink shadow-[0_6px_0_0_var(--color-ink),0_-6px_0_0_var(--color-ink)]" />
          </label>
        </div>
      </div>

      <div className="hidden border-t border-line bg-sand peer-checked:block xl:peer-checked:hidden">
        <nav className="mx-auto max-w-[88rem] px-6 py-4 sm:px-8">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2 text-[0.6875rem] tracking-[0.18em] uppercase text-ink-soft transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
