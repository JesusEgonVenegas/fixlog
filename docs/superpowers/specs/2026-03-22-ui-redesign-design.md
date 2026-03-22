# FixLog UI Redesign — Design Spec

**Date:** 2026-03-22
**Status:** Approved
**Scope:** Full app — color system, landing page, header, problems list, problem cards, problem detail, auth pages

---

## Overview

Redesign FixLog from a default shadcn/ui aesthetic to a bold, modern, product-grade UI. The direction is "bold & modern" — inspired by Vercel and Resend. Core change: introduce a mint accent color (`oklch ~0.78 0.14 168`) on a dark-tinted foundation, with stronger typography and consistent accent-driven interactive states throughout.

---

## 1. Color System (`globals.css`)

Replace the fully achromatic palette with a mint-accented system.

### Light mode tokens
| Token | Value | Notes |
|---|---|---|
| `--background` | `oklch(0.99 0 0)` | Near white |
| `--primary` | `oklch(0.72 0.14 168)` | Mint |
| `--primary-foreground` | `oklch(0.1 0 0)` | Dark text on mint |
| `--accent` | `oklch(0.94 0.03 168)` | Mint tint for hover surfaces |
| `--accent-foreground` | `oklch(0.15 0.02 168)` | Dark mint text |
| `--muted` | `oklch(0.96 0 0)` | Unchanged |
| `--border` | `oklch(0.88 0.02 168)` | Mint-tinted border |

### Dark mode tokens
| Token | Value | Notes |
|---|---|---|
| `--background` | `oklch(0.12 0.01 240)` | Near black, cool tint |
| `--primary` | `oklch(0.78 0.14 168)` | Mint, slightly lighter |
| `--primary-foreground` | `oklch(0.1 0 0)` | Dark text on mint |
| `--accent` | `oklch(0.22 0.03 168)` | Dark mint tint for hover surfaces |
| `--accent-foreground` | `oklch(0.9 0.05 168)` | Light mint text |
| `--muted` | `oklch(0.18 0.01 240)` | Dark muted, cool tint |
| `--border` | `oklch(1 0 0 / 8%)` | Unchanged |

---

## 2. Header (`components/layout/header.tsx`)

- Wrench icon: `text-primary` (mint)
- "FixLog" text: `font-bold` with slight letter-spacing
- Header background: `bg-background/80 backdrop-blur-md`
- Bottom border: `border-primary/20`
- Nav "Problems" link: plain `text-muted-foreground hover:text-foreground` (remove ghost button wrapper)
- "Sign up" button: mint primary styling
- Authenticated user name: displayed in pill — `bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-sm`

---

## 3. Landing Page (`app/page.tsx`, `components/landing-cta.tsx`)

### Hero section
- Background: radial gradient glow — `radial-gradient` from `oklch(0.22 0.05 168 / 0.3)` to `transparent`, centered
- Headline: `text-5xl md:text-7xl font-bold tracking-tighter`
- "again" in headline: `text-primary` (mint) — replaces `text-muted-foreground`
- Subtext: `text-xl`, `max-w-lg`
- "Get Started" button: mint primary fill + dark text
- "View Demo" button: `border-primary/40 text-primary hover:bg-primary/10`

### Features section
- Background: `bg-muted/30 border-y border-primary/10`
- Icon containers: `bg-primary/15 border border-primary/20` (more defined, jewel-like)
- Feature titles: `font-bold`

### Demo cards section
- Section title: key word gets `text-primary` accent
- Cards: `border-primary/10 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5` transition

---

## 4. Problem Cards (`components/problems/problem-card.tsx`)

- Left border accent on hover: `hover:border-l-primary` transition
- Card hover background: `hover:bg-accent/30`
- Title: `font-bold text-[15px]`
- Tags: `bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20` (replaces `variant="secondary"`)
- Date: `font-mono text-xs`
- Solution preview: `border-l-2 border-primary/30 pl-2` left border separator

---

## 5. Problems List Page (`app/problems/page.tsx`, `components/problems/search-bar.tsx`, `components/problems/tag-filter.tsx`)

- Page title "Problems": `text-3xl font-bold tracking-tight`
- "New Problem" button: mint primary styling
- Search bar: `focus-within:border-primary/60 focus-within:ring-primary/20` highlight
- Tag filter active chips: `bg-primary/15 text-primary border-primary/30`
- Empty state: centered mint wrench icon in `bg-primary/10` circle

---

## 6. Problem Detail Page (`app/problems/[id]/page.tsx`)

- Content card: `border-primary/15 bg-accent/10`
- Title: `text-3xl font-bold tracking-tight`
- Tags: same mint chip treatment as cards
- Separator: `bg-primary/20` (mint tint)
- Solution section: `bg-primary/5 rounded-md p-4 border border-primary/10` container
- Action buttons (Edit, Copy as image): `border-primary/20 hover:border-primary/50 hover:text-primary`
- Back button: plain `text-muted-foreground hover:text-foreground` link, no ghost wrapper

---

## 7. Auth Pages (`app/login/page.tsx`, `app/register/page.tsx`)

- Page background: same radial mint glow as hero
- Card: `border-primary/20 shadow-lg shadow-primary/5`
- Card header: Wrench + "FixLog" brand mark above title
- Title: `text-2xl font-bold tracking-tight`
- Inputs: `focus:border-primary/60 focus:ring-primary/20`
- Submit button: mint primary
- Footer links: `text-primary`
- Register password strength: weak = red, medium = amber, strong = `text-primary` (mint)

---

## Files to Change

| File | Change |
|---|---|
| `app/globals.css` | Color token overrides |
| `components/layout/header.tsx` | Logo mint, border, nav links, user pill |
| `app/page.tsx` | Hero gradient, headline color, feature cards, demo cards |
| `components/landing-cta.tsx` | Button styling |
| `components/problems/problem-card.tsx` | Hover states, tags, typography |
| `app/problems/page.tsx` | Title, button, empty state |
| `components/problems/search-bar.tsx` | Focus ring |
| `components/problems/tag-filter.tsx` | Active chip styling |
| `app/problems/[id]/page.tsx` | Content card, title, solution box, buttons |
| `app/login/page.tsx` | Brand mark, inputs, button, links |
| `app/register/page.tsx` | Brand mark, inputs, button, links, password strength |

---

## Non-Goals

- No layout restructuring (grid columns, page widths unchanged)
- No new features or components added
- No changes to backend, API, or data layer
- No animation libraries added (CSS transitions only)
