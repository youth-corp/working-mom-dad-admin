"use client";

import { Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
  resource: string;
};

/**
 * Next.js error.tsx에서 사용하는 공용 폴백 UI.
 * Server Component throw 시(주로 API 미연결·CORS 거부) 표시.
 */
export function ContentError({ error, reset, resource }: Props) {
  return (
    <div className="p-6">
      <div className="rounded-md border border-dashed border-muted-foreground/30 p-8 text-center">
        <h2 className="text-base font-semibold">{resource} 불러오기 실패</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {error.message || "API에 연결할 수 없습니다."}
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
          재시도
        </Button>
      </div>
    </div>
  );
}
