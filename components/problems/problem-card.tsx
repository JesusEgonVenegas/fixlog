import Link from "next/link";
import { Problem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stripMarkdown } from "@/lib/utils";

interface ProblemCardProps {
  problem: Problem;
  demo?: boolean;
}

export function ProblemCard({ problem, demo }: ProblemCardProps) {
  const href = demo
    ? `/problems/${problem.id}?demo=true`
    : `/problems/${problem.id}`;

  return (
    <Link href={href} className="block">
      <Card className="h-full flex flex-col transition-colors hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug line-clamp-2">
              {problem.title}
            </CardTitle>
            <time className="shrink-0 text-xs text-muted-foreground">
              {new Date(problem.createdAt).toLocaleDateString()}
            </time>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
            {stripMarkdown(problem.description)}
          </p>
          <p className="mb-3 text-sm line-clamp-2">
            {stripMarkdown(problem.solution)}
          </p>
          <div className="mt-auto flex flex-wrap gap-1">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
