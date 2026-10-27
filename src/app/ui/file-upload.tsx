"use client";

import { useState } from "react";
import { saveFile } from "@/app/lib/actions";
import { checkSize } from "@/app/lib/limits";
import SaveForm, { extensionOf } from "@/app/ui/save-form";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  function pick(picked: File | undefined) {
    if (!picked) return;

    // Images up to 4 MB, other files up to 25 MB. Reject before uploading anything.
    const sizeError = checkSize(picked);
    if (sizeError) {
      setMessage(sizeError);
      return;
    }

    setFile(picked);
    // Start from the original name without its extension, e.g. "report" from "report.pdf".
    setFilename(picked.name.replace(/\.[^.]+$/, ""));
    setMessage("");
  }

  function clear() {
    setFile(null);
    setFilename("");
  }

  async function handleSave() {
    if (!file) return;
    setSaving(true);
    const result = await saveFile(file, filename);
    setMessage(result);
    setSaving(false);

    // Clear the selection once saved; keep it on error so the name can be fixed.
    if (result.startsWith("Saved")) clear();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Same fixed-size box whether empty or showing the selected file. */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files[0]);
        }}
        className={`relative flex h-48 cursor-pointer sm:h-56 items-center justify-center rounded-md border border-dashed bg-background px-4 text-center sm:px-6 transition-colors hover:border-muted ${
          dragging ? "border-foreground" : "border-border"
        }`}
      >
        {file ? (
          <span className="flex max-w-full flex-col items-center gap-2">
            <span className="flex h-12 w-10 items-center justify-center rounded border border-border bg-surface font-mono text-[10px] font-medium uppercase text-muted">
              {extensionOf(file.name).slice(1, 5) || "file"}
            </span>
            <span className="max-w-full truncate text-sm">{file.name}</span>
            <span className="text-xs text-muted">{formatSize(file.size)} · Tap to change</span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-2 text-muted">
            <UploadIcon />
            <span className="text-sm text-foreground">
              Choose a file<span className="hidden sm:inline"> or drag it here</span>
            </span>
            <span className="text-xs">Images up to 4 MB · Other files up to 25 MB</span>
          </span>
        )}
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
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

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v2.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V15" />
    </svg>
  );
}
