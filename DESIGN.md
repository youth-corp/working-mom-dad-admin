# Design System — yougabell-admin

> 운영자 CMS의 디자인 시스템 컨텍스트. AI 코딩 에이전트가 UI 코드를 생성할 때 참고.
> **현재 placeholder** — 운영자 화면은 와이어프레임에 미노출이라 디자인 결정 후 갱신.

> 참고 디자인: 사용자용 웹의 토큰을 재사용하되 운영자 컨텍스트(데이터 그리드·필터·감사 로그)에 맞춰 보강.

---

## 1. 토큰 (TBD)

- 사용자용 웹과 **공통 토큰 재사용**이 기본. 운영자 화면 전용 색상은 최소화.
- 데이터 그리드·테이블 강조색은 별도 토큰: `surface.row.alt`, `border.divider` 등 (TBD)

---

## 2. 화면 (Screens)

| 영역 | 라우트 | 핵심 엔티티 |
|---|---|---|
| 인증 | `app/(auth)/` | — (Supabase Auth) |
| 콘텐츠 운영 | `app/content/missions/`, `app/content/care/`, `app/content/milestones/`, `app/content/tips/` | `Mission`, `MentalCareContent`, `Milestone`, `MilestoneCategory`, `ImprovementTip`, `InspirationQuote`, `PeerInsight` |
| 사용자 관리 | `app/users/` | `User`, `Child` (마스킹 표시) |
| 리포트 검수 | `app/reports/` | `WeeklyReport` (샘플링) |
| 챗 검수 | `app/chats/` | `ChatSession`, `ChatMessage` (라벨링) |

> 모든 화면은 [`docs/schema/`](https://github.com/four-lovely-fairies/yougabell-api/tree/main/docs/schema) 도메인 모델과 1:1 매칭.

---

## 3. 작성 규칙 (Authoring rules)

### Do

- **개인정보 마스킹**: 이메일·이름·생년월일은 표시 시 마스킹 (`hong***@*.com`, `홍**`)
- **감사 로그**: 운영자 작업은 모두 감사 가능하게 — `audit log` 테이블 미정 (TODO)
- **role 게이트**: 모든 라우트에 Supabase Auth + 운영자 role 검증
- **데이터 그리드**: 페이지네이션·정렬·필터 기본 제공
- **shadcn/ui Table**: 기본 컴포넌트로 사용

### Don't

- 사용자 ID/이메일을 URL 쿼리에 평문 노출 금지
- 일반 사용자 도메인(`youth.kr`)과 같은 도메인 X — 운영자 전용 서브도메인
- `service_role_key`를 클라이언트 컴포넌트에 노출 금지 (서버 액션·route handler에서만)

### 품질 게이트

1. `pnpm lint` 통과
2. role 미인증 사용자가 접근 시 redirect 동작 확인
3. 마스킹 적용 확인

---

## 4. Figma MCP 연결 (TODO)

운영자 화면 디자인이 추가되면 Figma 노드 ID 매핑 표 추가.
