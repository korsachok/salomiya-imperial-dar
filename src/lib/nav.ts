export type NavLink = { href: string; label: string };

export const NAV: NavLink[] = [
  { href: "/dogs", label: "Собаки" },
  { href: "/puppies", label: "Щенки" },
  { href: "/news", label: "Новости" },
  { href: "/gallery", label: "Галерея" },
  { href: "/graduates", label: "Выпускники" },
  { href: "/about", label: "О питомнике" },
  { href: "/faq", label: "Вопросы" },
  { href: "/contacts", label: "Контакты" },
];

export const LITTERS: { id: string; title: string; date: string; status: string; href?: string }[] = [
  {
    id: "autumn-2025",
    title: "«Осень 2025»",
    date: "Октябрь",
    status: "Есть свободные щенки",
    href: "/puppies",
  },
  { id: "spring-2025", title: "«Весна 2025»", date: "Апрель", status: "Все щенки в семьях" },
  { id: "autumn-2024", title: "«Осень 2024»", date: "Ноябрь", status: "Все щенки в семьях" },
];

export const SHOW = [
  { year: "2025", text: "Региональная выставка, Москва — «Лучший кобель», «Лучший щенок»" },
  { year: "2024", text: "Всероссийская выставка, Смоленск — «Лучший представитель породы»" },
  { year: "2024", text: "Монопородная выставка, Нижний Новгород — отлично, CW" },
];
