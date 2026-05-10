import { PageStub } from "@/components/page-stub";

export default function MissionsPage() {
  return (
    <PageStub
      crumbs={[
        { label: "콘텐츠", href: "/content/missions" },
        { label: "미션" },
      ]}
      title="미션 콘텐츠"
      description="Mission 엔티티 운영 — 추가·편집·발행·아카이브."
      fields={["id", "title", "category", "ageRange", "status", "publishedAt"]}
    />
  );
}
