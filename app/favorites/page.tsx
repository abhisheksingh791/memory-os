'use client';

import React from 'react';
import { Star, FileText, Bookmark as BookmarkIcon } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';
import { NoteCard } from '../../components/NoteCard';
import { BookmarkCard } from '../../components/BookmarkCard';

export default function FavoritesPage() {
  const { data } = useMemoryStore();

  const favoriteNotes = data.notes?.filter((n) => n.isFavorite && !n.isTrash) || [];
  const favoriteBookmarks = data.bookmarks?.filter((b) => b.isFavorite && !b.isTrash) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Favorites & Starred</h1>
          <p className="text-xs text-zinc-400">Quick access to essential starred notes, tasks & links</p>
        </div>

        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Star className="w-5 h-5 fill-current" />
        </div>
      </div>

      {/* Favorite Notes */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-zinc-200">Favorite Notes ({favoriteNotes.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>

      {/* Favorite Bookmarks */}
      <div className="space-y-4 pt-4 border-t border-zinc-900">
        <h3 className="font-bold text-sm text-zinc-200">Favorite Bookmarks ({favoriteBookmarks.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </div>
    </div>
  );
}
