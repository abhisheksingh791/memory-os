'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, Smile, Sun, Sparkles } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';
import { JournalCard } from '../../components/JournalCard';

export default function JournalPage() {
  const { data, addJournal, setQuickCaptureOpen } = useMemoryStore();
  const journals = data.journals || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Daily Journal</h1>
          <p className="text-xs text-zinc-400">Reflection entries, mood tracking & cognitive logs</p>
        </div>

        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Journal Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {journals.map((entry) => (
          <JournalCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
