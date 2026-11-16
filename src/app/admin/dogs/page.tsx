import Link from "next/link";
import Image from "next/image";
import { getAllDogs } from "@/lib/content";
import { deleteDog } from "@/app/admin/actions";
import { DogForm } from "@/components/admin/DogForm";
import { saveDog } from "@/app/admin/actions";

export default async function AdminDogsPage() {
  const dogs = await getAllDogs();

  return (
    <div className="max-w-4xl">
      <p className="eyebrow">Собаки</p>
      <h1 className="mt-3 font-display text-4xl font-light">Взрослые собаки</h1>
      <p className="mt-3 text-sm text-ink-soft/70">
        Здесь можно изменить карточку или добавить новую собаку.
      </p>

      <ul className="mt-10 space-y-3">
        {dogs.map((dog) => (
          <li key={dog.id} className="card flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-sand-deep">
              {dog.main_photo || dog.photos[0] ? (
                <Image
                  src={dog.main_photo || dog.photos[0]}
                  alt={dog.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl font-light">{dog.name}</p>
              <p className="truncate text-xs text-ink-soft/60">
                {dog.title || dog.color || "—"}
                {dog.is_active ? "" : " · скрыта"}
              </p>
            </div>
            <Link href={`/admin/dogs/${dog.id}`} className="admin-btn admin-btn-quiet">
              Изменить
            </Link>
            <form action={deleteDog}>
              <input type="hidden" name="id" value={dog.id} />
              <button type="submit" className="admin-btn admin-btn-danger">
                Удалить
              </button>
            </form>
          </li>
        ))}
        {dogs.length === 0 ? (
          <li className="text-sm text-ink-soft/60">Пока нет собак.</li>
        ) : null}
      </ul>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-light">Добавить собаку</h2>
        <div className="card mt-5">
          <DogForm action={saveDog} />
        </div>
      </section>
    </div>
  );
}
