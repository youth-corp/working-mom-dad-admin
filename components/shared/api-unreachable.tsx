import { AdminApiError } from "@/lib/api";

type Props = {
  error: unknown;
  resource: string;
};

/**
 * SSR fetch 실패 시(주로 API 미배포·네트워크 차단) 빈 페이지 대신 안내 카드 표시.
 * AdminApiError(0)면 unreachable, 다른 status면 서버 응답 코드 노출.
 */
export function ApiUnreachable({ error, resource }: Props) {
  const status =
    error instanceof AdminApiError ? error.status : undefined;
  const title =
    status === 0
      ? "API 서버에 연결할 수 없습니다"
      : `${resource} 불러오기 실패`;
  const desc =
    status === 0
      ? "yougabell-api가 배포되지 않았거나 NEXT_PUBLIC_API_BASE_URL이 잘못되어 있습니다."
      : status
        ? `서버가 ${status}로 응답했습니다.`
        : "원인 미상.";

  return (
    <div className="rounded-md border border-dashed border-muted-foreground/30 p-8 text-center">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 text-sm">{desc}</p>
    </div>
  );
}
