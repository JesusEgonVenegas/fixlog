"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { SearchBar } from "@/components/problems/search-bar";
import { ProblemCard } from "@/components/problems/problem-card";
import { TagFilter } from "@/components/problems/tag-filter";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { useAuth } from "@/hooks/use-auth";
import { Problem } from "@/types";
import { mockProblems } from "@/lib/mock-data";
import * as api from "@/lib/api";

function getAllTags(problems: Problem[]): string[] {
  const tagSet = new Set<string>();
  problems.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={<PageContainer><p className="py-12 text-center text-muted-foreground">Loading...</p></PageContainer>}>
      <ProblemsContent />
    </Suspense>
  );
}

function ProblemsContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (isDemo) {
      setProblems([...mockProblems]);
      setLoading(false);
      return;
    }
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .getProblems()
      .then((data) => {
        setProblems(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isDemo, isAuthenticated, authLoading]);

  const allTags = useMemo(() => getAllTags(problems), [problems]);
  const searched = useFuzzySearch(problems, query);

  const filtered = useMemo(() => {
    if (selectedTags.length === 0) return searched;
    return searched.filter((p) =>
      selectedTags.every((t) => p.tags.includes(t))
    );
  }, [searched, selectedTags]);

  const handleQueryChange = useCallback((v: string) => setQuery(v), []);
  const handleTagChange = useCallback((t: string[]) => setSelectedTags(t), []);

  if (!isDemo && !authLoading && !isAuthenticated) {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          <h2 className="mb-2 text-xl font-semibold">Sign in to view your problems</h2>
          <p className="mb-6 text-muted-foreground">
            You need an account to track and search your fixes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isDemo ? "Demo Problems" : "Problems"}
          </h1>
          {isDemo && (
            <p className="mt-1 text-sm text-muted-foreground">
              Sample data &mdash;{" "}
              <Link href="/register" className="text-primary underline">
                sign up
              </Link>{" "}
              to track your own fixes.
            </p>
          )}
        </div>
        <Button asChild>
          <Link href={isDemo ? "/problems/new?demo=true" : "/problems/new"}>
            <Plus className="mr-1 h-4 w-4" />
            New Problem
          </Link>
        </Button>
      </div>

      <div className="mb-4 space-y-3">
        <SearchBar value={query} onChange={handleQueryChange} />
        <TagFilter
          tags={allTags}
          selected={selectedTags}
          onChange={handleTagChange}
        />
      </div>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="py-12 text-center text-destructive">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No problems found. Try a different search or{" "}
          <Link href={isDemo ? "/problems/new?demo=true" : "/problems/new"} className="text-primary underline">
            create one
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} demo={isDemo} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
