"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";
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
import { EditableNumberCell } from "@/components/shared/editable-number-cell";
import { EditableSelectCell } from "@/components/shared/editable-select-cell";
import { EditableTextCell } from "@/components/shared/editable-text-cell";
import { useInfiniteCursor } from "@/hooks/use-infinite-cursor";
import { MilestoneDialog } from "./milestone-dialog";
import {
  adminApi,
  type Milestone,
  type MilestoneCategory,
  type UpdateMilestoneBody,
} from "@/lib/api";

const PAGE_SIZE = 50;

type Props = {
  initialItems: Milestone[];
  initialCursor: string | null;
  categories: MilestoneCategory[];
};

export function MilestonesTable({
  initialItems,
  initialCursor,
  categories,
}: Props) {
  const fetchMore = useCallback(
    (cursor: string) =>
      adminApi.milestones.list({ cursor, take: PAGE_SIZE }),
    [],
  );
  const { items, hasMore, loading, triggerRef } = useInfiniteCursor(
    initialItems,
    initialCursor,
    fetchMore,
  );
  const router = useRouter();
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.label,
  }));

  async function patch(id: string, body: UpdateMilestoneBody) {
    try {
      await adminApi.milestones.update(id, body);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "저장 실패";
      toast.error(message);
      throw e;
    }
  }

  async function onDelete(id: string) {
    try {
      await adminApi.milestones.remove(id);
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
          {items.length}건 로드됨{hasMore ? " (스크롤하면 더 불러옵니다)" : " · 전체"} · 셀 클릭으로 편집
        </span>
        <MilestoneDialog
          categories={categories}
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
              <TableHead className="w-32">카테고리</TableHead>
              <TableHead className="w-32">월령</TableHead>
              <TableHead className="w-48">제목</TableHead>
              <TableHead>설명</TableHead>
              <TableHead className="w-20">정렬</TableHead>
              <TableHead className="w-12 text-right" />
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
                  <EditableAgeRangeCell
                    from={m.ageMonthsFrom}
                    to={m.ageMonthsTo}
                    onSave={({ from, to }) =>
                      patch(m.id, {
                        ageMonthsFrom: from,
                        ageMonthsTo: to,
                      })
                    }
                  />
                </TableCell>
                <TableCell className="p-1">
                  <EditableTextCell
                    value={m.title}
                    onSave={(next) =>
                      patch(m.id, { title: next ?? undefined })
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
                    value={m.displayOrder}
                    onSave={(next) =>
                      patch(m.id, { displayOrder: next ?? undefined })
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DeleteConfirmDialog
                    onConfirm={() => onDelete(m.id)}
                    title="마일스톤 삭제"
                    description={`${m.ageMonthsFrom}~${m.ageMonthsTo}개월 마일스톤. 출처(Source)도 함께 삭제됩니다.`}
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
                  colSpan={6}
                  className="text-muted-foreground py-12 text-center"
                >
                  등록된 마일스톤이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasMore && (
        <div
          ref={triggerRef}
          className="text-muted-foreground py-4 text-center text-xs"
        >
          {loading ? "불러오는 중..." : "스크롤하면 더 보여집니다"}
        </div>
      )}
    </div>
  );
}
