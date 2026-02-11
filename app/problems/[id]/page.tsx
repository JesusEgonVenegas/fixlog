"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { toPng } from "html-to-image";
import { ArrowLeft, Camera, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "@/components/layout/page-container";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ProblemForm } from "@/components/problems/problem-form";
import { DeleteDialog } from "@/components/problems/delete-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Problem, CreateProblemInput } from "@/types";
import { mockProblems } from "@/lib/mock-data";
import * as api from "@/lib/api";
import { toast } from "sonner";

export default function ProblemDetailPage() {
  return (
    <Suspense fallback={<PageContainer><p className="py-12 text-center text-muted-foreground">Loading...</p></PageContainer>}>
      <ProblemDetailContent />
    </Suspense>
  );
}

function ProblemDetailContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyAsImage = useCallback(async () => {
    if (!contentRef.current) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(contentRef.current, {
        pixelRatio: 2,
        backgroundColor: resolvedTheme === "dark" ? "#1b1b1b" : "#ffffff",
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("Copied to clipboard as image");
      } catch {
        const link = document.createElement("a");
        link.download = `fixlog-${id}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Downloaded as image");
      }
    } catch {
      toast.error("Failed to capture image");
    } finally {
      setIsCapturing(false);
    }
  }, [id, resolvedTheme]);

  const backHref = isDemo ? "/problems?demo=true" : "/problems";

  useEffect(() => {
    if (isDemo) {
      const found = mockProblems.find((p) => p.id === id) ?? null;
      setProblem(found);
      setLoading(false);
      return;
    }
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
  }, [id, isDemo, isAuthenticated, authLoading, router]);

  async function handleUpdate(data: CreateProblemInput) {
    if (isDemo) {
      setProblem((prev) => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : prev);
      setEditing(false);
      toast.success("Updated (demo — won't persist on refresh)");
      return;
    }
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
    if (isDemo) {
      toast.success("Deleted (demo)");
      router.push("/problems?demo=true");
      return;
    }
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

  if (loading || (!isDemo && authLoading)) {
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
          <Link href={backHref} className="text-primary underline">
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
          <Link href={backHref}>
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
                onClick={handleCopyAsImage}
                disabled={isCapturing}
              >
                <Camera className="mr-1 h-4 w-4" />
                {isCapturing ? "Capturing..." : "Copy as image"}
              </Button>
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

          <div ref={contentRef} className="mt-4 rounded-lg border bg-background p-6">
            <h2 className="text-xl font-bold">{problem.title}</h2>

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
              <MarkdownRenderer content={problem.description} />
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Solution
              </h2>
              <MarkdownRenderer content={problem.solution} />
            </section>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
