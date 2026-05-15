"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string | null;
  onSave: (next: string | null) => Promise<void> | void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
};

/**
 * 구글시트 스타일 인라인 텍스트 셀.
 * - 클릭 또는 키보드 포커스로 편집 모드 진입
 * - Enter(single-line) 또는 Cmd/Ctrl+Enter(multiline) / blur → 저장
 * - Escape → 취소
 * - 값이 변하지 않으면 PATCH 호출 생략
 */
export function EditableTextCell({
  value,
  onSave,
  placeholder = "-",
  multiline = false,
  className,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  const commit = async () => {
    if (busy) return;
    const next = draft.trim() === "" ? null : draft;
    if (next === value) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      await onSave(next);
      setEditing(false);
    } catch {
      // 에러는 상위에서 toast 처리. draft 보존하여 재시도 가능.
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    setDraft(value ?? "");
    setEditing(false);
  };

  if (editing) {
    const sharedProps = {
      autoFocus: true,
      value: draft,
      disabled: busy,
      placeholder,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        if (e.key === "Escape") cancel();
        if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          commit();
        }
      },
      className: cn(
        "w-full bg-background border border-primary/40 rounded-sm px-2 py-1 outline-none focus:border-primary text-sm",
        className,
      ),
    };
    return multiline ? (
      <textarea
        {...(sharedProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        rows={3}
      />
    ) : (
      <input
        type="text"
        {...(sharedProps as React.InputHTMLAttributes<HTMLInputElement>)}
        ref={ref as React.RefObject<HTMLInputElement>}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        "w-full text-left px-2 py-1 rounded-sm hover:bg-muted/50 focus:outline-2 focus:outline-primary text-sm",
        !value && "text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "block",
          multiline ? "whitespace-pre-wrap break-words" : "truncate",
        )}
      >
        {value || placeholder}
      </span>
    </button>
  );
}
