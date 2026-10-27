"use client";

import { useState } from "react";
import { saveFile } from "@/app/lib/actions";
import SaveForm, { extensionOf } from "@/app/ui/save-form";

export default function CameraCapture() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function clear() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setFilename("");
  }

  async function handleSave() {
    if (!file) return;
    setSaving(true);
    const result = await saveFile(file, filename);
    setMessage(result);
    setSaving(false);

    // Close the preview once saved; keep it open on error so the name can be fixed.
    if (result.startsWith("Saved")) clear();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Same fixed-size box whether empty or showing a photo. */}
      <label className="group relative flex h-48 cursor-pointer sm:h-56 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-background transition-colors hover:border-muted">
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
            <img src={preview} alt="Captured photo" className="size-full object-cover" />
            <span className="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              Retake
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 text-muted">
            <CameraIcon />
            <span className="text-sm text-foreground">Take a photo</span>
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const picked = e.target.files?.[0];
            if (picked) {
              if (preview) URL.revokeObjectURL(preview);
              setFile(picked);
              setPreview(URL.createObjectURL(picked));
              setFilename(`photo-${Date.now()}`);
              setMessage("");
            }
            // Clear so picking the same file again still fires onChange.
            e.target.value = "";
          }}
        />
      </label>

      <SaveForm
        filename={filename}
        extension={file ? extensionOf(file.name) : ""}
        disabled={!file}
        saving={saving}
        message={message}
        onFilenameChange={setFilename}
        onSave={handleSave}
        onClear={clear}
      />
    </div>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.6l1.2-1.8A1.5 1.5 0 0 1 9.55 3.5h4.9a1.5 1.5 0 0 1 1.25.7L16.9 6h1.6A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
