import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { hostFromHeaders, isIndexableHost } from "@/lib/site";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  // Публичные страницы: единственная работа — закрыть от индексации
  // превью-домены Vercel и локальные хосты, чтобы не плодить дубли.
  if (!isAdmin) {
    const response = NextResponse.next();
    if (!isIndexableHost(hostFromHeaders(request.headers))) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return response;
  }

  const isLogin = pathname === "/admin/login";

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Уже вошёл — форма входа не нужна.
  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLogin) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Статику и файлы из public не пропускаем через middleware.
  matcher: ["/((?!_next/static|_next/image|favicon|icon\\.svg|apple-icon|images/).*)"],
};
