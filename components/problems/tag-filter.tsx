"use client";

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
      {tags.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={
              isSelected
                ? "inline-flex cursor-pointer items-center rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors"
                : "inline-flex cursor-pointer items-center rounded-full border border-border bg-transparent px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            }
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
