# working-mom-dad-admin

> 운영자 CMS. 콘텐츠·사용자·리포트 관리.
> 워크스페이스 전체 컨벤션은 [`../CLAUDE.md`](../CLAUDE.md), 글로벌은 `~/.claude/CLAUDE.md` 참조.

## 스택

- Next.js 16 (App Router)
- Tailwind CSS + shadcn/ui (검토)
- TypeScript strict
- pnpm, Node 24 LTS
- Vercel 배포

## 핵심 원칙

- **운영자 전용**: 별도 도메인(`admin.youth.kr` 검토). Supabase Auth + role 게이트.
- **API 호출**: `working-mom-dad-api` OpenAPI 코드젠 클라이언트.
- **개인정보**: 사용자 정보 표시 시 마스킹 / 감사 로그.
- **컨텐츠 운영 대상**:
  - `Mission`, `MentalCareContent`, `Milestone`, `MilestoneCategory`
  - `ImprovementTip`, `InspirationQuote`, `PeerInsight`
- **WeeklyReport / Chat 검수 화면** — 샘플링 + 라벨링.

## 디렉토리 (예정, src 없는 형식)

```
.
├── app/
│   ├── (auth)/
│   ├── content/        # 콘텐츠 CMS
│   ├── users/          # 사용자 관리
│   ├── reports/        # 리포트 검수
│   └── api/
├── components/
├── lib/
└── styles/
```

> tsconfig paths: `@/*` → `./*` (src 제거 후 루트 기준)

## 환경 변수

운영자 키는 모두 서버 전용. `.env.example` 참조.

## 배포

Vercel — `main` → production, PR → preview.
