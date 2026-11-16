"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoUpload } from "./PhotoUpload";

type Props = {
  name: string;
  label?: string;
  initial: string[];
  initialMain?: string | null;
};

export function PhotosField({ name, label = "Фотографии", initial, initialMain }: Props) {
  const [photos, setPhotos] = useState<string[]>(initial);
  const [main, setMain] = useState<string | null>(initialMain ?? initial[0] ?? null);
  const [manual, setManual] = useState("");

  function update(next: string[]) {
    setPhotos(next);
    if (!main || !next.includes(main)) setMain(next[0] ?? null);
  }

  function addUrls(urls: string[]) {
    const next = [...new Set([...photos, ...urls])];
    update(next);
  }

  function addManual() {
    const value = manual.trim();
    if (!value) return;
    addUrls([value]);
    setManual("");
  }

  function remove(url: string) {
    update(photos.filter((p) => p !== url));
  }

  function makeMain(url: string) {
    setMain(url);
  }

  return (
    <div>
      <span className="admin-label">{label}</span>
      <input type="hidden" name={name} value={photos.join("\n")} />
      <input type="hidden" name="main_photo" value={main ?? ""} />

      {photos.length > 0 ? (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden border border-line bg-sand-deep">
              <Image src={url} alt="" fill sizes="120px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-ink/70 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => makeMain(url)}
                  className="text-[0.5rem] tracking-[0.1em] uppercase text-sand/80 hover:text-sand"
                >
                  {main === url ? "главная" : "сделать"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(url)}
                  className="text-[0.5rem] tracking-[0.1em] uppercase text-sand/80 hover:text-red-300"
                >
                  удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 text-xs text-ink-soft/50">Пока нет фотографий</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <PhotoUpload onUploaded={addUrls} />
        <div className="flex flex-1 flex-wrap gap-2">
          <input
            className="admin-input !mt-0 flex-1"
            placeholder="или вставьте ссылку на фото"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addManual();
              }
            }}
          />
          <button type="button" className="admin-btn admin-btn-quiet" onClick={addManual}>
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
