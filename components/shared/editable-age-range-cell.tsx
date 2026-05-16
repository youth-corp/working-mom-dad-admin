"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  from: number;
  to: number;
  onSave: (next: { from: number; to: number }) => Promise<void> | void;
  className?: string;
};

/**
 * 인라인 월령 범위(from~to) 편집.
 * 한 셀이 두 input을 가지고, 어느 쪽이든 blur 시 두 값을 함께 PATCH → from<=to 서버 검증과 정합.
 */
export function EditableAgeRangeCell({
  from,
  to,
  onSave,
  className,
}: Props) {
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const enterEdit = () => {
    setDraftFrom(from);
    setDraftTo(to);
    setEditing(true);
  };

  const commit = async () => {
    if (busy) return;
    if (draftFrom === from && draftTo === to) {
      setEditing(false);
      return;
    }
    if (draftFrom > draftTo) {
      setDraftFrom(from);
      setDraftTo(to);
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      await onSave({ from: draftFrom, to: draftTo });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <div
        className={cn(
          "flex items-center gap-1 px-1",
          className,
        )}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) commit();
        }}
      >
        <input
          autoFocus
          type="number"
          min={0}
          value={draftFrom}
          disabled={busy}
          onChange={(e) => setDraftFrom(Number(e.target.value))}
          className="w-12 bg-background border border-primary/40 rounded-sm px-1 py-0.5 outline-none focus:border-primary text-sm"
        />
        <span className="text-muted-foreground text-xs">~</span>
        <input
          type="number"
          min={0}
          value={draftTo}
          disabled={busy}
          onChange={(e) => setDraftTo(Number(e.target.value))}
          className="w-12 bg-background border border-primary/40 rounded-sm px-1 py-0.5 outline-none focus:border-primary text-sm"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={enterEdit}
      className={cn(
        "w-full text-left px-2 py-1 rounded-sm hover:bg-muted/50 text-sm",
        className,
      )}
    >
      {from}~{to}개월
    </button>
  );
}
