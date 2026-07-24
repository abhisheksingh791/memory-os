'use client';

import React from 'react';
import { Bookmark } from '../types/memory';
import { ExternalLink, Star, Trash2, Globe } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { motion } from 'framer-motion';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { updateBookmark, deleteBookmark } = useMemoryStore();

  let domain = 'web';
  try {
    domain = new URL(bookmark.url).hostname.replace('www.', '');
  } catch (e) {}

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/80 shadow-subtle flex flex-col justify-between space-y-3 relative group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-zinc-100 truncate group-hover:text-indigo-300 transition-colors">
              {bookmark.title}
            </h4>
            <span className="text-[11px] text-zinc-500 font-mono block truncate">{domain}</span>
          </div>
        </div>

        <button
          onClick={() => updateBookmark(bookmark.id, { isFavorite: !bookmark.isFavorite })}
          className={`p-1 rounded ${bookmark.isFavorite ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'}`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {bookmark.description && (
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {bookmark.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
        <div className="flex flex-wrap gap-1">
          {bookmark.tags?.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] text-zinc-400 font-mono">
              #{t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-medium transition-colors"
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="p-1 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded"
            title="Delete Bookmark"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
