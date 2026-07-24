import { StorageData } from '../types/memory';

export const INITIAL_DATA: StorageData = {
  settings: {
    theme: 'dark',
    accentColor: '#6366F1',
    autoSave: true,
    compactView: false,
    language: 'English (US)',
    fontSize: 'medium',
    highContrast: false,
    enableAnimations: true,
  },
  collections: [
    {
      id: 'col-1',
      name: 'Architecture & System Design',
      description: 'Distributed systems, microservices, local-first storage & web performance',
      color: '#6366F1',
      icon: 'Cpu',
      createdAt: '2026-07-01T10:00:00Z',
    },
    {
      id: 'col-2',
      name: 'Product & UI/UX Design',
      description: 'Design systems, glassmorphism, micro-interactions, Apple & Vercel aesthetics',
      color: '#EC4899',
      icon: 'Palette',
      createdAt: '2026-07-05T12:30:00Z',
    },
    {
      id: 'col-3',
      name: 'Personal Growth & Habits',
      description: 'Daily reflection, mental models, book summaries, deep work routines',
      color: '#10B981',
      icon: 'Zap',
      createdAt: '2026-07-10T08:15:00Z',
    },
    {
      id: 'col-4',
      name: 'AI & Cognitive Engineering',
      description: 'LLM agents, vector databases, synthetic reasoning, neural architectures',
      color: '#F59E0B',
      icon: 'Sparkles',
      createdAt: '2026-07-15T14:20:00Z',
    },
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Local-First Software Architecture & Memory OS Spec',
      content: `# Local-First Software Architecture

Local-first software combines the instant response and offline resilience of classical desktop apps with the sync capability of modern cloud services.

## Core Principles
1. **No Spinning Wheels**: All user actions are processed immediately on local storage.
2. **Multi-device Sync**: Event-driven delta synchronizations via IndexedDB / LocalStorage.
3. **Data Sovereignty**: The user owns their binary and JSON data files completely.

> "Your software should belong to you, not to a remote cloud server." - Ink & Switch

### Tech Stack Blueprint
- Next.js 15 App Router with TypeScript
- Framer Motion for liquid transitions
- Zustand for lightweight reactive state
- Fuse.js for client-side sub-millisecond search`,
      type: 'markdown',
      tags: ['architecture', 'local-first', 'pwa', 'nextjs'],
      collectionId: 'col-1',
      color: '#6366F1',
      isFavorite: true,
      isArchived: false,
      isPinned: true,
      isTrash: false,
      createdAt: '2026-07-24T09:00:00Z',
      updatedAt: '2026-07-24T12:15:00Z',
    },
    {
      id: 'note-2',
      title: 'Design Aesthetics: Crafting Spatial Glassmorphism',
      content: `# Spatial Glassmorphism & Micro-Interactions

Creating portfolio-grade interfaces requires careful tuning of visual depth, motion, and contrast.

## Key Design Tokens
- **Background**: '#09090B' (Deep Zinc Obsidian)
- **Surface**: '#18181B' with 70% opacity and 12px blur filter
- **Accent Highlight**: '#6366F1' (Electric Indigo)

### UI Checklist
- [x] Smooth gradient borders with 1px border-color fallback
- [x] Hover lift with standard cubic-bezier timing functions
- [x] Keyboard shortcuts (Cmd + K / Ctrl + K)`,
      type: 'markdown',
      tags: ['design', 'ui/ux', 'glassmorphism', 'tailwind'],
      collectionId: 'col-2',
      color: '#EC4899',
      isFavorite: true,
      isArchived: false,
      isPinned: true,
      isTrash: false,
      createdAt: '2026-07-23T15:30:00Z',
      updatedAt: '2026-07-24T11:00:00Z',
    },
    {
      id: 'note-3',
      title: 'Mental Model: First Principles Thinking in System Engineering',
      content: `First principles thinking requires breaking a problem down to its most fundamental truths and building up a solution from scratch.

When building **Memory OS**, we asked:
1. Why rely on cloud DB latency for local note-taking?
2. What is the fundamental bottleneck of modern cognitive tools?
*Answer*: Context switching and delayed search response times.

By leveraging client-side LocalStorage and web workers, we achieve zero-latency interactions.`,
      type: 'rich',
      tags: ['mental-models', 'productivity', 'cognition'],
      collectionId: 'col-3',
      color: '#10B981',
      isFavorite: false,
      isArchived: false,
      isPinned: false,
      isTrash: false,
      createdAt: '2026-07-22T18:45:00Z',
      updatedAt: '2026-07-22T18:45:00Z',
    },
    {
      id: 'note-4',
      title: 'Autonomous AI Agents & Memory Retrieval Pipelines',
      content: `Exploring RAG architectures and graph neural networks for memory association.

Connecting node networks across notes, tasks, and journals allows automated surface discovery of forgotten ideas.`,
      type: 'quick',
      tags: ['ai', 'graph', 'knowledge'],
      collectionId: 'col-4',
      color: '#F59E0B',
      isFavorite: false,
      isArchived: false,
      isPinned: false,
      isTrash: false,
      createdAt: '2026-07-21T14:10:00Z',
      updatedAt: '2026-07-21T14:10:00Z',
    },
    {
      id: 'note-5',
      title: 'Archived Notes Sandbox: Legacy Web Specifications',
      content: 'Historical specification documents from previous software iterations.',
      type: 'markdown',
      tags: ['archive', 'specs'],
      isFavorite: false,
      isArchived: true,
      isPinned: false,
      isTrash: false,
      createdAt: '2026-06-15T08:00:00Z',
      updatedAt: '2026-06-15T08:00:00Z',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Ship Memory OS Progressive Web App (PWA)',
      description: 'Implement web app manifest, offline service worker, cache storage, and install banner.',
      status: 'in-progress',
      priority: 'urgent',
      dueDate: '2026-07-25',
      subtasks: [
        { id: 'st-1', title: 'Create manifest.json and Apple touch icons', completed: true },
        { id: 'st-2', title: 'Register sw.js service worker script', completed: true },
        { id: 'st-3', title: 'Test offline mode & page fallback', completed: false },
      ],
      tags: ['pwa', 'nextjs', 'launch'],
      collectionId: 'col-1',
      isFavorite: true,
      isArchived: false,
      isTrash: false,
      createdAt: '2026-07-24T08:00:00Z',
      updatedAt: '2026-07-24T12:00:00Z',
    },
    {
      id: 'task-2',
      title: 'Build Interactive Knowledge Graph & Mind Maps',
      description: 'Integrate React Flow canvas nodes with graph clustering visualizer.',
      status: 'completed',
      priority: 'high',
      dueDate: '2026-07-24',
      subtasks: [
        { id: 'st-4', title: 'Define custom React Flow node components', completed: true },
        { id: 'st-5', title: 'Add drag and zoom controls', completed: true },
      ],
      tags: ['graph', 'react-flow', 'ui'],
      collectionId: 'col-1',
      isFavorite: true,
      isArchived: false,
      isTrash: false,
      createdAt: '2026-07-23T11:20:00Z',
      updatedAt: '2026-07-24T10:15:00Z',
    },
    {
      id: 'task-3',
      title: 'Refine Dark Mode Glassmorphism Theme',
      description: 'Ensure contrast compliance for #09090B background and #18181B zinc card components.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-07-26',
      subtasks: [
        { id: 'st-6', title: 'Audit hover transitions and focus rings', completed: false },
        { id: 'st-7', title: 'Add subtle particle glowing background', completed: false },
      ],
      tags: ['design', 'css'],
      collectionId: 'col-2',
      isFavorite: false,
      isArchived: false,
      isTrash: false,
      createdAt: '2026-07-24T09:30:00Z',
      updatedAt: '2026-07-24T09:30:00Z',
    },
  ],
  journals: [
    {
      id: 'j-1',
      date: '2026-07-24',
      content: 'Built the foundational architecture for Memory OS today. The offline-first model combined with Framer Motion feels remarkably fast and responsive. Setting high standards for portfolio-quality UI.',
      mood: 'great',
      weather: 'Sunny 24°C',
      tags: ['focus', 'achievement', 'building'],
      prompt: 'What was your biggest breakthrough today?',
      isFavorite: true,
      createdAt: '2026-07-24T20:00:00Z',
      updatedAt: '2026-07-24T20:00:00Z',
    },
    {
      id: 'j-2',
      date: '2026-07-23',
      content: 'Focused 4 hours of uninterrupted deep work on systemic knowledge graphs. Practiced early morning meditation and 10km run.',
      mood: 'good',
      weather: 'Clear Sky',
      tags: ['deep-work', 'fitness'],
      prompt: 'How did you protect your focus time today?',
      isFavorite: false,
      createdAt: '2026-07-23T21:15:00Z',
      updatedAt: '2026-07-23T21:15:00Z',
    },
  ],
  bookmarks: [
    {
      id: 'bm-1',
      title: 'Vercel Design Guidelines & Geist Font Family',
      url: 'https://vercel.com/design',
      description: 'Comprehensive guide to modern web typography, micro-interactions, and spatial layouts.',
      favicon: 'https://vercel.com/favicon.ico',
      tags: ['design', 'vercel', 'typography'],
      collectionId: 'col-2',
      isFavorite: true,
      isArchived: false,
      isTrash: false,
      createdAt: '2026-07-20T11:00:00Z',
    },
    {
      id: 'bm-2',
      title: 'Ink & Switch - Local-First Software Lab',
      url: 'https://www.inkandswitch.com/local-first/',
      description: 'Foundational research papers on offline storage, CRDTs, and local user ownership.',
      favicon: 'https://www.inkandswitch.com/favicon.ico',
      tags: ['research', 'local-first'],
      collectionId: 'col-1',
      isFavorite: true,
      isArchived: false,
      isTrash: false,
      createdAt: '2026-07-18T16:20:00Z',
    },
    {
      id: 'bm-3',
      title: 'React Flow Documentation',
      url: 'https://reactflow.dev',
      description: 'Node-based interactive workflow canvas for diagrams, graphs, and mind maps.',
      favicon: 'https://reactflow.dev/favicon.ico',
      tags: ['developer', 'react-flow'],
      collectionId: 'col-1',
      isFavorite: false,
      isArchived: false,
      isTrash: false,
      createdAt: '2026-07-19T09:40:00Z',
    },
  ],
  graphNodes: [
    { id: 'gn-1', label: 'Local-First Storage', type: 'note', color: '#6366F1', val: 12 },
    { id: 'gn-2', label: 'Glassmorphism UI', type: 'note', color: '#EC4899', val: 10 },
    { id: 'gn-3', label: 'First Principles', type: 'note', color: '#10B981', val: 8 },
    { id: 'gn-4', label: 'AI Agents & RAG', type: 'note', color: '#F59E0B', val: 9 },
    { id: 'gn-5', label: 'System Design', type: 'collection', color: '#8B5CF6', val: 15 },
    { id: 'gn-6', label: 'PWA Specification', type: 'task', color: '#EF4444', val: 7 },
  ],
  graphEdges: [
    { id: 'ge-1', source: 'gn-1', target: 'gn-5', label: 'belongs to' },
    { id: 'ge-2', source: 'gn-2', target: 'gn-5', label: 'styled by' },
    { id: 'ge-3', source: 'gn-3', target: 'gn-1', label: 'inspires' },
    { id: 'ge-4', source: 'gn-4', target: 'gn-1', label: 'queries' },
    { id: 'ge-5', source: 'gn-6', target: 'gn-1', label: 'implements' },
  ],
  mindMapNodes: [
    {
      id: 'mm-root',
      type: 'default',
      position: { x: 250, y: 150 },
      data: { label: '🧠 Memory OS Core', color: '#6366F1' },
    },
    {
      id: 'mm-1',
      type: 'default',
      position: { x: 50, y: 300 },
      data: { label: '💾 Local-First Engine', color: '#10B981' },
      parentId: 'mm-root',
    },
    {
      id: 'mm-2',
      type: 'default',
      position: { x: 450, y: 300 },
      data: { label: '🎨 Apple / Linear Design', color: '#EC4899' },
      parentId: 'mm-root',
    },
    {
      id: 'mm-3',
      type: 'default',
      position: { x: -50, y: 430 },
      data: { label: '⚡ Sub-ms Fuse.js Search', color: '#F59E0B' },
      parentId: 'mm-1',
    },
    {
      id: 'mm-4',
      type: 'default',
      position: { x: 150, y: 430 },
      data: { label: '📱 PWA Offline Cache', color: '#3B82F6' },
      parentId: 'mm-1',
    },
    {
      id: 'mm-5',
      type: 'default',
      position: { x: 380, y: 430 },
      data: { label: '✨ Framer Micro-Animations', color: '#8B5CF6' },
      parentId: 'mm-2',
    },
  ],
  mindMapEdges: [
    { id: 'mme-1', source: 'mm-root', target: 'mm-1', animated: true },
    { id: 'mme-2', source: 'mm-root', target: 'mm-2', animated: true },
    { id: 'mme-3', source: 'mm-1', target: 'mm-3' },
    { id: 'mme-4', source: 'mm-1', target: 'mm-4' },
    { id: 'mme-5', source: 'mm-2', target: 'mm-5' },
  ],
  voiceNotes: [
    {
      id: 'vn-1',
      title: 'Architectural Reflection on Offline State Synchronization',
      duration: 84,
      audioUrl: '',
      transcript: 'Recorded key insights on how LocalStorage snapshotting provides instantaneous UI updates without network overhead. Remember to verify JSON backup integrity.',
      tags: ['audio', 'architecture'],
      isFavorite: true,
      createdAt: '2026-07-24T11:45:00Z',
    },
    {
      id: 'vn-2',
      title: 'Product Design Vision: Raycast Meets Notion',
      duration: 142,
      audioUrl: '',
      transcript: 'Combining keyboard-driven navigation with rich markdown canvas layout creates effortless cognitive flow for power users.',
      tags: ['ui/ux', 'ideas'],
      isFavorite: false,
      createdAt: '2026-07-23T17:10:00Z',
    },
  ],
  pdfDocs: [
    {
      id: 'pdf-1',
      title: 'Local-First-Software-Research.pdf',
      size: '2.4 MB',
      totalPages: 18,
      highlights: [
        {
          id: 'hl-1',
          page: 3,
          highlightText: 'User data must reside locally as primary authority rather than a remote cloud cache.',
          note: 'Key foundation for Memory OS storage engine.',
          createdAt: '2026-07-22T10:00:00Z',
        },
        {
          id: 'hl-2',
          page: 7,
          highlightText: 'Sub-millisecond query response is essential to maintain cognitive flow state.',
          createdAt: '2026-07-22T10:15:00Z',
        },
      ],
      tags: ['research', 'architecture'],
      createdAt: '2026-07-22T09:30:00Z',
    },
    {
      id: 'pdf-2',
      title: 'Nextjs-App-Router-Best-Practices.pdf',
      size: '1.8 MB',
      totalPages: 12,
      highlights: [
        {
          id: 'hl-3',
          page: 5,
          highlightText: 'Optimizing client component boundaries for instantaneous client-side navigation.',
          note: 'Applied to Memory OS page routing.',
          createdAt: '2026-07-21T16:00:00Z',
        },
      ],
      tags: ['nextjs', 'guide'],
      createdAt: '2026-07-21T15:00:00Z',
    },
  ],
  mediaItems: [
    {
      id: 'med-1',
      title: 'Memory OS Dark Mode Spec Mockup',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '16/9',
      tags: ['mockup', 'design', 'ui'],
      isFavorite: true,
      createdAt: '2026-07-24T10:00:00Z',
    },
    {
      id: 'med-2',
      title: 'Spatial UI Glassmorphic Texture',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '4/3',
      tags: ['abstract', 'inspiration'],
      isFavorite: false,
      createdAt: '2026-07-23T14:30:00Z',
    },
    {
      id: 'med-3',
      title: 'Minimalist Workspace Ambient Setup',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '16/9',
      tags: ['workspace', 'focus'],
      isFavorite: true,
      createdAt: '2026-07-22T08:20:00Z',
    },
  ],
};
