import { MissionsTable } from "@/components/missions/missions-table";
import { adminApi } from "@/lib/api";

export default async function MissionsPage() {
  const [list, categories] = await Promise.all([
    adminApi.missions.list({ page: 1, pageSize: 100 }),
    adminApi.categories.list(),
  ]);
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">미션</h1>
        <p className="text-muted-foreground text-sm">
          10분 단위 부모-아이 상호작용 미션. 카테고리·태그·권장 월령으로
          분류된다.
        </p>
      </header>
      <MissionsTable
        items={list.items}
        categories={categories}
        total={list.total}
      />
    </div>
  );
}
