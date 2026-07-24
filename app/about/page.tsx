'use client';

import React from 'react';
import { Brain, Cpu, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">About Memory OS</h1>
        <p className="text-xs text-zinc-400">Architecture, tech stack & Local-First engineering philosophy</p>
      </div>

      <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-glass space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Memory OS Specifications</h2>
            <p className="text-xs text-zinc-400">Designed like Apple + Notion + Linear + Obsidian + Arc Browser</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            Memory OS is built to eliminate context-switching latency in personal cognitive management.
            It integrates spatial markdown note-taking, Kanban tasks, daily journal reflections, web bookmarking,
            interactive knowledge graph clustering, and collapsible mind maps into a unified client-side application.
          </p>

          <h3 className="font-bold text-sm text-indigo-400 uppercase tracking-wider">Tech Stack Matrix</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <li className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">Framework: Next.js 15 App Router</li>
            <li className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">Language: TypeScript</li>
            <li className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">Styling: Tailwind CSS & Glassmorphism</li>
            <li className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">State: Zustand Reactive Store</li>
            <li className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">Animations: Framer Motion</li>
            <li className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">Search: Fuse.js Fuzzy Engine</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
