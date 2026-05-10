import { PageStub } from "@/components/page-stub";

export default function ReportsPage() {
  return (
    <PageStub
      crumbs={[{ label: "리포트 검수" }]}
      title="주간 리포트 검수"
      description="WeeklyReport 샘플링·라벨링·이상 감지."
      fields={["id", "userId(마스킹)", "weekOf", "summary", "reviewStatus"]}
    />
  );
}
