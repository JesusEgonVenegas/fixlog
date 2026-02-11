"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { ProblemForm } from "@/components/problems/problem-form";
import { CreateProblemInput } from "@/types";
import * as api from "@/lib/api";
import { toast } from "sonner";

export default function NewProblemPage() {
  return (
    <Suspense fallback={<PageContainer><p className="py-12 text-center text-muted-foreground">Loading...</p></PageContainer>}>
      <NewProblemContent />
    </Suspense>
  );
}

function NewProblemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  async function handleSubmit(data: CreateProblemInput) {
    if (isDemo) {
      toast.success("Problem created (demo — won't persist on refresh)");
      router.push("/problems?demo=true");
      return;
    }
    try {
      await api.createProblem(data);
      toast.success("Problem created");
      router.push("/problems");
    } catch {
      toast.error("Failed to create problem");
    }
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-2xl font-bold">New Problem</h1>
      <div className="max-w-2xl">
        <ProblemForm onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
}
