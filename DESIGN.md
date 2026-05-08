# Design System — yougabell-admin

> 운영자 CMS의 디자인 시스템. **사용자용 웹의 토큰을 재사용**하고, 운영자 컨텍스트(데이터 그리드·필터·감사 로그)에 맞춘 보강만 본 문서에서 다룬다.
> **단일 진실의 소스**: [yougabell-web `DESIGN.md`](https://github.com/four-lovely-fairies/yougabell-web/blob/main/DESIGN.md) — Color/Typography/Radius/Spacing/Elevation/Icons.

---

## 0. Figma 출처

- 운영자 화면은 현재 와이어프레임에 미노출. 디자인 결정 후 노드 ID 추가 예정.
- 토큰 출처: [Yougabell OS Figma](https://www.figma.com/design/sKdG5GEBZPdMjFY9nYj5g0) `2046:3807` (Foundation), `2046:4278` (Element).

---

## 1. 토큰 — 사용자 웹과 공유

다음은 모두 web의 `DESIGN.md` 정의를 그대로 사용한다:

- **Color**: Primary, Grayscale, Semantic (Error/Information/Warning/Success), Role 토큰
- **Typography**: Pretendard 12-style scale (`headline.h1`~`caption.2`)
- **Radius**: xs(4) / s(8) / m(12) / l(16) / xl(20) / full(999)
- **Spacing**: space.1~10 (2/4/8/12/16/20/24/32/40/48)
- **Elevation**: shadow.1~4
- **Icons**: 24px 기준, 12/16/20/24/32/40

---

## 2. 운영자 전용 보강 토큰

데이터 밀도가 높은 어드민 화면에서 추가로 쓰는 역할 토큰. (TBD — 첫 어드민 화면 구현 시 확정)

| 토큰                | 용도                | 후보 값                       |
| ------------------- | ------------------- | ----------------------------- |
| `surface.row.alt`   | 테이블 짝수 행 배경 | `gray.20` (`#FDFDFE`)         |
| `surface.row.hover` | 테이블 행 호버      | `primary.50` (`#F1EAFF`)      |
| `border.divider`    | 그리드 셀 디바이더  | `border.tertiary` (`#F6F6F6`) |
| `badge.role.admin`  | 관리자 배지         | `info.700` (`#0565FF`)        |
| `badge.status.warn` | 검수 대기 배지      | `warning.600` (`#FBDA2B`)     |

---

## 3. 화면 (Screens)

| 영역        | 라우트                                                                                       | 핵심 엔티티                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 인증        | `app/(auth)/`                                                                                | — (Supabase Auth)                                                                                                     |
| 콘텐츠 운영 | `app/content/missions/`, `app/content/care/`, `app/content/milestones/`, `app/content/tips/` | `Mission`, `MentalCareContent`, `Milestone`, `MilestoneCategory`, `ImprovementTip`, `InspirationQuote`, `PeerInsight` |
| 사용자 관리 | `app/users/`                                                                                 | `User`, `Child` (마스킹 표시)                                                                                         |
| 리포트 검수 | `app/reports/`                                                                               | `WeeklyReport` (샘플링)                                                                                               |
| 챗 검수     | `app/chats/`                                                                                 | `ChatSession`, `ChatMessage` (라벨링)                                                                                 |

> 모든 화면은 [`docs/schema/`](https://github.com/four-lovely-fairies/yougabell/tree/main/docs/schema) 도메인 모델과 1:1 매칭.

---

## 4. 작성 규칙 (Authoring rules)

### Do

- **개인정보 마스킹**: 이메일·이름·생년월일은 표시 시 마스킹 (`hong***@*.com`, `홍**`)
- **감사 로그**: 운영자 작업은 모두 감사 가능하게 — 감사 로그 테이블 미정 (TODO)
- **role 게이트**: 모든 라우트에 Supabase Auth + 운영자 role 검증
- **데이터 그리드**: 페이지네이션·정렬·필터 기본 제공
- **shadcn/ui Table**: 기본 컴포넌트로 사용
- **밀도**: 본문 텍스트는 `body.3` (14px) 권장. 헤딩은 `subtitle.2` 우선
- **버튼**: web의 `button` 컴포넌트 공유. 어드민에서는 `secondary`/`ghost` 사용 비중 높음

### Don't

- 사용자 ID/이메일을 URL 쿼리에 평문 노출 금지
- 일반 사용자 도메인과 같은 도메인 X — 운영자 전용 서브도메인
- `service_role_key`를 클라이언트 컴포넌트에 노출 금지 (서버 액션·route handler에서만)
- web 토큰을 어드민에서 임의로 재정의 금지 — 보강만 가능. 충돌 시 **web이 우선**

### 품질 게이트

1. `pnpm lint` 통과
2. role 미인증 사용자가 접근 시 redirect 동작 확인
3. 마스킹 적용 확인
4. 1280px / 1440px 데스크톱 뷰포트에서 그리드·필터 확인

---

## 5. Figma MCP 연결

운영자 화면 디자인이 추가되면 노드 ID 매핑 표 추가. 호출 방식은 web `DESIGN.md` 10번 섹션과 동일 (fileKey 공유).
