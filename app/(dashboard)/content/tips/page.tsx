import { PageStub } from "@/components/page-stub";

export default function TipsPage() {
  return (
    <PageStub
      crumbs={[
        { label: "콘텐츠", href: "/content/tips" },
        { label: "팁·인용구" },
      ]}
      title="팁·인용구·또래 인사이트"
      description="ImprovementTip / InspirationQuote / PeerInsight 통합 운영."
      fields={["type", "title", "body", "tags", "status"]}
    />
  );
}
