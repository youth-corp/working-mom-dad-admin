import { GrowthStagesTable } from "@/components/growth-stages/growth-stages-table";
import { ApiUnreachable } from "@/components/shared/api-unreachable";
import { adminApi } from "@/lib/api";

export default async function GrowthStagesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">성장 단계</h1>
        <p className="text-muted-foreground text-sm">
          큰 발달 단계 (자아 형성기 등). 마일스톤과는 별개의 슬러그 PK.
        </p>
      </header>
      <GrowthStagesContent />
    </div>
  );
}

async function GrowthStagesContent() {
  try {
    const items = await adminApi.growthStages.list();
    return <GrowthStagesTable items={items} />;
  } catch (e) {
    return <ApiUnreachable error={e} resource="성장 단계" />;
  }
}
