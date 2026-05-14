"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { GrowthStageDialog } from "./growth-stage-dialog";
import { adminApi, type GrowthStage } from "@/lib/api";

type Props = {
  items: GrowthStage[];
};

export function GrowthStagesTable({ items }: Props) {
  const router = useRouter();

  async function onDelete(id: string) {
    try {
      await adminApi.growthStages.remove(id);
      toast.success("삭제되었습니다.");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "삭제 실패";
      toast.error(message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">총 {items.length}건</span>
        <GrowthStageDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" /> 추가
            </Button>
          }
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">ID (slug)</TableHead>
              <TableHead className="w-40">이름</TableHead>
              <TableHead className="w-28">월령</TableHead>
              <TableHead>요약</TableHead>
              <TableHead className="w-28 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  {s.ageMonthsFrom}~{s.ageMonthsTo}개월
                </TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">
                  {s.summary}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <GrowthStageDialog
                      stage={s}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="편집">
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />
                    <DeleteConfirmDialog
                      onConfirm={() => onDelete(s.id)}
                      title={`'${s.name}' 단계 삭제`}
                      description="자기참조 sideTags 관계도 함께 정리됩니다."
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="삭제">
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-12 text-center"
                >
                  등록된 성장 단계가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
