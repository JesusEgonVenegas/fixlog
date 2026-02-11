"use client";

import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { ProblemForm } from "@/components/problems/problem-form";
import { CreateProblemInput } from "@/types";
import * as api from "@/lib/api";
import { toast } from "sonner";

export default function NewProblemPage() {
  const router = useRouter();

  async function handleSubmit(data: CreateProblemInput) {
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
