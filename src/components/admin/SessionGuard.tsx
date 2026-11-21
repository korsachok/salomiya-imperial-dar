"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserAuthClient } from "@/lib/supabase/auth-browser";

/**
 * Следит за сессией во вкладке админки.
 *
 * - Обновляет access-токен автоматически (Supabase делает это сам),
 *   а при SIGNED_OUT / истечении refresh-токена уводит на форму входа.
 * - Работает только в браузере, без запросов к серверу Next.
 */
export function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserAuthClient();

    // Если вкладка простояла долго, сессия могла истечь без события.
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) router.replace("/admin/login");
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/admin/login");
    });

    void check();

    // Возврат к вкладке после сна/долгой паузы.
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return null;
}
