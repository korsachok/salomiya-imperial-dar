import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDogs } from "@/lib/content";
import { t } from "@/lib/i18n";
import { saveDog } from "@/app/admin/actions";
import { DogForm } from "@/components/admin/DogForm";

export default async function EditDogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dog = (await getAllDogs()).find((d) => d.id === id);
  if (!dog) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/dogs" className="text-[0.6875rem] tracking-[0.16em] uppercase text-ink-soft/60 hover:text-gold">
        ← Собаки
      </Link>
      <h1 className="mt-4 font-display text-4xl font-light">{dog.name}</h1>

      <div className="card mt-8">
        <DogForm
          action={saveDog}
          dog={{
            id: dog.id,
            name: dog.name,
            slug: dog.slug,
            sex: dog.sex,
            birth_date: dog.birth_date,
            color: dog.color,
            title: dog.title,
            description: t(dog.description),
            photos: dog.photos,
            main_photo: dog.main_photo,
            father_name: dog.father_name,
            mother_name: dog.mother_name,
            is_active: dog.is_active,
            sort_order: dog.sort_order,
          }}
        />
      </div>
    </div>
  );
}
