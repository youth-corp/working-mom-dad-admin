"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number | null;
  onSave: (next: number | null) => Promise<void> | void;
  placeholder?: string;
  min?: number;
  className?: string;
  suffix?: string;
};

export function EditableNumberCell({
  value,
  onSave,
  placeholder = "-",
  min = 0,
  className,
  suffix,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value?.toString() ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(value?.toString() ?? "");
  }, [value]);

  const commit = async () => {
    if (busy) return;
    const trimmed = draft.trim();
    const next = trimmed === "" ? null : Number(trimmed);
    if (next !== null && (!Number.isFinite(next) || next < min)) {
      setDraft(value?.toString() ?? "");
      setEditing(false);
      return;
    }
    if (next === value) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      await onSave(next);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        inputMode="numeric"
        min={min}
        value={draft}
        disabled={busy}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(value?.toString() ?? "");
            setEditing(false);
          }
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className={cn(
          "w-full bg-background border border-primary/40 rounded-sm px-2 py-1 outline-none focus:border-primary text-sm",
          className,
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        "w-full text-left px-2 py-1 rounded-sm hover:bg-muted/50 text-sm",
        value === null && "text-muted-foreground",
        className,
      )}
    >
      {value === null ? placeholder : `${value}${suffix ?? ""}`}
    </button>
  );
}
