"use client";

import { ContentError } from "@/components/shared/content-error";

export default function MissionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ContentError error={error} reset={reset} resource="미션" />;
}
