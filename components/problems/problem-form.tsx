"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/problems/tag-input";
import { CreateProblemInput } from "@/types";

interface ProblemFormProps {
  initialData?: CreateProblemInput;
  onSubmit: (data: CreateProblemInput) => Promise<void>;
  submitLabel?: string;
}

export function ProblemForm({
  initialData,
  onSubmit,
  submitLabel = "Create Problem",
}: ProblemFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [solution, setSolution] = useState(initialData?.solution ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ title, description, solution, tags });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Short summary of the problem"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Problem description</Label>
        <Textarea
          id="description"
          placeholder="What went wrong? What symptoms did you see?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="solution">Solution</Label>
        <Textarea
          id="solution"
          placeholder="How did you fix it? Include commands, config changes, etc."
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
