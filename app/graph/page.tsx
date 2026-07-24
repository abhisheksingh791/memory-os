'use client';

import React from 'react';
import { KnowledgeGraphViewer } from '../../components/KnowledgeGraphViewer';

export default function GraphPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Knowledge Graph</h1>
        <p className="text-xs text-zinc-400">Interactive node network across notes, collections, tasks, and memory clusters</p>
      </div>

      <KnowledgeGraphViewer />
    </div>
  );
}
