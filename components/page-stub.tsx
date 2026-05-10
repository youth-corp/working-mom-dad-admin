import { SiteHeader } from "@/components/nav/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Crumb = { label: string; href?: string };

type PageStubProps = {
  crumbs: Crumb[];
  title: string;
  description: string;
  fields?: string[];
};

export function PageStub({ crumbs, title, description, fields }: PageStubProps) {
  return (
    <>
      <SiteHeader crumbs={crumbs} />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>API 연결 전 placeholder. 데이터 그리드·필터·검수 인터페이스는 후속 작업.</p>
            {fields && fields.length > 0 && (
              <div>
                <p className="text-foreground font-medium pb-1">예상 컬럼</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  {fields.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
