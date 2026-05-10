import { PageStub } from "@/components/page-stub";

export default function MilestonesPage() {
  return (
    <PageStub
      crumbs={[
        { label: "콘텐츠", href: "/content/milestones" },
        { label: "발달 마일스톤" },
      ]}
      title="발달 마일스톤"
      description="Milestone 운영 — 월령별 발달 지표·카테고리."
      fields={["id", "ageMonths", "category", "title", "description"]}
    />
  );
}
