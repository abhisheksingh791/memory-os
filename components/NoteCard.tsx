'use client';

import React from 'react';
import { Note } from '../types/memory';
import { Star, Pin, Archive, Trash2, Tag, Calendar, Sparkles, FileText } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onSelect?: (note: Note) => void;
}

export function NoteCard({ note, onSelect }: NoteCardProps) {
  const { toggleFavoriteNote, toggleArchiveNote, togglePinNote, deleteNote } = useMemoryStore();

  const formattedDate = note.updatedAt
    ? formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })
    : 'Recently';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect && onSelect(note)}
      className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/80 shadow-subtle hover:shadow-glass cursor-pointer flex flex-col justify-between space-y-4 relative group overflow-hidden"
    >
      {/* Accent Color Strip */}
      {note.color && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: note.color }}
        />
      )}

      {/* Card Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
            {note.title || 'Untitled Note'}
          </h3>
          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePinNote(note.id);
              }}
              className={`p-1 rounded-lg hover:bg-zinc-800 ${
                note.isPinned ? 'text-indigo-400' : 'text-zinc-600 hover:text-zinc-300'
              }`}
              title="Pin Note"
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteNote(note.id);
              }}
              className={`p-1 rounded-lg hover:bg-zinc-800 ${
                note.isFavorite ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'
              }`}
              title="Favorite Note"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-normal">
          {note.content.replace(/[#*`_]/g, '')}
        </p>
      </div>

      {/* Card Footer Tags & Date */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/60 text-xs">
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 font-mono"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-zinc-500 font-mono self-center">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-zinc-500 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-zinc-600" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchiveNote(note.id);
              }}
              className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
              title="Archive Note"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
              title="Delete Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
