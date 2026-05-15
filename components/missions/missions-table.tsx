"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { EditableNumberCell } from "@/components/shared/editable-number-cell";
import { EditableSelectCell } from "@/components/shared/editable-select-cell";
import { EditableTagsCell } from "@/components/shared/editable-tags-cell";
import { EditableTextCell } from "@/components/shared/editable-text-cell";
import { MissionDialog } from "./mission-dialog";
import {
  adminApi,
  type MilestoneCategory,
  type Mission,
  type UpdateMissionBody,
} from "@/lib/api";

type Props = {
  items: Mission[];
  categories: MilestoneCategory[];
  total: number;
};

export function MissionsTable({ items, categories, total }: Props) {
  const router = useRouter();
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.label,
  }));

  async function patch(id: string, body: UpdateMissionBody) {
    try {
      await adminApi.missions.update(id, body);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "저장 실패";
      toast.error(message);
      throw e;
    }
  }

  async function onDelete(id: string) {
    try {
      await adminApi.missions.remove(id);
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
          총 {total}건 · 셀 클릭으로 인라인 편집 (출처/썸네일은 ✎ 다이얼로그)
        </span>
        <MissionDialog
          categories={categories}
          trigger={
            <Button size="sm">
              <Plus className="size-4" /> 추가
            </Button>
          }
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[1400px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">카테고리</TableHead>
              <TableHead className="w-36">짧은 제목</TableHead>
              <TableHead className="min-w-[280px]">미션</TableHead>
              <TableHead className="w-20">시간</TableHead>
              <TableHead className="w-40">효과</TableHead>
              <TableHead className="w-24">권장 월령</TableHead>
              <TableHead className="w-48">목표</TableHead>
              <TableHead className="w-40">태그</TableHead>
              <TableHead className="w-20 text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id} className="align-top">
                <TableCell className="p-1">
                  <EditableSelectCell
                    value={m.categoryId}
                    options={categoryOptions}
                    onSave={(next) => patch(m.id, { categoryId: next })}
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableTextCell
                    value={m.shortTitle}
                    onSave={(next) =>
                      patch(m.id, { shortTitle: next ?? "" })
                    }
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableTextCell
                    value={m.description}
                    multiline
                    onSave={(next) =>
                      patch(m.id, { description: next ?? "" })
                    }
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableNumberCell
                    value={m.durationMinutes}
                    min={1}
                    suffix="분"
                    onSave={(next) =>
                      patch(m.id, { durationMinutes: next ?? 1 })
                    }
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableTextCell
                    value={m.effect}
                    onSave={(next) => patch(m.id, { effect: next ?? "" })}
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableNumberCell
                    value={m.recommendedAgeMonthsMin}
                    suffix="개월"
                    onSave={(next) =>
                      patch(m.id, {
                        recommendedAgeMonthsMin: next ?? undefined,
                        recommendedAgeMonthsMax: next ?? undefined,
                      })
                    }
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableTextCell
                    value={m.goal}
                    onSave={(next) =>
                      patch(m.id, { goal: next ?? undefined })
                    }
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableTagsCell
                    value={m.tags}
                    onSave={(next) => patch(m.id, { tags: next })}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <MissionDialog
                      categories={categories}
                      mission={m}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="다이얼로그 편집 (출처·썸네일)"
                        >
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />
                    <DeleteConfirmDialog
                      onConfirm={() => onDelete(m.id)}
                      title={`'${m.title}' 미션 삭제`}
                      description="태그·출처도 함께 삭제. 수행 기록(MissionExecution)이 있으면 FK 제약으로 실패할 수 있습니다."
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
                  colSpan={9}
                  className="text-muted-foreground py-12 text-center"
                >
                  등록된 미션이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
