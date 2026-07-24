'use client';

import React, { useState } from 'react';
import { Bookmark, Plus, Search, Globe, ExternalLink } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';
import { BookmarkCard } from '../../components/BookmarkCard';

export default function BookmarksPage() {
  const { data, setQuickCaptureOpen } = useMemoryStore();
  const [searchQuery, setSearchQuery] = useState('');

  const bookmarks = data.bookmarks?.filter((b) => !b.isTrash) || [];
  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Bookmarks</h1>
          <p className="text-xs text-zinc-400">Captured web links, articles & online reference tools</p>
        </div>

        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bookmark</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 w-full sm:w-80">
        <Search className="w-4 h-4 text-indigo-400 shrink-0" />
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent focus:outline-none w-full placeholder-zinc-500 text-xs"
        />
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}
