import type { NextConfig } from "next";

// Заголовки снимают базовые классы атак и не мешают ни Next.js, ни Supabase.
// CSP сознательно не включён: Next инлайнит скрипты гидратации, а админка
// грузит файлы в Supabase Storage. CSP потребует nonce через middleware —
// это отдельная задача, делать её «на глаз» опаснее, чем не иметь.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Server Actions уже проверяют Origin/Host, но список фиксируем явно:
  // так форма входа и сохранения работают только со своего домена.
  experimental: {
    serverActions: {
      allowedOrigins: [
        "www.salomiya-imperial-dar.ru",
        "salomiya-imperial-dar.ru",
        "localhost:3000",
        "localhost:3111",
        "localhost:3222",
        "localhost:3333",
        "localhost:3444",
        "localhost:3555",
      ],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "efxqqgxapikmwpfnnmmn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Админка не должна попадать в кэш браузера и в поиск.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
