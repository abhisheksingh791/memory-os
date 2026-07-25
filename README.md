# Memory OS — Supabase Production Backend Edition

Memory OS is a portfolio-grade, local-first spatial memory vault, rich markdown notebook, Kanban task planner, daily reflection tracker, knowledge graph visualizer, and mind map canvas — now fully transformed into a production-ready SaaS application backed by **Supabase PostgreSQL**, **Supabase Auth**, **Supabase Storage**, **Supabase Realtime**, and **Row Level Security (RLS)**.

---

## 🌟 Key Features

* **Supabase Authentication**: Email & Password, Google OAuth, GitHub OAuth, Password Reset, Email Verification, Session Persistence, Protected Routes & Guest Mode.
* **Production PostgreSQL Schema**: 27 fully normalized relational database tables with constraints, indexes, triggers, auto-updated timestamps, and full-text search (`tsvector`).
* **Supabase Storage**: Managed cloud buckets for `avatars`, `images`, `voice-notes`, `documents`, `gallery`, and `backups`.
* **Supabase Realtime**: Multi-user live sync for Notes, Tasks, Knowledge Graph, Mind Maps, Calendar, Notifications, Activity, and Favorites.
* **PostgreSQL Full-Text Search (FTS)**: Fast content, tag, folder, and global search via GIN tsvector indexing.
* **Offline-First Resilience & PWA**: Seamless background queue (`lib/sync/offlineSync.ts`), optimistic UI updates, conflict resolution, and PWA offline capabilities.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase API Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🗄️ Database Schema & RLS Policies

The database is built on **27 normalized tables** with strict **Row Level Security (RLS)** ensuring complete data isolation (`auth.uid() = user_id`).

### Required Tables (27)
1. `profiles` - User accounts & profile metadata
2. `folders` - Spatial directory hierarchy
3. `collections` - Categorized topics & workspaces
4. `tags` - System-wide tags
5. `notes` - Rich text & markdown notes with GIN `tsvector` FTS index
6. `note_tags` - Many-to-many note-tag join table
7. `tasks` - Kanban tasks with subtasks JSONB
8. `journal_entries` - Daily reflection logs with mood tracking
9. `bookmarks` - Web bookmarks with automatic favicon parsing
10. `files` - Asset storage manifests
11. `pdfs` - PDF documents with page annotations
12. `voice_notes` - Audio recording metadata and transcripts
13. `gallery` - Media images with aspect ratio specs
14. `favorites` - Universal favorite items
15. `recent_activity` - Audit activity logs
16. `knowledge_nodes` - Knowledge graph concept nodes
17. `knowledge_edges` - Dynamic node relationships
18. `mind_maps` - Brainstorming canvases
19. `mind_map_nodes` - Spatial node trees
20. `mind_map_edges` - Branch links
21. `calendar_events` - Event scheduler
22. `notifications` - Alerts & reminders
23. `settings` - User theme & system preferences
24. `backups` - One-click database export snapshots
25. `trash` - Soft-deleted trash items
26. `shared_links` - Public link sharing with tokens & expiration
27. `devices` - Registered user sessions & active devices

---

## 🪣 Supabase Storage Buckets

1. `avatars` (Public) - Profile photos & avatars
2. `images` (Public) - Embedded note images
3. `voice-notes` (Public) - Audio recording files
4. `documents` (Public) - PDF files & attachments
5. `gallery` (Public) - Media gallery pictures
6. `backups` (Private) - Encrypted JSON storage snapshots

---

## 🚀 Migration & Deployment Guide

### 1. Apply Database Migration
Run the migration script against your Supabase instance using the Supabase CLI or SQL Editor:

```bash
# Using Supabase CLI
supabase db push

# Or run the SQL script in supabase/migrations/20260725000000_schema_and_rls.sql via Supabase Dashboard SQL Editor
```

### 2. Seed Data (Optional)
Populate demo data for testing:

```bash
# Execute supabase/seed.sql in Supabase Dashboard SQL Editor
```

### 3. Build & Deploy Frontend (Next.js 15)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build test
npm run build

# Start production server
npm run start
```

---

## 🏗️ Architecture & Codebase Structure

```
p4/
├── app/                  # Next.js 15 App Router pages
├── components/           # UI components, AuthModal, ErrorBoundary
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # Supabase Browser Client
│   │   ├── server.ts     # Supabase Server Client (@supabase/ssr)
│   │   ├── auth.ts       # Authentication Service
│   │   ├── storage.ts    # Storage Bucket Service
│   │   ├── queries.ts    # Full Text Search & Relational Queries
│   │   ├── mutations.ts  # Soft delete, restore, trash & batch updates
│   │   └── types.ts      # Supabase TypeScript Types
│   ├── sync/
│   │   └── offlineSync.ts# Offline queue, background sync & conflict resolution
│   └── storage.ts        # Client LocalStorage fallback
├── services/             # Domain service layer
│   ├── notes.service.ts
│   ├── tasks.service.ts
│   ├── bookmarks.service.ts
│   ├── journal.service.ts
│   ├── graph.service.ts
│   ├── calendar.service.ts
│   ├── mindmap.service.ts
│   ├── files.service.ts
│   ├── notifications.service.ts
│   ├── settings.service.ts
│   └── search.service.ts
├── store/
│   └── useMemoryStore.ts # Zustand global store integrated with Supabase Realtime
└── supabase/
    ├── migrations/       # PostgreSQL SQL Migration scripts
    └── seed.sql          # Seed data
```

---

## 🔒 Security

* **Row Level Security (RLS)**: Enforced across all 27 tables.
* **Storage Bucket Policies**: Strict user folder prefix isolation (`auth.uid()`).
* **Input Sanitization**: Enforced via Zod & TypeScript types.

---

## 📄 License
MIT License. Built for production excellence with Next.js 15 and Supabase.
