# FixLog UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign FixLog's UI from default shadcn/ui achromatic styles to a bold, modern mint-accented aesthetic across all pages.

**Architecture:** Pure styling changes across 11 existing files. No new components, no layout restructuring, no backend changes. The foundation is updating CSS custom property tokens in `globals.css` (mint primary + cool-tinted dark background), then applying those tokens consistently across every component via Tailwind utility classes.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, lucide-react, TypeScript

---

## File Map

| File | What changes |
|---|---|
| `app/globals.css` | Replace color tokens with mint-accented palette |
| `components/layout/header.tsx` | Mint logo, pill user name, simplified nav links |
| `app/page.tsx` | Hero gradient, mint headline, feature + demo card styles |
| `components/landing-cta.tsx` | View Demo button mint outline styling |
| `components/problems/problem-card.tsx` | Mint tags, left-border hover, bold title, solution preview border |
| `app/problems/page.tsx` | Larger title, empty state with mint wrench |
| `components/problems/search-bar.tsx` | Mint focus-within ring on wrapper |
| `components/problems/tag-filter.tsx` | Mint active chip styling |
| `app/problems/[id]/page.tsx` | Mint content card, solution box, button styles, back link |
| `app/login/page.tsx` | Brand mark, mint card border, input focus, mint submit |
| `app/register/page.tsx` | Brand mark, mint card border, input focus, mint password rules |

---

## Task 1: Color System

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace light mode color tokens**

In `app/globals.css`, inside `:root { }`, replace these specific tokens (leave all others untouched):

```css
:root {
  --radius: 0.625rem;
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.72 0.14 168);
  --primary-foreground: oklch(0.1 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.94 0.03 168);
  --accent-foreground: oklch(0.15 0.02 168);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.88 0.02 168);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.72 0.14 168);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.72 0.14 168);
  --sidebar-primary-foreground: oklch(0.1 0 0);
  --sidebar-accent: oklch(0.94 0.03 168);
  --sidebar-accent-foreground: oklch(0.15 0.02 168);
  --sidebar-border: oklch(0.88 0.02 168);
  --sidebar-ring: oklch(0.72 0.14 168);
}
```

- [ ] **Step 2: Replace dark mode color tokens**

Inside `.dark { }`, replace:

```css
.dark {
  --background: oklch(0.12 0.01 240);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.18 0.01 240);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.18 0.01 240);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.78 0.14 168);
  --primary-foreground: oklch(0.1 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.18 0.01 240);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.22 0.03 168);
  --accent-foreground: oklch(0.9 0.05 168);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 8%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.78 0.14 168);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.18 0.01 240);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.78 0.14 168);
  --sidebar-primary-foreground: oklch(0.1 0 0);
  --sidebar-accent: oklch(0.22 0.03 168);
  --sidebar-accent-foreground: oklch(0.9 0.05 168);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.78 0.14 168);
}
```

- [ ] **Step 3: Verify existing tests still pass**

```bash
npm test
```

