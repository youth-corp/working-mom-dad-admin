"use client";

import { ContentError } from "@/components/shared/content-error";

export default function GrowthStagesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ContentError error={error} reset={reset} resource="성장 단계" />;
}
