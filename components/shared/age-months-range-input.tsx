"use client";

import { Input } from "@/components/ui/input";

type Props = {
  from?: number;
  to?: number;
  onChange: (next: { from?: number; to?: number }) => void;
  fromPlaceholder?: string;
  toPlaceholder?: string;
};

export function AgeMonthsRangeInput({
  from,
  to,
  onChange,
  fromPlaceholder = "0",
  toPlaceholder = "60",
}: Props) {
  const parse = (raw: string): number | undefined => {
    if (raw === "") return undefined;
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 ? n : undefined;
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={0}
        inputMode="numeric"
        value={from ?? ""}
        placeholder={fromPlaceholder}
        onChange={(e) => onChange({ from: parse(e.target.value), to })}
      />
      <span className="text-muted-foreground text-sm">~</span>
      <Input
        type="number"
        min={0}
        inputMode="numeric"
        value={to ?? ""}
        placeholder={toPlaceholder}
        onChange={(e) => onChange({ from, to: parse(e.target.value) })}
      />
      <span className="text-muted-foreground text-sm">개월</span>
    </div>
  );
}