Expected: all tests pass (color changes don't affect utility/auth logic tests)

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "style: replace color tokens with mint-accented palette"
```

---

## Task 2: Header

**Files:**
- Modify: `components/layout/header.tsx`

- [ ] **Step 1: Update header markup**

Replace the entire file content with:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-wide">
          <Wrench className="h-5 w-5 text-primary" />
          FixLog
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 sm:flex">
          <Link
            href="/problems"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Problems
          </Link>
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-sm text-accent-foreground">
                    {user?.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-1 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Log in
                  </Link>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-primary/20 px-4 py-3 sm:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            asChild
            onClick={() => setMobileOpen(false)}
          >
            <Link href="/problems">Problems</Link>
          </Button>
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <span className="px-3 py-1 text-sm text-muted-foreground">
                    {user?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    asChild
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="justify-start"
                    asChild
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build completes with no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add components/layout/header.tsx
git commit -m "style: update header with mint logo, pill user name, simplified nav"
```

---

## Task 3: Landing Page

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/landing-cta.tsx`

- [ ] **Step 1: Update `app/page.tsx`**

Replace the entire file content with:

```tsx
import { Search, Tags, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { LandingCTA } from "@/components/landing-cta";

const features = [
  {
    icon: Search,
    title: "Fuzzy Search",
    description:
      "Find any fix instantly with smart fuzzy search across titles, descriptions, and solutions.",
  },
  {
    icon: Tags,
    title: "Tag & Organize",
    description:
      "Categorize problems with tags like 'nginx', 'docker', or 'linux' for quick filtering.",
  },
  {
    icon: Zap,
    title: "Quick Capture",
    description:
      "Record problems and solutions fast so you can get back to what you were doing.",
  },
];

const demoProblem = [
  {
    title: "NGINX returns 502 Bad Gateway after deploy",
    tags: ["nginx", "deployment", "node.js"],
    preview:
      "PM2 ecosystem config had the wrong port. Updated ecosystem.config.js to use PORT=3000...",
  },
  {
    title: "Washing machine error code F21 — won't drain",
    tags: ["appliance", "washing-machine", "repair"],
    preview:
      "Found a sock and coins jamming the pump impeller. Cleaned the drain filter...",
  },
  {
    title: "Check engine light — code P0420",
    tags: ["car", "check-engine", "diagnostics"],
    preview:
      "Replaced the downstream O2 sensor ($45 part) instead of the catalytic converter...",
  },
];

export default function Home() {
  return (
    <>
      <section
        className="py-20 md:py-32"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.22 0.05 168 / 0.3), transparent)",
        }}
      >
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              Never lose a fix{" "}
              <span className="text-primary">again</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-muted-foreground">
              A dedicated home for the problems you solve, the diagnoses you
              make, and the fixes you discover. Search your personal knowledge
              base in seconds.
            </p>
            <LandingCTA />
          </div>
        </PageContainer>
      </section>

      <section className="border-y border-primary/10 bg-muted/30 py-16">
        <PageContainer>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/15">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="py-16">
        <PageContainer>
          <h2 className="mb-8 text-center text-2xl font-bold">
            Your fixes,{" "}
            <span className="text-primary">organized</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {demoProblem.map((p) => (
              <Card
                key={p.title}
                className="border-primary/10 transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base leading-snug">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {p.preview}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Update `components/landing-cta.tsx`**

Replace the entire file content with:

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function LandingCTA() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button size="lg" disabled>Get Started</Button>
        <Button
          variant="outline"
          size="lg"
          className="border-primary/40 text-primary hover:bg-primary/10"
          asChild
        >
          <Link href="/problems?demo=true">View Demo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      {isAuthenticated ? (
        <Button size="lg" asChild>
          <Link href="/problems">Go to Problems</Link>
        </Button>
      ) : (
        <Button size="lg" asChild>
          <Link href="/register">Get Started</Link>
        </Button>
      )}
      <Button
        variant="outline"
        size="lg"
        className="border-primary/40 text-primary hover:bg-primary/10"
        asChild
      >
        <Link href="/problems?demo=true">View Demo</Link>
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/landing-cta.tsx
git commit -m "style: redesign landing page with mint hero gradient and accented cards"
```

---

## Task 4: Problem Cards

**Files:**
- Modify: `components/problems/problem-card.tsx`

- [ ] **Step 1: Update `problem-card.tsx`**

Replace the entire file content with:

```tsx
import Link from "next/link";
import { Problem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stripMarkdown } from "@/lib/utils";

interface ProblemCardProps {
  problem: Problem;
  demo?: boolean;
}

export function ProblemCard({ problem, demo }: ProblemCardProps) {
  const href = demo
    ? `/problems/${problem.id}?demo=true`
    : `/problems/${problem.id}`;

  return (
    <Link href={href} className="block">
      <Card className="h-full flex flex-col border-l-2 border-l-transparent transition-all hover:border-l-primary/70 hover:border-primary/30 hover:bg-accent/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-[15px] font-bold leading-snug line-clamp-2">
              {problem.title}
            </CardTitle>
            <time className="shrink-0 font-mono text-xs text-muted-foreground">
              {new Date(problem.createdAt).toLocaleDateString()}
            </time>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
            {stripMarkdown(problem.description)}
          </p>
          <p className="mb-3 border-l-2 border-primary/30 pl-2 text-sm line-clamp-2">
            {stripMarkdown(problem.solution)}
          </p>
          <div className="mt-auto flex flex-wrap gap-1">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary hover:bg-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add components/problems/problem-card.tsx
git commit -m "style: redesign problem cards with mint tags, hover states, and solution border"
```

---

## Task 5: Problems List Page + Search + Tags

**Files:**
- Modify: `app/problems/page.tsx`
- Modify: `components/problems/search-bar.tsx`
- Modify: `components/problems/tag-filter.tsx`

- [ ] **Step 1: Update the page title and empty state in `app/problems/page.tsx`**

Find the heading and replace:

```tsx
// Before
<h1 className="text-2xl font-bold">
  {isDemo ? "Demo Problems" : "Problems"}
</h1>
```

```tsx
// After
<h1 className="text-3xl font-bold tracking-tight">
  {isDemo ? "Demo Problems" : "Problems"}
</h1>
```

Then find the "Welcome to FixLog!" empty state div and replace:

```tsx
// Before
<div className="py-20 text-center">
  <h2 className="mb-2 text-xl font-semibold">Welcome to FixLog!</h2>
  <p className="mb-6 text-muted-foreground">
    Start building your personal knowledge base by recording your first fix.
  </p>
  <Button asChild>
    <Link href="/problems/new">
      <Plus className="mr-1 h-4 w-4" />
      Create your first fix
    </Link>
  </Button>
</div>
```

```tsx
// After (add Wrench to the imports at the top of the file first: import { Plus, Wrench } from "lucide-react";)
<div className="py-20 text-center">
  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
    <Wrench className="h-8 w-8 text-primary" />
  </div>
  <h2 className="mb-2 text-xl font-semibold">Welcome to FixLog!</h2>
  <p className="mb-6 text-muted-foreground">
    Start building your personal knowledge base by recording your first fix.
  </p>
  <Button asChild>
    <Link href="/problems/new">
      <Plus className="mr-1 h-4 w-4" />
      Create your first fix
    </Link>
  </Button>
</div>
```

- [ ] **Step 2: Update `components/problems/search-bar.tsx`**

Replace the outer `<div className="relative">` wrapper with one that includes focus-within styles:

```tsx
// Before
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    placeholder="Search problems..."
    value={local}
    onChange={(e) => setLocal(e.target.value)}
    className="pl-9"
  />
</div>
```

```tsx
// After
<div className="relative rounded-md transition-shadow focus-within:ring-1 focus-within:ring-primary/30">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    placeholder="Search problems..."
    value={local}
    onChange={(e) => setLocal(e.target.value)}
    className="pl-9"
  />
</div>
```

- [ ] **Step 3: Update `components/problems/tag-filter.tsx`**

Replace the Badge component with a styled `<button>` element for selected vs unselected states:

```tsx
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
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add app/problems/page.tsx components/problems/search-bar.tsx components/problems/tag-filter.tsx
git commit -m "style: redesign problems list with mint empty state, search ring, and tag chips"
```

---

## Task 6: Problem Detail Page

**Files:**
- Modify: `app/problems/[id]/page.tsx`

- [ ] **Step 1: Update back button**

Find and replace the back button:

```tsx
// Before
<div className="mb-6">
  <Button variant="ghost" size="sm" asChild>
    <Link href={backHref}>
      <ArrowLeft className="mr-1 h-4 w-4" />
      Back
    </Link>
  </Button>
</div>
```

```tsx
// After
<div className="mb-6">
  <Link
    href={backHref}
    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
  >
    <ArrowLeft className="h-4 w-4" />
    Back
  </Link>
</div>
```

- [ ] **Step 2: Update the title and action buttons**

Find and replace:

```tsx
// Before
<div className="flex items-start justify-between gap-4" data-exclude-capture>
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
```

```tsx
// After
<div className="flex items-start justify-between gap-4" data-exclude-capture>
  <h1 className="text-3xl font-bold tracking-tight">{problem.title}</h1>
  <div className="flex shrink-0 gap-2">
    <Button
      variant="outline"
      size="sm"
      className="border-primary/20 hover:border-primary/50 hover:text-primary"
      onClick={handleCopyAsImage}
      disabled={isCapturing}
    >
      <Camera className="mr-1 h-4 w-4" />
      {isCapturing ? "Capturing..." : "Copy as image"}
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="border-primary/20 hover:border-primary/50 hover:text-primary"
      onClick={() => setEditing(true)}
    >
      <Pencil className="mr-1 h-4 w-4" />
      Edit
    </Button>
    <DeleteDialog onConfirm={handleDelete} isDeleting={isDeleting} />
  </div>
</div>
```

- [ ] **Step 3: Update the content card, tags, separator, and solution section**

Find and replace the `<div ref={contentRef}>` block:

```tsx
// Before
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
```

```tsx
// After
<div ref={contentRef} className="mt-4 rounded-lg border border-primary/15 bg-accent/10 p-6">
  <h2 className="text-xl font-bold">{problem.title}</h2>

  <div className="mt-2 flex flex-wrap gap-1.5">
    {problem.tags.map((tag) => (
      <span
        key={tag}
        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
      >
        {tag}
      </span>
    ))}
  </div>

  <p className="mt-1 text-xs text-muted-foreground">
    Created {new Date(problem.createdAt).toLocaleDateString()}
    {problem.updatedAt !== problem.createdAt &&
      ` · Updated ${new Date(problem.updatedAt).toLocaleDateString()}`}
  </p>

  <Separator className="my-6 bg-primary/20" />

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
    <div className="rounded-md border border-primary/10 bg-primary/5 p-4">
      <MarkdownRenderer content={problem.solution} />
    </div>
  </section>
</div>
```

- [ ] **Step 4: Remove unused Badge import** (no longer used in this file — replaced with `<span>`)

At the top of the file, remove:
```tsx
import { Badge } from "@/components/ui/badge";
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add "app/problems/[id]/page.tsx"
git commit -m "style: redesign problem detail with mint card, solution box, and updated buttons"
```

---

## Task 7: Auth Pages

**Files:**
- Modify: `app/login/page.tsx`
- Modify: `app/register/page.tsx`

- [ ] **Step 1: Update `app/login/page.tsx`**

Replace the entire file content with:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await login({ email, password });
      toast.success("Logged in successfully");
      router.push("/problems");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-56px)]"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.22 0.05 168 / 0.3), transparent)",
      }}
    >
      <PageContainer>
        <div className="mx-auto max-w-md pt-16">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2 text-lg font-bold tracking-wide">
                <Wrench className="h-5 w-5 text-primary" />
                FixLog
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Log in</CardTitle>
              <CardDescription>
                Sign in to your FixLog account to access your fixes.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary underline">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
```

- [ ] **Step 2: Update `app/register/page.tsx`**

Replace the entire file content with:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { useAuth } from "@/hooks/use-auth";
import { validatePassword } from "@/lib/utils";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (validatePassword(password).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      toast.success("Account created successfully");
      router.push("/problems");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-56px)]"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.22 0.05 168 / 0.3), transparent)",
      }}
    >
      <PageContainer>
        <div className="mx-auto max-w-md pt-16">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2 text-lg font-bold tracking-wide">
                <Wrench className="h-5 w-5 text-primary" />
                FixLog
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
              <CardDescription>
                Sign up for FixLog to start tracking your fixes.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {password && (() => {
                    const failing = validatePassword(password);
                    return (
                      <ul className="space-y-1 text-sm">
                        {[
                          "At least 8 characters",
                          "At least one uppercase letter",
                          "At least one lowercase letter",
                          "At least one number",
                        ].map((rule) => {
                          const passed = !failing.includes(rule);
                          return (
                            <li key={rule} className="flex items-center gap-2">
                              <span className={passed ? "text-primary" : "text-muted-foreground"}>
                                {passed ? "✓" : "•"}
                              </span>
                              <span className={passed ? "text-primary" : "text-muted-foreground"}>
                                {rule}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  })()}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 4: Final build check**

```bash
npm run build
```

Expected: clean build, no errors

- [ ] **Step 5: Commit**

```bash
git add app/login/page.tsx app/register/page.tsx
git commit -m "style: redesign auth pages with brand mark, mint card, and password rule colors"
```

---

## Final Verification

- [ ] Start dev server: `npm run dev`
- [ ] Visit `/` — verify mint hero glow, "again" in mint, feature icon borders, demo card hover
- [ ] Visit `/problems?demo=true` — verify mint tag chips, bold title, search ring on focus
- [ ] Click a demo problem — verify mint content card, solution box, back link, buttons
- [ ] Visit `/login` — verify brand mark, mint card border, radial glow background
- [ ] Visit `/register` — verify same as login + mint checkmarks on password rules
- [ ] Toggle dark mode — verify cool dark background, mint still pops
- [ ] Verify header on all pages — mint wrench, simplified nav links
