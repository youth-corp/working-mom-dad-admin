import { PageStub } from "@/components/page-stub";

export default function ChatsPage() {
  return (
    <PageStub
      crumbs={[{ label: "챗 검수" }]}
      title="챗봇 세션 검수"
      description="ChatSession·ChatMessage 라벨링 — 응답 품질·안전성 확인."
      fields={[
        "sessionId",
        "userId(마스킹)",
        "messageCount",
        "lastMessageAt",
        "label",
      ]}
    />
  );
}
