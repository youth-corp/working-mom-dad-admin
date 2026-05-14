// api 호출 — server component에서 fetch.
// TODO(auth): admin namespace는 일단 무가드(dev only). AdminGuard 도입 후 Bearer/x-admin-secret 첨부.

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
      "x-user-id": process.env.ADMIN_DEV_USER_ID ?? "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} when listing users`);
  }
  return (await res.json()) as UsersListResponse;
}

// ============================================================
// admin 콘텐츠 운영 (milestones / growth-stages / missions / categories)
// ============================================================

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`Admin API ${status}`);
  }
}

async function adminRequest<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers as Record<string, string> | undefined),
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
    cache: "no-store",
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new AdminApiError(res.status, body);
  return body as T;
}

export type MilestoneCategory = {
  id: string;
  label: string;
  iconKey: string;
  color: string;
  displayOrder: number;
};

export type Milestone = {
  id: string;
  categoryId: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  title: string | null;
  description: string;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMilestoneBody = {
  categoryId: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  title?: string;
  description: string;
  displayOrder?: number;
};

export type UpdateMilestoneBody = Partial<CreateMilestoneBody>;

export type MilestoneListQuery = {
  categoryId?: string;
  ageMonths?: number;
  page?: number;
  pageSize?: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type GrowthStage = {
  id: string;
  name: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  summary: string;
};

export type CreateGrowthStageBody = {
  id: string;
  name: string;
  ageMonthsFrom: number;
  ageMonthsTo: number;
  summary: string;
};

export type UpdateGrowthStageBody = Omit<Partial<CreateGrowthStageBody>, "id">;

export type MissionSource = {
  citation: string;
  url: string | null;
  note: string | null;
};

export type Mission = {
  id: string;
  categoryId: string;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  effect: string;
  subThemeLabel: string | null;
  goal: string | null;
  recommendedAgeMonthsMin: number | null;
  recommendedAgeMonthsMax: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  tags: string[];
  sources: MissionSource[];
  createdAt: string;
  updatedAt: string;
};

export type CreateMissionBody = {
  categoryId: string;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  effect: string;
  subThemeLabel?: string;
  goal?: string;
  recommendedAgeMonthsMin?: number;
  recommendedAgeMonthsMax?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  tags?: string[];
  sources?: { citation: string; url?: string; note?: string }[];
};

export type UpdateMissionBody = Partial<CreateMissionBody>;

export type MissionListQuery = {
  categoryId?: string;
  ageMonths?: number;
  page?: number;
  pageSize?: number;
};

function buildSearch(record: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const adminApi = {
  categories: {
    list: () => adminRequest<MilestoneCategory[]>("/admin/categories"),
  },
  milestones: {
    list: (q: MilestoneListQuery = {}) =>
      adminRequest<Paginated<Milestone>>(`/admin/milestones${buildSearch(q)}`),
    create: (body: CreateMilestoneBody) =>
      adminRequest<Milestone>("/admin/milestones", {
        method: "POST",
        json: body,
      }),
    update: (id: string, body: UpdateMilestoneBody) =>
      adminRequest<Milestone>(`/admin/milestones/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/milestones/${id}`, { method: "DELETE" }),
  },
  growthStages: {
    list: () => adminRequest<GrowthStage[]>("/admin/growth-stages"),
    create: (body: CreateGrowthStageBody) =>
      adminRequest<GrowthStage>("/admin/growth-stages", {
        method: "POST",
        json: body,
      }),
    update: (id: string, body: UpdateGrowthStageBody) =>
      adminRequest<GrowthStage>(`/admin/growth-stages/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/growth-stages/${id}`, { method: "DELETE" }),
  },
  missions: {
    list: (q: MissionListQuery = {}) =>
      adminRequest<Paginated<Mission>>(`/admin/missions${buildSearch(q)}`),
    create: (body: CreateMissionBody) =>
      adminRequest<Mission>("/admin/missions", { method: "POST", json: body }),
    update: (id: string, body: UpdateMissionBody) =>
      adminRequest<Mission>(`/admin/missions/${id}`, {
        method: "PATCH",
        json: body,
      }),
    remove: (id: string) =>
      adminRequest<void>(`/admin/missions/${id}`, { method: "DELETE" }),
  },
};
