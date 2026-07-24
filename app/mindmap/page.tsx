'use client';

import React from 'react';
import { MindMapCanvas } from '../../components/MindMapCanvas';

export default function MindMapPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Mind Maps</h1>
        <p className="text-xs text-zinc-400">Interactive visual tree builder for brainstorming & concept mapping</p>
      </div>

      <MindMapCanvas />
    </div>
  );
}
