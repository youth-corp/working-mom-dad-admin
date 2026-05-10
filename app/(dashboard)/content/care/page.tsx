import { PageStub } from "@/components/page-stub";

export default function CarePage() {
  return (
    <PageStub
      crumbs={[
        { label: "콘텐츠", href: "/content/care" },
        { label: "마음 케어" },
      ]}
      title="마음 케어 콘텐츠"
      description="MentalCareContent 운영 — 카테고리·발행 상태 관리."
      fields={["id", "category", "title", "body", "status"]}
    />
  );
}
