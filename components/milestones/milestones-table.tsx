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
import { MilestoneDialog } from "./milestone-dialog";
import {
  adminApi,
  type Milestone,
  type MilestoneCategory,
} from "@/lib/api";

type Props = {
  items: Milestone[];
  categories: MilestoneCategory[];
  total: number;
};

export function MilestonesTable({ items, categories, total }: Props) {
  const router = useRouter();
  const labelOf = (id: string) =>
    categories.find((c) => c.id === id)?.label ?? id;

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
        <span className="text-muted-foreground text-sm">총 {total}건</span>
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
              <TableHead className="w-28">월령</TableHead>
              <TableHead className="w-48">제목</TableHead>
              <TableHead>설명</TableHead>
              <TableHead className="w-16">정렬</TableHead>
              <TableHead className="w-28 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{labelOf(m.categoryId)}</TableCell>
                <TableCell>
                  {m.ageMonthsFrom}~{m.ageMonthsTo}개월
                </TableCell>
                <TableCell>{m.title ?? "-"}</TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">
                  {m.description}
                </TableCell>
                <TableCell>{m.displayOrder ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <MilestoneDialog
                      categories={categories}
                      milestone={m}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="편집">
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />
                    <DeleteConfirmDialog
                      onConfirm={() => onDelete(m.id)}
                      title={`'${m.title ?? labelOf(m.categoryId)}' 삭제`}
                      description={`${m.ageMonthsFrom}~${m.ageMonthsTo}개월 마일스톤을 삭제합니다. 출처(Source) 데이터도 함께 삭제됩니다.`}
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
    </div>
  );
}
