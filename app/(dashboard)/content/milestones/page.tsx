import { MilestonesTable } from "@/components/milestones/milestones-table";
import { adminApi } from "@/lib/api";

export default async function MilestonesPage() {
  const [list, categories] = await Promise.all([
    adminApi.milestones.list({ page: 1, pageSize: 500 }),
    adminApi.categories.list(),
  ]);
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">발달 마일스톤</h1>
        <p className="text-muted-foreground text-sm">
          월령별 발달 내용. AI 추천·홈 화면 카드의 소스 데이터.
        </p>
      </header>
      <MilestonesTable
        items={list.items}
        categories={categories}
        total={list.total}
      />
    </div>
  );
}
