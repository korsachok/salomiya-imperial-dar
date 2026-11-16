"use client";

import { useState } from "react";
import { createBrowserAuthClient } from "@/lib/supabase/auth-browser";

export function PhotoUpload({
  onUploaded,
  multiple = true,
  accept = "image/*",
  label = "Выбрать фото",
}: {
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);

    const supabase = createBrowserAuthClient();
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${new Date().getFullYear()}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
          contentType: file.type || "application/octet-stream",
        });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from("photos").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    if (urls.length > 0) onUploaded(urls);
    setBusy(false);
  }

  return (
    <div className="admin-upload">
      <label className="admin-upload-btn">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={busy}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
        />
        {busy ? "Загрузка…" : label}
      </label>
      {error ? <p className="admin-error-text">{error}</p> : null}
    </div>
  );
}
