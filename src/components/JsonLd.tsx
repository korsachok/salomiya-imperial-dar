import { SITE_URL } from "@/lib/site";

// Экранируем <, > и &: JSON из CMS не должен уметь закрыть тег script.
const LT = "\\u003c";
const GT = "\\u003e";
const AMP = "\\u0026";

function safeJson(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, LT)
    .replace(/>/g, GT)
    .replace(/&/g, AMP);
}

type Props = {
  brand: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
};

// Микроразметка Schema.org для организации-питомника.
// Помогает поисковикам и мессенджерам понять, что это питомник с контактами.
export function OrganizationJsonLd({ brand, description, phone, email, address }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: brand,
    description: description || undefined,
    url: SITE_URL,
    image: `${SITE_URL}/images/hero/pomespitz.jpg`,
    logo: `${SITE_URL}/apple-icon.png`,
    telephone: phone || undefined,
    email: email || undefined,
    address: address
      ? { "@type": "PostalAddress", addressLocality: address, addressCountry: "RU" }
      : undefined,
    knowsAbout: ["Померанский шпиц", "Разведение собак", "РКФ"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}

// Хлебные крошки для детальных страниц.
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}
