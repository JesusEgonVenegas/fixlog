# FixLog

> A personal knowledge base for tracking problems, diagnoses, and solutions. Never re-solve the same problem twice.

**[Live Demo](https://fixlog-web.onrender.com)** · **[GitHub](https://github.com/JesusEgonVenegas/fixlog)**

---

## What it is

Every developer hits the same wall twice — a cryptic error, a misconfigured service, an obscure dependency conflict. FixLog gives those hard-won fixes a permanent, searchable home so you can find them in seconds instead of re-diagnosing from scratch.

Log it once. Find it forever.

---

## Features

- **Fuzzy search** — find any fix instantly across titles, descriptions, and solutions using Fuse.js
- **Tag filtering** — organize entries with custom tags like `nginx`, `docker`, `auth`, or anything else
- **Markdown with syntax highlighting** — write rich problem descriptions and solutions with fenced code blocks
- **Dark mode** — light, dark, and system-preference themes
- **Copy as image** — share a problem card as a PNG screenshot
- **JWT authentication** — secure, per-user problem storage
- **Demo mode** — explore the app without creating an account

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Language | TypeScript |
| Search | Fuse.js (client-side fuzzy search) |
| Backend | .NET 9 Web API (C#) |
| Database | SQLite via Entity Framework Core |
| Auth | JWT Bearer tokens |
| Deployment | Render |

---

## Getting Started

### Prerequisites

- Node.js 20+
- .NET 9 SDK

### Install & Run

```bash
git clone https://github.com/JesusEgonVenegas/fixlog.git
cd fixlog

# Install frontend dependencies
npm install

# Start the backend (separate terminal)
cd backend
dotnet run

# Start the frontend
npm run dev
```

App at **http://localhost:3000** · API at **http://localhost:5062**

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5062` | Backend API base URL |

---

## Project Structure

```
fixlog/
├── app/                  # Next.js pages & layouts (App Router)
│   ├── login/
│   ├── register/
│   └── problems/         # Problem list, detail, and creation pages
├── components/           # Reusable UI components
│   ├── layout/           # Header, footer, page container
│   ├── problems/         # Problem card, form, search, tag filter
│   └── ui/               # shadcn/ui primitives
├── contexts/             # React Context providers (auth)
├── hooks/                # Custom hooks (auth, fuzzy search)
├── lib/                  # Utilities, API client, auth helpers
├── types/                # TypeScript interfaces
└── backend/              # .NET 9 Web API (C#)
```

---

## Author

**Jesus Egon Venegas Warner**
[LinkedIn](https://www.linkedin.com/in/jesus-egon-venegas-warner) · [GitHub](https://github.com/JesusEgonVenegas)
