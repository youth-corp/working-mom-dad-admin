import { GrowthStagesTable } from "@/components/growth-stages/growth-stages-table";
import { adminApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function GrowthStagesPage() {
  const items = await adminApi.growthStages.list();
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">성장 단계</h1>
        <p className="text-muted-foreground text-sm">
          큰 발달 단계 (자아 형성기 등). 마일스톤과는 별개의 슬러그 PK.
        </p>
      </header>
      <GrowthStagesTable items={items} />
    </div>
  );
}
