"use client";

type SaveFormProps = {
  filename: string;
  extension: string;
  disabled: boolean;
  saving: boolean;
  message: string;
  onFilenameChange: (value: string) => void;
  onSave: () => void;
  onClear: () => void;
};

// Shared name box, buttons and status line. Always rendered (disabled when
// nothing is selected) so the card keeps the same height in every state.
export default function SaveForm({
  filename,
  extension,
  disabled,
  saving,
  message,
  onFilenameChange,
  onSave,
  onClear,
}: SaveFormProps) {
  const ok = message.startsWith("Saved");

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">File name</span>
        <div className="flex h-11 items-center rounded-md sm:h-10 border border-border bg-surface focus-within:border-foreground has-disabled:opacity-50">
          <input
            type="text"
            value={filename}
            disabled={disabled || saving}
            placeholder="No file selected"
            onChange={(e) => onFilenameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none sm:text-sm placeholder:text-muted"
          />
          <span className="pr-3 font-mono text-xs text-muted">{extension}</span>
        </div>
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClear}
          disabled={disabled || saving}
          className="h-11 flex-1 rounded-md border sm:h-10 border-border text-sm font-medium transition-colors hover:bg-background disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={disabled || saving}
          className="flex h-11 flex-1 items-center sm:h-10 justify-center gap-2 rounded-md bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-30"
        >
          {saving && (
            <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {saving ? "Saving" : "Save"}
        </button>
      </div>

      {/* Fixed-height line so a message appearing doesn't push the layout. */}
      <p
        role="status"
        className={`h-5 truncate text-xs ${ok ? "text-success" : "text-danger"}`}
        title={message}
      >
        {message}
      </p>
    </div>
  );
}

export function extensionOf(name: string) {
  return name.match(/\.[^.]+$/)?.[0].toLowerCase() ?? "";
}
