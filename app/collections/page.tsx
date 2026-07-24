'use client';

import React, { useState } from 'react';
import { Folder, Plus, FileText, CheckSquare, Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';

export default function CollectionsPage() {
  const { data, addCollection, deleteCollection } = useMemoryStore();
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColColor, setNewColColor] = useState('#6366F1');
  const [isCreating, setIsCreating] = useState(false);

  const collections = data.collections || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    addCollection({
      name: newColName,
      description: newColDesc,
      color: newColColor,
      icon: 'Folder',
    });

    setNewColName('');
    setNewColDesc('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Collections</h1>
          <p className="text-xs text-zinc-400">System spaces, notebooks & domain folders</p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Create Collection Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <h3 className="font-semibold text-sm text-zinc-200">Create Workspace Collection</h3>
          <input
            type="text"
            placeholder="Collection Name..."
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description..."
            value={newColDesc}
            onChange={(e) => setNewColDesc(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Color Badge:</span>
            {['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'].map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setNewColColor(color)}
                className={`w-6 h-6 rounded-full border ${
                  newColColor === color ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 text-xs bg-indigo-600 text-white rounded-xl font-semibold"
            >
              Save Collection
            </button>
          </div>
        </form>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((col) => {
          const colNotes = data.notes?.filter((n) => n.collectionId === col.id) || [];
          const colTasks = data.tasks?.filter((t) => t.collectionId === col.id) || [];
          const colBookmarks = data.bookmarks?.filter((b) => b.collectionId === col.id) || [];

          return (
            <div
              key={col.id}
              className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-subtle"
                    style={{ backgroundColor: col.color }}
                  >
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-100">{col.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-1">{col.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteCollection(col.id)}
                  className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Collection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Item Counters Badges */}
              <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{colNotes.length} Notes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{colTasks.length} Tasks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-pink-400" />
                  <span>{colBookmarks.length} Bookmarks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
