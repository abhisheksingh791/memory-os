'use client';

import React from 'react';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';

export default function TrashPage() {
  const { data, updateNote, deleteNote } = useMemoryStore();
  const trashedNotes = data.notes?.filter((n) => n.isTrash) || [];

  const handleEmptyTrash = () => {
    trashedNotes.forEach((n) => deleteNote(n.id, true));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Trash Bin</h1>
          <p className="text-xs text-zinc-400">Soft-deleted items. Restore or empty permanently.</p>
        </div>

        {trashedNotes.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl shadow-glow transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash</span>
          </button>
        )}
      </div>

      {trashedNotes.length === 0 ? (
        <div className="text-center py-16 text-xs text-zinc-500">Trash is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trashedNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-3xl bg-zinc-900/80 border border-red-500/20 shadow-subtle flex flex-col justify-between space-y-3"
            >
              <div>
                <h3 className="font-semibold text-sm text-zinc-100">{note.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{note.content}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                <span className="text-red-400 font-mono text-[10px]">In Trash</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateNote(note.id, { isTrash: false })}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-lg text-xs hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
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
