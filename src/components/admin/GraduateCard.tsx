"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduateForm, type GraduateFields } from "./GraduateForm";
import type { ActionState } from "@/app/admin/actions";

export function GraduateCard({
  graduate,
  action,
  deleteAction,
}: {
  graduate: GraduateFields & { id: string; name: string };
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  deleteAction: (form: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-sand-deep">
          {graduate.photo ? <Image src={graduate.photo} alt="" fill sizes="56px" className="object-cover" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-light">{graduate.name}</p>
          <p className="truncate text-xs text-ink-soft/60">
            {[graduate.owner_city, graduate.birth_year].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-quiet" onClick={() => setOpen(!open)}>
          {open ? "Скрыть" : "Изменить"}
        </button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={graduate.id} />
          <button type="submit" className="admin-btn admin-btn-danger">
            Удалить
          </button>
        </form>
      </div>
      {open ? (
        <div className="mt-5 border-t border-line pt-5">
          <GraduateForm graduate={graduate} action={action} />
        </div>
      ) : null}
    </div>
  );
}

