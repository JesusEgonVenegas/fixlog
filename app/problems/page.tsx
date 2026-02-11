"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { SearchBar } from "@/components/problems/search-bar";
import { ProblemCard } from "@/components/problems/problem-card";
import { TagFilter } from "@/components/problems/tag-filter";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { Problem } from "@/types";
import { getAllTags } from "@/lib/mock-data";
import * as api from "@/lib/api";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    api.getProblems().then((data) => {
      setProblems(data);
      setLoading(false);
    });
  }, []);

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

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Problems</h1>
        <Button asChild>
          <Link href="/problems/new">
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
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No problems found. Try a different search or{" "}
          <Link href="/problems/new" className="text-primary underline">
            create one
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
