import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70svh] items-start justify-center pt-10 sm:pt-20">
      <div className="card w-full max-w-sm">
        <p className="eyebrow">Salomiya Imperial Dar</p>
        <h1 className="mt-3 font-display text-3xl font-light">Вход в панель</h1>
        <p className="mt-2 mb-8 text-sm text-ink-soft/70">
          Доступ только для владельца питомника.
        </p>
        <LoginForm />
        <Link href="/" className="mt-8 block text-center text-[0.6875rem] tracking-[0.16em] uppercase text-ink-soft/60 hover:text-gold">
          ← На сайт
        </Link>
      </div>
    </div>
  );
}
