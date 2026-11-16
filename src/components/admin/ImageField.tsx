"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoUpload } from "./PhotoUpload";

type Props = {
  name?: string;
  initial: string;
  onChange?: (url: string) => void;
};

export function ImageField({ name = "image_url", initial, onChange }: Props) {
  const [url, setUrl] = useState(initial);
  const [manual, setManual] = useState("");

  function update(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  return (
    <div>
      {name ? <input type="hidden" name={name} value={url} /> : null}
      <div className="relative mb-3 aspect-[16/10] overflow-hidden border border-line bg-sand-deep">
        {url ? (
          <Image src={url} alt="" fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-soft/50">Фото не задано</div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PhotoUpload onUploaded={(urls) => update(urls[0] ?? "")} multiple={false} />
        {url ? (
          <button type="button" className="admin-btn admin-btn-quiet" onClick={() => update("")}>
            Убрать
          </button>
        ) : null}
        <input
          className="admin-input !mt-0 min-w-[10rem] flex-1"
          placeholder="ссылка на фото"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
        />
        <button
          type="button"
          className="admin-btn admin-btn-quiet"
          onClick={() => {
            if (manual.trim()) {
              update(manual.trim());
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
