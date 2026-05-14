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
  type MilestoneCategory,
  type Mission,
} from "@/lib/api";

type FormValues = {
  categoryId: string;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  effect: string;
  subThemeLabel?: string;
  recommendedAgeMonthsMin?: number | "";
  recommendedAgeMonthsMax?: number | "";
  thumbnailUrl?: string;
  videoUrl?: string;
  tagsInput?: string; // 쉼표로 분리해 입력
};

type Props = {
  categories: MilestoneCategory[];
  mission?: Mission;
  trigger: React.ReactNode;
};

function splitTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function MissionDialog({ categories, mission, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = !!mission;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: mission
      ? {
          categoryId: mission.categoryId,
          title: mission.title,
          shortTitle: mission.shortTitle,
          description: mission.description,
          durationMinutes: mission.durationMinutes,
          effect: mission.effect,
          subThemeLabel: mission.subThemeLabel ?? "",
          recommendedAgeMonthsMin: mission.recommendedAgeMonthsMin ?? "",
          recommendedAgeMonthsMax: mission.recommendedAgeMonthsMax ?? "",
          thumbnailUrl: mission.thumbnailUrl ?? "",
          videoUrl: mission.videoUrl ?? "",
          tagsInput: mission.tags.join(", "),
        }
      : {
          categoryId: "",
          title: "",
          shortTitle: "",
          description: "",
          durationMinutes: 10,
          effect: "",
          subThemeLabel: "",
          recommendedAgeMonthsMin: "",
          recommendedAgeMonthsMax: "",
          thumbnailUrl: "",
          videoUrl: "",
          tagsInput: "",
        },
  });

  const onSubmit = handleSubmit(async (values) => {
    const optNum = (v?: number | "") =>
      v === "" || v === undefined ? undefined : Number(v);
    const optStr = (v?: string) => (v?.trim() ? v.trim() : undefined);
    const body = {
      categoryId: values.categoryId,
      title: values.title.trim(),
      shortTitle: values.shortTitle.trim(),
      description: values.description.trim(),
      durationMinutes: Number(values.durationMinutes),
      effect: values.effect.trim(),
      subThemeLabel: optStr(values.subThemeLabel),
      recommendedAgeMonthsMin: optNum(values.recommendedAgeMonthsMin),
      recommendedAgeMonthsMax: optNum(values.recommendedAgeMonthsMax),
      thumbnailUrl: optStr(values.thumbnailUrl),
      videoUrl: optStr(values.videoUrl),
      tags: splitTags(values.tagsInput),
    };
    try {
      if (isEdit && mission) {
        await adminApi.missions.update(mission.id, body);
        toast.success("미션이 수정되었습니다.");
      } else {
        await adminApi.missions.create(body);
        toast.success("미션이 생성되었습니다.");
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
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "미션 수정" : "미션 추가"}</DialogTitle>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>
                제목 <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="아이와 10분 가까워지기"
                {...register("title", { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label>
                짧은 제목 <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="10분 아이컨텍"
                {...register("shortTitle", { required: true })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>
              설명 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={4}
              placeholder="미션 상세 본문"
              {...register("description", { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>
                소요(분) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                {...register("durationMinutes", {
                  valueAsNumber: true,
                  required: true,
                  min: 1,
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label>
                효과 <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="정서적 안정감"
                {...register("effect", { required: true })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>서브 테마 (선택)</Label>
            <Input
              placeholder="예: 아이와 가까워지기"
              {...register("subThemeLabel")}
            />
          </div>

          <div className="grid gap-2">
            <Label>권장 월령 범위 (선택)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                className="w-24"
                {...register("recommendedAgeMonthsMin")}
              />
              <span>~</span>
              <Input
                type="number"
                min={0}
                className="w-24"
                {...register("recommendedAgeMonthsMax")}
              />
              <span className="text-muted-foreground text-sm">개월</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>썸네일 URL (선택)</Label>
              <Input
                placeholder="https://..."
                {...register("thumbnailUrl")}
              />
            </div>
            <div className="grid gap-2">
              <Label>영상 URL (선택)</Label>
              <Input placeholder="https://..." {...register("videoUrl")} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>태그 (쉼표로 구분)</Label>
            <Input
              placeholder="감정, 말놀이, 신체"
              {...register("tagsInput")}
            />
            <p className="text-muted-foreground text-xs">
              예: <code>감정, 말놀이</code> → 자동 trim·중복 제거.
            </p>
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
