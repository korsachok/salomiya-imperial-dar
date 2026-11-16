import Image from "next/image";
import Link from "next/link";
import { getAllPuppies } from "@/lib/content";
import { deletePuppy, savePuppy } from "@/app/admin/actions";
import { PuppyForm } from "@/components/admin/PuppyForm";

const STATUS_LABEL: Record<string, string> = {
  available: "Свободен",
  reserved: "В резерве",
  sold: "Продан",
  archived: "Архив",
};

export default async function AdminPuppiesPage() {
  const puppies = await getAllPuppies();

  return (
    <div className="max-w-4xl">
      <p className="eyebrow">Щенки</p>
      <h1 className="mt-3 font-display text-4xl font-light">Щенки</h1>
      <p className="mt-3 text-sm text-ink-soft/70">Меняйте статус (свободен / резерв / продан) и фото.</p>

      <ul className="mt-10 space-y-3">
        {puppies.map((puppy) => (
          <li key={puppy.id} className="card flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-sand-deep">
              {puppy.main_photo || puppy.photos[0] ? (
                <Image
                  src={puppy.main_photo || puppy.photos[0]}
                  alt={puppy.name ?? "Щенок"}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl font-light">{puppy.name ?? "Щенок"}</p>
              <p className="truncate text-xs text-ink-soft/60">
                {puppy.litter_name ?? "—"} · {puppy.color ?? "—"}
              </p>
            </div>
            <span className="status-pill text-ink-soft">{STATUS_LABEL[puppy.status] ?? puppy.status}</span>
            <Link href={`/admin/puppies/${puppy.id}`} className="admin-btn admin-btn-quiet">
              Изменить
            </Link>
            <form action={deletePuppy}>
              <input type="hidden" name="id" value={puppy.id} />
              <button type="submit" className="admin-btn admin-btn-danger">
                Удалить
              </button>
            </form>
          </li>
        ))}
        {puppies.length === 0 ? <li className="text-sm text-ink-soft/60">Пока нет щенков.</li> : null}
      </ul>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-light">Добавить щенка</h2>
        <div className="card mt-5">
          <PuppyForm action={savePuppy} />
        </div>
      </section>
    </div>
  );
}
