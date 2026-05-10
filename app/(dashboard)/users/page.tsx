import { PageStub } from "@/components/page-stub";

export default function UsersPage() {
  return (
    <PageStub
      crumbs={[{ label: "사용자" }]}
      title="사용자 관리"
      description="가입자 목록·자녀 프로필·온보딩 상태. 개인정보 마스킹 룰 적용 예정."
      fields={[
        "id (UUID, 마스킹)",
        "email (마스킹: hong***@*.com)",
        "name (마스킹: 홍**)",
        "workStatus",
        "onboardedAt",
        "children 수",
        "createdAt",
      ]}
    />
  );
}
