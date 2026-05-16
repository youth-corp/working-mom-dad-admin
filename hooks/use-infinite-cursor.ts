"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type FetchPage<T> = (cursor: string) => Promise<{
  items: T[];
  nextCursor: string | null;
}>;

/**
 * 커서 기반 무한 스크롤 hook.
 * - 첫 페이지(initialItems + initialCursor)는 SSR로 받음
 * - `triggerRef`를 sentinel 요소에 부착 → 뷰포트 진입 시 다음 페이지 자동 로드
 * - error 발생 시 observer 비활성 → 무한 retry 차단. 재시도는 `retry()`로 명시 호출.
 * - SSR refresh(부모 router.refresh)로 새 initial props가 들어오면 누적 state도 reset
 *   — render-time conditional setState 패턴 (useEffect set-state 안티패턴 회피)
 */
export function useInfiniteCursor<T>(
  initialItems: T[],
  initialCursor: string | null,
  fetchMore: FetchPage<T>,
) {
  const [prevInitial, setPrevInitial] = useState({
    items: initialItems,
    cursor: initialCursor,
  });
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  if (
    prevInitial.items !== initialItems ||
    prevInitial.cursor !== initialCursor
  ) {
    setPrevInitial({ items: initialItems, cursor: initialCursor });
    setItems(initialItems);
    setCursor(initialCursor);
    setError(null);
  }

  const loadMore = useCallback(async () => {
    if (!cursor || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMore(cursor);
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, fetchMore]);

  useEffect(() => {
    const el = triggerRef.current;
    // error가 발생하면 observer 비활성 → 무한 retry 차단. retry는 명시 호출로.
    if (!el || !cursor || error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cursor, loadMore, error]);

  const retry = useCallback(() => {
    setError(null);
    void loadMore();
  }, [loadMore]);

  return {
    items,
    cursor,
    hasMore: cursor !== null,
    loading,
    error,
    loadMore,
    retry,
    triggerRef,
  };
}
