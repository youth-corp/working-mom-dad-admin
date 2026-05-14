"use client";

import type { MilestoneCategory } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  categories: MilestoneCategory[];
  value?: string;
  onValueChange: (id: string) => void;
  placeholder?: string;
};

export function CategorySelect({
  categories,
  value,
  onValueChange,
  placeholder = "카테고리 선택",
}: Props) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.label}{" "}
            <span className="text-muted-foreground text-xs">({c.id})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
