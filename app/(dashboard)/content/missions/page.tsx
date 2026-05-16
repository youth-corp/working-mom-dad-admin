import { MissionsTable } from "@/components/missions/missions-table";
import { ApiUnreachable } from "@/components/shared/api-unreachable";
import { adminApi } from "@/lib/api";

export default async function MissionsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">미션</h1>
        <p className="text-muted-foreground text-sm">
          10분 단위 부모-아이 상호작용 미션. 카테고리·태그·권장 월령으로
          분류된다.
        </p>
      </header>
      <MissionsContent />
    </div>
  );
}

async function MissionsContent() {
  try {
    const [list, categories] = await Promise.all([
      adminApi.missions.list({ page: 1, pageSize: 500 }),
      adminApi.categories.list(),
    ]);
    return (
      <MissionsTable
        items={list.items}
        categories={categories}
        total={list.total}
      />
    );
  } catch (e) {
    return <ApiUnreachable error={e} resource="미션" />;
  }
}
