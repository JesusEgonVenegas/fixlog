"use client";

import { useMemo } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";
import { Problem } from "@/types";

const fuseOptions: IFuseOptions<Problem> = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "description", weight: 0.25 },
    { name: "solution", weight: 0.25 },
    { name: "tags", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
};

export function useFuzzySearch(problems: Problem[], query: string): Problem[] {
  const fuse = useMemo(() => new Fuse(problems, fuseOptions), [problems]);

  return useMemo(() => {
    if (!query.trim()) return problems;
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query, problems]);
}
