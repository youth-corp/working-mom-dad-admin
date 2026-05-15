"use client";

import { Plus, Trash2 } from "lucide-react";
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
import { EditableAgeRangeCell } from "@/components/shared/editable-age-range-cell";
import { EditableTextCell } from "@/components/shared/editable-text-cell";
import { GrowthStageDialog } from "./growth-stage-dialog";
import {
  adminApi,
  type GrowthStage,
  type UpdateGrowthStageBody,
} from "@/lib/api";

type Props = {
  items: GrowthStage[];
};

export function GrowthStagesTable({ items }: Props) {
  const router = useRouter();

  async function patch(id: string, body: UpdateGrowthStageBody) {
    try {
      await adminApi.growthStages.update(id, body);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "저장 실패";
      toast.error(message);
      throw e;
    }
  }

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
        <span className="text-muted-foreground text-sm">
          총 {items.length}건 · 셀 클릭으로 인라인 편집 (id slug는 변경 불가)
        </span>
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
              <TableHead className="w-32">월령</TableHead>
              <TableHead>요약</TableHead>
              <TableHead className="w-12 text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id} className="align-top">
                <TableCell className="font-mono text-xs px-3 py-2">
                  {s.id}
                </TableCell>
                <TableCell className="p-1">
                  <EditableTextCell
                    value={s.name}
                    onSave={(next) => patch(s.id, { name: next ?? "" })}
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableAgeRangeCell
                    from={s.ageMonthsFrom}
                    to={s.ageMonthsTo}
                    onSave={({ from, to }) =>
                      patch(s.id, { ageMonthsFrom: from, ageMonthsTo: to })
                    }
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableTextCell
                    value={s.summary}
                    multiline
                    onSave={(next) => patch(s.id, { summary: next ?? "" })}
                  />
                </TableCell>
                <TableCell className="text-right">
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
