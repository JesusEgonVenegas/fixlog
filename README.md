# FixLog

A personal knowledge base for tracking problems, diagnoses, and solutions. Never re-solve the same issue twice.

## Motivation

Every developer (and tinkerer) has fixed something only to hit the same wall months later. FixLog gives those hard-won fixes a permanent, searchable home so you can recall them in seconds instead of re-diagnosing from scratch.

## Features

- **Fuzzy search** — find any fix instantly across titles, descriptions, and solutions
- **Tag filtering** — organize entries with tags like `nginx`, `docker`, `car`, or anything else
- **Markdown with syntax highlighting** — write rich problem descriptions and solutions with fenced code blocks
- **Dark mode** — light, dark, and system-preference themes
- **Copy as image** — share a problem card as a PNG screenshot
- **JWT authentication** — secure per-user problem storage
- **Demo mode** — explore the app without creating an account

## Tech Stack

| Layer     | Technology                                    |
| --------- | --------------------------------------------- |
| Framework | Next.js 16 (App Router)                       |
| UI        | React 19, Tailwind CSS v4, shadcn/ui          |
| Language  | TypeScript                                    |
| Search    | Fuse.js (client-side fuzzy search)            |
| Backend   | .NET 9 Web API                                |
| Database  | SQLite (development), easily swappable via EF |
| Auth      | JWT Bearer tokens                             |

## Getting Started

### Prerequisites

- Node.js 20+
- .NET 9 SDK (for the backend)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/<your-username>/fixlog.git
cd fixlog

# Install frontend dependencies
npm install

# Start the backend (separate terminal)
cd backend
dotnet run

# Start the frontend
cd ..
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable               | Default                  | Description          |
| ---------------------- | ------------------------ | -------------------- |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:5062`  | Backend API base URL |

## Project Structure

```
fixlog/
├── app/                  # Next.js pages & layouts (App Router)
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── problems/         # Problem list, detail, and creation pages
├── components/           # Reusable UI components
│   ├── layout/           # Header, footer, page container
│   ├── problems/         # Problem card, form, search, tags
│   └── ui/               # shadcn/ui primitives
├── contexts/             # React Context providers (auth)
├── hooks/                # Custom hooks (auth, fuzzy search)
├── lib/                  # Utilities, API client, auth helpers
├── types/                # TypeScript interfaces
├── backend/              # .NET 9 Web API
└── public/               # Static assets
```

## Screenshots

_Coming soon._
