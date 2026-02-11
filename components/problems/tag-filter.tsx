"use client";

import { Badge } from "@/components/ui/badge";

interface TagFilterProps {
  tags: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function TagFilter({ tags, selected, onChange }: TagFilterProps) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={selected.includes(tag) ? "default" : "outline"}
          className="cursor-pointer text-xs"
          onClick={() => toggle(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
