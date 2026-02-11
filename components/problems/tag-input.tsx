"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border px-3 py-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 text-xs">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-0.5 rounded-full hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? "Add tags (press Enter or comma)" : ""}
        className="h-auto min-w-[120px] flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
