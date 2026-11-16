"use client";

import { useState } from "react";
import { ImageField } from "./ImageField";

type Row = {
  key: string;
  label: string | null;
  value: string;
  image: string | null;
  kind: "text" | "long" | "image";
};

type ActionState = { error?: string; ok?: boolean };

export function PageContentForm({
  group,
  title,
  rows,
  action,
}: {
  group: string;
  title: string;
  rows: Row[];
  action: (form: FormData) => Promise<ActionState>;
}) {
  const [state, setState] = useState<ActionState>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setState(await action(form));
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6">
      <div>
        <p className="text-[0.625rem] tracking-[0.16em] uppercase text-ink-soft/50">{group}</p>
        <h2 className="mt-1 font-display text-2xl font-light">{title}</h2>
      </div>

      {rows.map((row) => (
        <div key={row.key}>
          <span className="admin-label">{row.label ?? row.key}</span>
          <div className={row.kind === "image" ? "max-w-sm" : undefined}>
            <ImageField key={`${row.key}-img`} name={`image:${row.key}`} initial={row.image ?? ""} />
          </div>

          {row.kind === "long" ? (
            <textarea name={`text:${row.key}`} defaultValue={row.value} rows={6} className="admin-input" />
          ) : row.kind === "text" ? (
            <input name={`text:${row.key}`} defaultValue={row.value} className="admin-input" />
          ) : null}
        </div>
      ))}

      <div className="admin-actions">
        <button type="submit" className="admin-btn" disabled={pending}>
          {pending ? "Сохраняем…" : "Сохранить раздел"}
        </button>
        {state.error ? <p className="admin-error-text">{state.error}</p> : null}
        {state.ok ? <p className="admin-ok-text">Сохранено</p> : null}
      </div>
    </form>
  );
}
