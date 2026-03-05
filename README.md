# My GI - Gastroenterology Journal Portal

Browse the latest papers from top gastroenterology journals in a social media-style timeline feed.

**Live:** [my-gi-portal.vercel.app](https://my-gi-portal.vercel.app)

## Features

- **Timeline Feed** — Twitter/X-style infinite scroll of recent GI papers
- **Paper Detail Pages** — Full abstract, authors with affiliations, keywords, MeSH terms
- **Smart Search** — Full-text search across titles and abstracts (weighted tsvector)
- **Journal Filters** — Filter by specific journals with pill-style toggles
- **Topic Tags** — Auto-classified topics (IBD, Endoscopy, GI Oncology, Hepatology, etc.)
- **Author Geography** — World map visualization of first-author affiliations
- **Author Leaders** — Top contributing authors across journals
- **Dark Mode** — Full dark mode support via `prefers-color-scheme`
- **Mobile Responsive** — Drawer navigation and responsive layout

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Database | [Supabase](https://supabase.com/) (PostgreSQL + RLS) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Data Fetching | [SWR](https://swr.vercel.app/) |
| Data Sources | [PubMed E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/), [CrossRef API](https://www.crossref.org/documentation/) |
| Deployment | [Vercel](https://vercel.com/) |

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── papers/         # Paper list & detail API
│   │   ├── sync/           # Manual sync trigger
│   │   ├── cron/           # Scheduled sync endpoint
│   │   ├── health/         # Health check
│   │   └── insights/       # Author geography & leaders
│   ├── paper/[pmid]/       # Paper detail page (SSR)
│   └── page.tsx            # Timeline home
├── components/
│   ├── papers/             # PaperCard, PaperFeed, FilterBar, SearchInput
│   ├── layout/             # Header, Footer, Sidebar, RightRail, TopicMonitor
│   ├── maps/               # AuthorWorldMap
│   └── ui/                 # Reusable UI primitives
├── hooks/                  # usePapers, usePaperFilters, useDebounce
├── lib/
│   ├── pubmed/             # PubMed API client & XML parser
│   ├── crossref/           # CrossRef enrichment client
│   ├── sync/               # Sync orchestrator, fetcher, enricher, store
│   ├── supabase/           # Supabase client (anon + service role)
│   ├── utils/              # Date, text, topic classification, rate limiting
│   └── constants/          # Journal definitions, topic configs
└── types/                  # TypeScript type definitions
```

## Journals Covered

**Gastroenterology (8 journals):**
Gastroenterology, Gastrointestinal Endoscopy, Clinical Endoscopy, Gut and Liver, World Journal of Gastroenterology, Journal of Gastrointestinal Surgery, Journal of Gastrointestinal Oncology, IJGI

## Database Schema

- **journals** — Journal metadata (name, ISSN, impact factor, color)
- **papers** — Paper records with full-text search vector
- **paper_authors** — Authors with affiliations and position ordering
- **sync_logs** — Sync history and status tracking

All tables use Row Level Security (RLS): public read, service_role write.

## Getting Started

### Prerequisites

- Node.js 22+
- Supabase project

### Setup

```bash
# Clone
git clone https://github.com/lekis1020/my-gi.git
cd my-gi

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Apply database migrations
supabase link --project-ref <your-project-ref>
supabase db push

# Sync papers from PubMed
curl -X POST http://localhost:3000/api/sync \
  -H "Authorization: Bearer <your-cron-secret>" \
  -H "Content-Type: application/json" \
  -d '{"days": 180}'

# Start dev server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `CRON_SECRET` | Secret for sync API authentication |
| `CROSSREF_EMAIL` | Email for CrossRef API (optional) |

## Scripts

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run test       # Run tests (Vitest)
```

## License

MIT
