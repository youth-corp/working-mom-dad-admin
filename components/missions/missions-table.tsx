"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { MissionDialog } from "./mission-dialog";
import {
  adminApi,
  type MilestoneCategory,
  type Mission,
} from "@/lib/api";

type Props = {
  items: Mission[];
  categories: MilestoneCategory[];
  total: number;
};

export function MissionsTable({ items, categories, total }: Props) {
  const router = useRouter();
  const labelOf = (id: string) =>
    categories.find((c) => c.id === id)?.label ?? id;

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
        <span className="text-muted-foreground text-sm">총 {total}건</span>
        <MissionDialog
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
              <TableHead>제목</TableHead>
              <TableHead className="w-20">시간</TableHead>
              <TableHead className="w-32">권장 월령</TableHead>
              <TableHead className="w-48">태그</TableHead>
              <TableHead className="w-28 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{labelOf(m.categoryId)}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{m.title}</span>
                    <span className="text-muted-foreground text-xs">
                      {m.shortTitle}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{m.durationMinutes}분</TableCell>
                <TableCell>
                  {m.recommendedAgeMonthsMin === null &&
                  m.recommendedAgeMonthsMax === null
                    ? "-"
                    : `${m.recommendedAgeMonthsMin ?? "0"}~${m.recommendedAgeMonthsMax ?? "∞"}개월`}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {m.tags.length === 0 ? (
                      <span className="text-muted-foreground text-xs">-</span>
                    ) : (
                      m.tags.map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <MissionDialog
                      categories={categories}
                      mission={m}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="편집">
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />
                    <DeleteConfirmDialog
                      onConfirm={() => onDelete(m.id)}
                      title={`'${m.title}' 미션 삭제`}
                      description="태그도 함께 삭제됩니다. 수행 기록(MissionExecution)이 있으면 FK 제약으로 실패할 수 있습니다."
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
