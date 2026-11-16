"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoUpload } from "./PhotoUpload";
import { saveContentImage } from "@/app/admin/actions";

export function ContentImageField({ contentKey, current }: { contentKey: string; current: string | null }) {
  const [src, setSrc] = useState<string | null>(current);
  const [manual, setManual] = useState("");
  const [pending, setPending] = useState(false);

  function persist(next: string | null) {
    setSrc(next);
    const form = new FormData();
    form.set("key", contentKey);
    form.set("image_url", next ?? "");
    setPending(true);
    saveContentImage(form).finally(() => setPending(false));
  }

  return (
    <div>
      <div className="relative mb-3 aspect-[16/9] overflow-hidden border border-line bg-sand-deep">
        {src ? (
          <Image src={src} alt="" fill sizes="(max-width: 1024px) 100vw, 400px" className="object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-ink-soft/50">
            Фото не задано
            <PhotoUpload onUploaded={(urls) => persist(urls[0] ?? null)} multiple={false} />
          </div>
        )}
      </div>

      {src ? (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <PhotoUpload onUploaded={(urls) => persist(urls[0] ?? null)} multiple={false} />
          <button type="button" className="admin-btn admin-btn-quiet" onClick={() => persist(null)}>
            Убрать
          </button>
          {pending ? <span className="text-xs text-ink-soft/50">Сохраняем…</span> : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <input
          className="admin-input !mt-0 flex-1"
          placeholder="ссылка на изображение"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
        />
        <button
          type="button"
          className="admin-btn admin-btn-quiet"
          onClick={() => {
            if (manual.trim()) {
              persist(manual.trim());
              setManual("");
            }
          }}
        >
          Указать
        </button>
      </div>
    </div>
  );
}
