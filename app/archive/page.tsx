'use client';

import React from 'react';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';

export default function ArchivePage() {
  const { data, toggleArchiveNote, deleteNote } = useMemoryStore();
  const archivedNotes = data.notes?.filter((n) => n.isArchived && !n.isTrash) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Archived Items</h1>
          <p className="text-xs text-zinc-400">Historical notes & memory records saved out of active workspace</p>
        </div>

        <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
          <Archive className="w-5 h-5" />
        </div>
      </div>

      {archivedNotes.length === 0 ? (
        <div className="text-center py-16 text-xs text-zinc-500">No archived notes found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archivedNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-subtle flex flex-col justify-between space-y-3"
            >
              <div>
                <h3 className="font-semibold text-sm text-zinc-100">{note.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{note.content}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                <span className="text-zinc-500 font-mono text-[10px]">Archived</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleArchiveNote(note.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-lg text-xs hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Unarchive</span>
                  </button>
                  <button
                    onClick={() => deleteNote(note.id, true)}
                    className="p-1 text-zinc-500 hover:text-red-400 rounded"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
