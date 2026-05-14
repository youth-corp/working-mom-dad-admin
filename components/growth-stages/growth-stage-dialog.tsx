"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { adminApi, type GrowthStage } from "@/lib/api";

type FormValues = {
  id: string;
  name: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  summary: string;
};

type Props = {
  stage?: GrowthStage;
  trigger: React.ReactNode;
};

export function GrowthStageDialog({ stage, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = !!stage;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: stage
      ? {
          id: stage.id,
          name: stage.name,
          ageMonthsFrom: stage.ageMonthsFrom,
          ageMonthsTo: stage.ageMonthsTo,
          summary: stage.summary,
        }
      : {
          id: "",
          name: "",
          ageMonthsFrom: 0,
          ageMonthsTo: 12,
          summary: "",
        },
  });

  const onSubmit = handleSubmit(async (values) => {
    const body = {
      name: values.name.trim(),
      ageMonthsFrom: Number(values.ageMonthsFrom),
      ageMonthsTo: Number(values.ageMonthsTo),
      summary: values.summary.trim(),
    };
    try {
      if (isEdit && stage) {
        await adminApi.growthStages.update(stage.id, body);
        toast.success("성장 단계가 수정되었습니다.");
      } else {
        await adminApi.growthStages.create({ id: values.id.trim(), ...body });
        toast.success("성장 단계가 생성되었습니다.");
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
            {isEdit ? "성장 단계 수정" : "성장 단계 추가"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>
              ID (slug) <span className="text-destructive">*</span>
            </Label>
            <Input
              disabled={isEdit}
              placeholder="self-formation"
              {...register("id", {
                required: !isEdit,
                pattern: /^[a-z][a-z0-9-]*$/,
              })}
            />
            <p className="text-muted-foreground text-xs">
              영문 소문자·숫자·하이픈. 한 번 정하면 변경 불가.
            </p>
            {errors.id && !isEdit && (
              <p className="text-destructive text-xs">
                slug 형식이 올바르지 않습니다.
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>
              이름 <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="자아 형성기"
              {...register("name", { required: true })}
            />
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
            <Label>
              요약 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={4}
              placeholder="단계 요약"
              {...register("summary", { required: true })}
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
