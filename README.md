# 🧠 Memory OS

> **"The Operating System for Your Mind"**

Memory OS is a portfolio-quality, production-ready, offline-first Progressive Web App (PWA) designed to feel like a seamless blend of **Apple, Notion, Linear, Obsidian, Arc Browser, and Vercel**.

Built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Zustand**, and **Fuse.js**, Memory OS requires zero external backends or cloud databases. 100% of your notes, tasks, reflections, bookmarks, mind maps, and knowledge graphs are stored securely inside your browser's LocalStorage.

---

## ✨ Primary Features

- 🚀 **100% Offline-First Architecture**: Powered by browser LocalStorage with zero server dependencies or network latency.
- ⚡ **Sub-Millisecond Fuzzy Search**: Powered by Fuse.js for instantaneous retrieval across all notes, tasks, and bookmarks.
- 📱 **Native Progressive Web App (PWA)**: Installable on iOS, Android, and Desktop with offline cache fallback and service worker.
- 🧠 **Interactive Knowledge Graph Engine**: Node-link visualization of interconnected notes, tasks, tags, and collections.
- 🌿 **Interactive Mind Map Canvas**: Collapsible visual tree editor for recursive idea breakdown and spatial planning.
- 📝 **Rich Markdown & Visual Notes**: Live Markdown preview, tags, folder collections, favorite starring, and color labels.
- 📋 **Tasks Kanban Board**: Status columns (*To Do*, *In Progress*, *Completed*), subtask checklist progress bars, and priority levels (*Urgent*, *High*, *Medium*, *Low*).
- 📖 **Daily Journal & Mood Tracker**: Reflective daily log entries with weather context, mood badges, and prompt generators.
- ⚡ **Raycast Command Palette (`Cmd + K`)**: Instant access to global search, page navigation, theme toggling, and data backup.
- 🎨 **Spatial Dark Mode Aesthetic**: High-contrast obsidian dark palette (`#09090B`), glassmorphic blur filters, soft glowing shadows, and Geist font typography.
- 💾 **100% Data Sovereignty**: One-click JSON backup export and instant JSON restore/import.

---

## 🛠️ Tech Stack & Dependencies

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Glassmorphism
- **Design System**: Lucide React Icons, Geist Font Family, `next-themes`
- **State Management**: Zustand
- **Motion & Micro-Interactions**: Framer Motion
- **Search Engine**: Fuse.js
- **Visualization**: Custom SVG & Canvas Node Engines
- **Date Handling**: `date-fns`

---

## 📂 Folder Structure

```text
memory-os/
├── app/
│   ├── layout.tsx         # Root layout (Geist font, providers, Navbar, Sidebar)
│   ├── page.tsx           # Portfolio Landing Page
│   ├── dashboard/         # Command Dashboard
│   ├── notes/             # Spatial Markdown Notes Vault
│   ├── tasks/             # Action Items & Kanban Board
│   ├── journal/           # Daily Reflection Logs
│   ├── calendar/          # Memory History Calendar Grid
│   ├── graph/             # Interactive Knowledge Graph
│   ├── mindmap/           # Interactive Mind Map Canvas
│   ├── collections/       # Workspaces & Folders
│   ├── bookmarks/         # Web Links Manager
│   ├── gallery/           # Media Vault & Lightbox
│   ├── voicenotes/        # Audio Dictation Simulator
│   ├── pdf/               # PDF Library & Annotation Inspector
│   ├── timeline/          # Chronological Stream
│   ├── favorites/         # Starred & Pinned Items
│   ├── archive/           # Historical Vault
│   ├── trash/             # Soft-Deleted Bin
│   ├── search/            # Fuse.js Search Page
│   ├── settings/          # LocalStorage Administration & JSON Backup
│   ├── about/             # Architecture Specs
│   ├── offline/           # PWA Offline Fallback
│   ├── sitemap.ts         # Dynamic Sitemap
│   └── robots.ts          # SEO Robots Directive
├── components/
│   ├── Navbar.tsx         # Top Header Bar
│   ├── Sidebar.tsx        # Linear / Arc Desktop Navigation
│   ├── BottomNav.tsx      # Native Mobile Navigation Bar
│   ├── CommandPalette.tsx # Raycast Cmd+K Modal
│   ├── QuickCaptureModal.tsx # Fast Capture Modal
│   ├── KnowledgeGraphViewer.tsx # SVG Node Network Visualizer
│   ├── MindMapCanvas.tsx  # Mind Map Canvas Tree
│   ├── NoteCard.tsx       # Reusable Note Card
│   ├── TaskCard.tsx       # Reusable Task Card
│   ├── JournalCard.tsx    # Reusable Reflection Entry
│   ├── BookmarkCard.tsx   # Reusable Web Link Card
│   ├── StatCard.tsx       # Metric Summary Widget
│   └── PWAProvider.tsx    # Service Worker & Install Prompt Listener
├── lib/
│   └── storage.ts         # Reusable LocalStorage Manager API
├── store/
│   └── useMemoryStore.ts  # Zustand Reactive State Store
├── types/
│   └── memory.ts          # TypeScript Type Specifications
├── mock/
│   └── initialData.ts     # Pre-populated Initial Vault Data
├── public/
│   ├── manifest.json      # PWA Web App Manifest
│   ├── sw.js              # Service Worker Offline Cache Script
│   └── icons/             # PWA App Icons
└── tailwind.config.ts     # Tailwind Design Tokens & Glass Utilities
```

---

## 🚀 Quick Start & Installation

### Prerequisites

Ensure you have **Node.js 18.x** or higher installed.

```bash
# Clone the repository
git clone https://github.com/your-username/memory-os.git

# Navigate into the project folder
cd memory-os

# Install dependencies
npm install
```

### Run Locally

Launch the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

To test the production bundle locally:

```bash
npm run build
npm run start
```

---

## ☁️ Deploying on Vercel

Memory OS requires **zero environment variables** or server database configurations and can be deployed directly to Vercel in 1 click:

1. Push code to your GitHub / GitLab repository.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Click **Deploy**.

---

## 🔒 Storage Engine Specification (`lib/storage.ts`)

All storage interactions are strictly encapsulated within `lib/storage.ts`:

- `save()`: Persists a new item to LocalStorage.
- `update()`: Modifies an existing item by ID.
- `remove()`: Deletes an item by ID.
- `get()`: Fetches a single item by ID.
- `getAll()`: Retrieves full database or entity arrays.
- `search()`: Runs fuzzy Fuse.js queries.
- `backup()` / `restore()`: JSON stringification & parsing.
- `exportJSON()` / `importJSON()`: File export/import.
- `clear()`: Wipes or resets local vault.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Author

Crafted with precision by a Senior Software Architect & UI/UX Engineer.
