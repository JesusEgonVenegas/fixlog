import Link from "next/link";
import { Problem } from "@/types";
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
      <Card className="h-full flex flex-col border-l-2 border-l-transparent transition-all hover:border-l-primary/70 hover:border-primary/30 hover:bg-accent/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-[15px] font-bold leading-snug line-clamp-2">
              {problem.title}
            </CardTitle>
            <time className="shrink-0 font-mono text-xs text-muted-foreground">
              {new Date(problem.createdAt).toLocaleDateString()}
            </time>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
            {stripMarkdown(problem.description)}
          </p>
          <p className="mb-3 border-l-2 border-primary/30 pl-2 text-sm line-clamp-2">
            {stripMarkdown(problem.solution)}
          </p>
          <div className="mt-auto flex flex-wrap gap-1">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary hover:bg-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
