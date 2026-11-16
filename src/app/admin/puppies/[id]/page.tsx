import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPuppies } from "@/lib/content";
import { t } from "@/lib/i18n";
import { savePuppy } from "@/app/admin/actions";
import { PuppyForm } from "@/components/admin/PuppyForm";

export default async function EditPuppyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const puppy = (await getAllPuppies()).find((p) => p.id === id);
  if (!puppy) notFound();

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/puppies"
        className="text-[0.6875rem] tracking-[0.16em] uppercase text-ink-soft/60 hover:text-gold"
      >
        ← Щенки
      </Link>
      <h1 className="mt-4 font-display text-4xl font-light">{puppy.name ?? "Щенок"}</h1>

      <div className="card mt-8">
        <PuppyForm
          action={savePuppy}
          puppy={{
            id: puppy.id,
            name: puppy.name,
            slug: puppy.slug,
            sex: puppy.sex,
            birth_date: puppy.birth_date,
            color: puppy.color,
            litter_name: puppy.litter_name,
            description: t(puppy.description),
            photos: puppy.photos,
            main_photo: puppy.main_photo,
            price: puppy.price,
            status: puppy.status,
            is_active: puppy.is_active,
            sort_order: puppy.sort_order,
          }}
        />
      </div>
    </div>
  );
}
