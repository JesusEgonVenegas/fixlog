"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "@/components/layout/page-container";
import { ProblemForm } from "@/components/problems/problem-form";
import { DeleteDialog } from "@/components/problems/delete-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Problem, CreateProblemInput } from "@/types";
import * as api from "@/lib/api";
import { toast } from "sonner";

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    api
      .getProblem(id)
      .then(setProblem)
      .catch(() => toast.error("Problem not found"))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated, authLoading, router]);

  async function handleUpdate(data: CreateProblemInput) {
    try {
      const updated = await api.updateProblem(id, data);
      setProblem(updated);
      setEditing(false);
      toast.success("Problem updated");
    } catch {
      toast.error("Failed to update problem");
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await api.deleteProblem(id);
      toast.success("Problem deleted");
      router.push("/problems");
    } catch {
      toast.error("Failed to delete problem");
      setIsDeleting(false);
    }
  }

  if (loading || authLoading) {
    return (
      <PageContainer>
        <p className="py-12 text-center text-muted-foreground">Loading...</p>
      </PageContainer>
    );
  }

  if (!problem) {
    return (
      <PageContainer>
        <p className="py-12 text-center text-muted-foreground">
          Problem not found.{" "}
          <Link href="/problems" className="text-primary underline">
            Back to list
          </Link>
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/problems">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {editing ? (
        <div className="max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold">Edit Problem</h1>
          <ProblemForm
            initialData={{
              title: problem.title,
              description: problem.description,
              solution: problem.solution,
              tags: problem.tags,
            }}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Pencil className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <DeleteDialog onConfirm={handleDelete} isDeleting={isDeleting} />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Created {new Date(problem.createdAt).toLocaleDateString()}
            {problem.updatedAt !== problem.createdAt &&
              ` · Updated ${new Date(problem.updatedAt).toLocaleDateString()}`}
          </p>

          <Separator className="my-6" />

          <section className="mb-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Problem
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {problem.description}
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Solution
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {problem.solution}
            </p>
          </section>
        </div>
      )}
    </PageContainer>
  );
}
