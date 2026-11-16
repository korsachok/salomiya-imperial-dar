"use client";

import { useState } from "react";
import { PhotoUpload } from "./PhotoUpload";

export function VideoField({ name, initial }: { name: string; initial?: string | null }) {
  const [url, setUrl] = useState(initial ?? "");
  const [manual, setManual] = useState("");

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <video
          src={url}
          controls
          muted
          playsInline
          className="mb-3 max-h-72 w-full border border-line bg-black object-contain"
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <PhotoUpload
          onUploaded={(urls) => setUrl(urls[0] ?? "")}
          multiple={false}
          accept="video/mp4,video/quicktime"
          label={url ? "Заменить видео" : "Загрузить видео"}
        />
        {url ? (
          <button type="button" className="admin-btn admin-btn-quiet" onClick={() => setUrl("")}>
            Убрать
          </button>
        ) : null}
        <div className="flex flex-1 flex-wrap gap-2">
          <input
            className="admin-input !mt-0 flex-1"
            placeholder="или ссылка на видео (mp4)"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <button
            type="button"
            className="admin-btn admin-btn-quiet"
            onClick={() => {
              if (manual.trim()) {
                setUrl(manual.trim());
                setManual("");
              }
            }}
          >
            Указать
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-soft/50">mp4 или mov, до 50 МБ</p>
    </div>
  );
}
