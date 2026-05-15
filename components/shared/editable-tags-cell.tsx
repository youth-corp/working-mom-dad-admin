"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  value: string[];
  onSave: (next: string[]) => Promise<void> | void;
  placeholder?: string;
  className?: string;
};

function joinTags(tags: string[]) {
  return tags.join(", ");
}
function splitTags(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ];
}

export function EditableTagsCell({
  value,
  onSave,
  placeholder = "쉼표로 구분",
  className,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(joinTags(value));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(joinTags(value));
  }, [value]);

  const commit = async () => {
    if (busy) return;
    const next = splitTags(draft);
    const same =
      next.length === value.length && next.every((t, i) => t === value[i]);
    if (same) {
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
        value={draft}
        disabled={busy}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(joinTags(value));
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
        "w-full text-left px-2 py-1 rounded-sm hover:bg-muted/50 flex flex-wrap gap-1 min-h-[2rem]",
        className,
      )}
    >
      {value.length === 0 ? (
        <span className="text-muted-foreground text-xs">{placeholder}</span>
      ) : (
        value.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))
      )}
    </button>
  );
}
