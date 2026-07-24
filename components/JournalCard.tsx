'use client';

import React from 'react';
import { JournalEntry } from '../types/memory';
import { BookOpen, Calendar, Sun, CloudRain, Trash2, Tag, Star } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { motion } from 'framer-motion';

interface JournalCardProps {
  entry: JournalEntry;
}

export function JournalCard({ entry }: JournalCardProps) {
  const { deleteJournal, updateJournal } = useMemoryStore();

  const moodColors = {
    great: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    good: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    neutral: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    bad: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    terrible: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-subtle flex flex-col space-y-3 relative group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-sm text-zinc-200">{entry.date}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
              moodColors[entry.mood] || moodColors.good
            }`}
          >
            Mood: {entry.mood}
          </span>
          <button
            onClick={() => updateJournal(entry.id, { isFavorite: !entry.isFavorite })}
            className={`p-1 rounded ${entry.isFavorite ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {entry.prompt && (
        <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-indigo-300 italic font-serif">
          "{entry.prompt}"
        </div>
      )}

      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
        {entry.content}
      </p>

      <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-500 border-t border-zinc-800/50">
        <div className="flex items-center gap-2">
          {entry.weather && <span>{entry.weather}</span>}
        </div>
        <button
          onClick={() => deleteJournal(entry.id)}
          className="p-1 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
          title="Delete Entry"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
