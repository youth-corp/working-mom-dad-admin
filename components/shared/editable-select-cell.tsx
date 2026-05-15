"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type Props = {
  value: string | null;
  options: Option[];
  onSave: (next: string) => Promise<void> | void;
  placeholder?: string;
  className?: string;
};

export function EditableSelectCell({
  value,
  options,
  onSave,
  placeholder = "선택",
  className,
}: Props) {
  const [busy, setBusy] = useState(false);
  const label = options.find((o) => o.value === value)?.label ?? value;

  const handle = async (next: string) => {
    if (busy || next === value) return;
    setBusy(true);
    try {
      await onSave(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Select value={value ?? undefined} onValueChange={handle} disabled={busy}>
      <SelectTrigger
        className={cn(
          "h-auto min-h-[2rem] border-transparent shadow-none hover:bg-muted/50 focus:border-primary text-sm",
          !value && "text-muted-foreground",
          className,
        )}
      >
        <SelectValue placeholder={placeholder}>{label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
