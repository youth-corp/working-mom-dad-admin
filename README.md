# working-mom-dad-admin

> Working Mom Dad — 운영자 CMS.
> 미션·마일스톤·콘텐츠·시드 데이터 관리 / 사용자 관리 / 리포트 모니터링.
> Next.js 16 + Tailwind, Vercel 배포.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS
- TypeScript (strict)
- pnpm
- Node 24 LTS

## Quick start

```bash
nvm use
pnpm install
cp .env.example .env.local
pnpm dev
```

## Role

- 콘텐츠 운영: `Mission`, `MentalCareContent`, `Milestone`, `MilestoneCategory`, `ImprovementTip`, `InspirationQuote`
- 사용자/자녀 모니터링 (개인정보 마스킹)
- 주간 리포트 검수 / AI 응답 샘플 검토
- Supabase Auth + 운영자 역할(role) 게이트

## Hosting

Vercel — 별도 도메인(예: `admin.youth.kr`)

## 관련 문서

- 워크스페이스 큰 그림: [`../CLAUDE.md`](../CLAUDE.md)
- 레포 전략: [`../docs/design/00-repo-strategy.md`](../docs/design/00-repo-strategy.md)
- 도메인 스키마: [`../docs/schema/`](../docs/schema/)
