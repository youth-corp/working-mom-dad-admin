import { SiteHeader } from "@/components/nav/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const stats = [
  { label: "전체 사용자", value: "—", helper: "Supabase 연결 후 노출" },
  { label: "활성 자녀 프로필", value: "—", helper: "Child 테이블" },
  { label: "이번 주 미션 실행", value: "—", helper: "MissionExecution" },
  { label: "주간 리포트 생성", value: "—", helper: "WeeklyReport" },
];

const recentReviews = [
  {
    id: "r-001",
    type: "리포트",
    target: "주간 리포트 #4892",
    status: "검수 대기",
    updatedAt: "—",
  },
  {
    id: "r-002",
    type: "챗",
    target: "ChatSession #s-2031",
    status: "라벨링 진행",
    updatedAt: "—",
  },
  {
    id: "r-003",
    type: "콘텐츠",
    target: "미션 '아침 5분 스트레칭'",
    status: "초안",
    updatedAt: "—",
  },
];

export default function DashboardPage() {
  return (
    <>
      <SiteHeader crumbs={[{ label: "대시보드" }]} />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader>
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {s.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs">{s.helper}</p>
              </CardContent>
            </Card>
          ))}
        </section>
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>최근 검수 큐</CardTitle>
              <CardDescription>
                리포트·챗 검수 + 콘텐츠 초안. 실 데이터는 API 연결 후 채워짐.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">유형</TableHead>
                    <TableHead>대상</TableHead>
                    <TableHead className="w-32">상태</TableHead>
                    <TableHead className="w-32 text-right">갱신</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReviews.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Badge variant="secondary">{r.type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{r.target}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{r.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {r.updatedAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>운영 현황</CardTitle>
              <CardDescription>현재 환경 상태</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API 연결</span>
                <Badge variant="outline">미연결</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Supabase Auth</span>
                <Badge variant="outline">미연결</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">환경</span>
                <Badge>preview</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
