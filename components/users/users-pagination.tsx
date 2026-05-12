import Link from "next/link";

type Props = {
  page: number;
  limit: number;
  total: number;
  baseQuery: URLSearchParams;
};

function buildHref(base: URLSearchParams, page: number): string {
  const next = new URLSearchParams(base.toString());
  next.set("page", String(page));
  return `/users?${next.toString()}`;
}

export function UsersPagination({ page, limit, total, baseQuery }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        {total === 0 ? "결과 없음" : `${start}–${end} / 총 ${total}명`}
      </span>
      <div className="flex items-center gap-2">
        {prevDisabled ? (
          <span className="h-9 px-3 inline-flex items-center rounded-md border border-zinc-200 text-zinc-400">
            이전
          </span>
        ) : (
          <Link
            href={buildHref(baseQuery, page - 1)}
            className="h-9 px-3 inline-flex items-center rounded-md border border-zinc-200 hover:bg-zinc-50"
          >
            이전
          </Link>
        )}
        <span className="text-muted-foreground">
          {page} / {totalPages}
        </span>
        {nextDisabled ? (
          <span className="h-9 px-3 inline-flex items-center rounded-md border border-zinc-200 text-zinc-400">
            다음
          </span>
        ) : (
          <Link
            href={buildHref(baseQuery, page + 1)}
            className="h-9 px-3 inline-flex items-center rounded-md border border-zinc-200 hover:bg-zinc-50"
          >
            다음
          </Link>
        )}
      </div>
    </div>
  );
}
