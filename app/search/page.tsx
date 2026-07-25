'use client';

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, FileText, CheckSquare, BookOpen, Bookmark as BookmarkIcon, Filter, Database } from 'lucide-react';
import { memoryStorage } from '../../lib/storage';
import { queryService } from '../../lib/supabase/queries';
import { useMemoryStore } from '../../store/useMemoryStore';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [supabaseResults, setSupabaseResults] = useState<any[]>([]);
  const { user, isGuest } = useMemoryStore();

  useEffect(() => {
    if (!query.trim()) {
      setSupabaseResults([]);
      return;
    }

    if (user && !isGuest && navigator.onLine) {
      queryService.globalSearch(query, user.id).then((res) => {
        const combined = [
          ...(res.notes || []).map((n: any) => ({ ...n, itemType: 'note' })),
          ...(res.tasks || []).map((t: any) => ({ ...t, itemType: 'task' })),
          ...(res.bookmarks || []).map((b: any) => ({ ...b, itemType: 'bookmark' })),
          ...(res.journal || []).map((j: any) => ({ ...j, itemType: 'journal', title: `Journal (${j.date})` })),
        ];
        setSupabaseResults(combined);
      });
    }
  }, [query, user, isGuest]);

  const searchResults = query.trim()
    ? user && !isGuest && navigator.onLine && supabaseResults.length > 0
      ? supabaseResults
      : memoryStorage.search(query)
    : [];

  const filteredResults = searchResults.filter((r: any) => {
    if (filterType === 'all') return true;
    return r.itemType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Main Search Box */}
      <div className="space-y-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Global Search</h1>
          <p className="text-xs text-zinc-400">PostgreSQL Full Text Search & Fuse.js indexing</p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-100 shadow-glass">
          <SearchIcon className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            placeholder="Search across all notes, tasks, journals & bookmarks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none placeholder-zinc-500 text-sm"
            autoFocus
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">Filter Category:</span>
        {['all', 'note', 'task', 'journal', 'bookmark'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1 rounded-xl text-xs uppercase font-bold transition-all ${
              filterType === f
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {query.trim() && filteredResults.length === 0 && (
          <div className="text-center py-12 text-xs text-zinc-500">
            No matching entries found for "{query}".
          </div>
        )}

        {filteredResults.map((item: any) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {item.itemType || 'item'}
                </span>
                <h4 className="font-semibold text-sm text-zinc-100">
                  {item.title || item.name || 'Untitled'}
                </h4>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2">{item.content || item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
