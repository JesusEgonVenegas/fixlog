import Link from "next/link";
import { Problem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link href={`/problems/${problem.id}`} className="block">
      <Card className="transition-colors hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">
              {problem.title}
            </CardTitle>
            <time className="shrink-0 text-xs text-muted-foreground">
              {new Date(problem.createdAt).toLocaleDateString()}
            </time>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
            {problem.description}
          </p>
          <p className="mb-3 text-sm line-clamp-2">{problem.solution}</p>
          <div className="flex flex-wrap gap-1">
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
