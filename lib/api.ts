// api 호출 — server component에서 fetch.
// TODO(auth): 운영자 토큰 헤더 (Supabase admin session). 현재는 x-user-id placeholder.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type UserListItem = {
  id: string;
  name: string;
  birthDate: string;
  gender: "female" | "male";
  workStatus: "working" | "full_time_caregiver" | null;
  onboardedAt: string | null;
  childrenCount: number;
  createdAt: string;
};

export type UsersListResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
};

export type ListUsersQuery = {
  onboarded?: "true" | "false" | "all";
  q?: string;
  page?: number;
  limit?: number;
};

export async function listUsers(
  query: ListUsersQuery = {},
): Promise<UsersListResponse> {
  const search = new URLSearchParams();
  if (query.onboarded) search.set("onboarded", query.onboarded);
  if (query.q) search.set("q", query.q);
  if (query.page) search.set("page", String(query.page));
  if (query.limit) search.set("limit", String(query.limit));

  const res = await fetch(`${BASE_URL}/admin/users?${search.toString()}`, {
    headers: {
      // TODO(auth): Supabase admin session → Authorization Bearer
      "x-user-id": process.env.ADMIN_DEV_USER_ID ?? "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} when listing users`);
  }
  return (await res.json()) as UsersListResponse;
}
