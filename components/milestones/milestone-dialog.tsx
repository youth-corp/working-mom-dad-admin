"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CategorySelect } from "@/components/shared/category-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminApi,
  type Milestone,
  type MilestoneCategory,
} from "@/lib/api";

type FormValues = {
  categoryId: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  title?: string;
  description: string;
  displayOrder?: number | "";
};

type Props = {
  categories: MilestoneCategory[];
  milestone?: Milestone;
  trigger: React.ReactNode;
};

export function MilestoneDialog({ categories, milestone, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = !!milestone;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: milestone
      ? {
          categoryId: milestone.categoryId,
          ageMonthsFrom: milestone.ageMonthsFrom,
          ageMonthsTo: milestone.ageMonthsTo,
          title: milestone.title ?? "",
          description: milestone.description,
          displayOrder: milestone.displayOrder ?? "",
        }
      : {
          categoryId: "",
          ageMonthsFrom: 0,
          ageMonthsTo: 12,
          title: "",
          description: "",
          displayOrder: "",
        },
  });

  const onSubmit = handleSubmit(async (values) => {
    const body = {
      categoryId: values.categoryId,
      ageMonthsFrom: Number(values.ageMonthsFrom),
      ageMonthsTo: Number(values.ageMonthsTo),
      title: values.title?.trim() ? values.title.trim() : undefined,
      description: values.description.trim(),
      displayOrder:
        values.displayOrder === "" || values.displayOrder === undefined
          ? undefined
          : Number(values.displayOrder),
    };
    try {
      if (isEdit && milestone) {
        await adminApi.milestones.update(milestone.id, body);
        toast.success("마일스톤이 수정되었습니다.");
      } else {
        await adminApi.milestones.create(body);
        toast.success("마일스톤이 생성되었습니다.");
        reset();
      }
      setOpen(false);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "요청 실패";
      toast.error(message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "발달 마일스톤 수정" : "발달 마일스톤 추가"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>
              카테고리 <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="categoryId"
              rules={{ required: "카테고리를 선택하세요." }}
              render={({ field }) => (
                <CategorySelect
                  categories={categories}
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                />
              )}
            />
            {errors.categoryId && (
              <p className="text-destructive text-xs">
                {errors.categoryId.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>
              월령 범위 <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                className="w-24"
                {...register("ageMonthsFrom", {
                  valueAsNumber: true,
                  required: true,
                  min: 0,
                })}
              />
              <span>~</span>
              <Input
                type="number"
                min={0}
                className="w-24"
                {...register("ageMonthsTo", {
                  valueAsNumber: true,
                  required: true,
                  min: 0,
                })}
              />
              <span className="text-muted-foreground text-sm">개월</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>제목 (선택)</Label>
            <Input
              {...register("title")}
              placeholder="예: 낯선 사람 경계"
            />
          </div>
          <div className="grid gap-2">
            <Label>
              설명 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={4}
              placeholder="발달 내용 상세"
              {...register("description", { required: true })}
            />
          </div>
          <div className="grid gap-2">
            <Label>정렬 순서 (선택)</Label>
            <Input
              type="number"
              min={0}
              className="w-24"
              {...register("displayOrder")}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
