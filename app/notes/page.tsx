'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Grid, 
  List, 
  Search, 
  Filter, 
  Folder, 
  Tag, 
  Star, 
  Sparkles, 
  Check, 
  X,
  Eye,
  Edit3
} from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';
import { NoteCard } from '../../components/NoteCard';
import { Note } from '../../types/memory';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotesPage() {
  const { data, addNote, updateNote } = useMemoryStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Editor State
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editColor, setEditColor] = useState('#6366F1');
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');

  const notes = data.notes?.filter((n) => !n.isTrash && !n.isArchived) || [];

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? n.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));

  const handleOpenEdit = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags?.join(', ') || '');
    setEditColor(note.color || '#6366F1');
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setEditTitle('');
    setEditContent('');
    setEditTags('');
    setEditColor('#6366F1');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = editTags ? editTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : ['note'];

    if (isCreating) {
      addNote({
        title: editTitle || 'Untitled Note',
        content: editContent,
        type: 'markdown',
        tags: tagsArr,
        color: editColor,
        isFavorite: false,
        isArchived: false,
        isPinned: false,
        isTrash: false,
      });
    } else if (selectedNote) {
      updateNote(selectedNote.id, {
        title: editTitle,
        content: editContent,
        tags: tagsArr,
        color: editColor,
      });
    }

    setSelectedNote(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Notes Vault</h1>
          <p className="text-xs text-zinc-400">Spatial Markdown notes canvas with instant autosave</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'grid' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'list' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 w-full sm:w-80">
          <Search className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent focus:outline-none w-full placeholder-zinc-500 text-xs"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedTag('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              !selectedTag
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            All Notes
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Display Grid / List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onSelect={handleOpenEdit} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleOpenEdit(note)}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 cursor-pointer flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: note.color || '#6366F1' }}
                />
                <div>
                  <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-indigo-300">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1">{note.content}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                {note.tags?.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-zinc-950 text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Editor Drawer / Modal */}
      <AnimatePresence>
        {(selectedNote || isCreating) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-3xl h-[85vh] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-glass overflow-hidden flex flex-col text-zinc-100"
            >
              {/* Editor Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-sm">
                    {isCreating ? 'Create New Note' : 'Edit Note'}
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Autosave Active
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setEditorTab('edit')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
                        editorTab === 'edit'
                          ? 'bg-indigo-600/20 text-indigo-300'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
                        editorTab === 'preview'
                          ? 'bg-indigo-600/20 text-indigo-300'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedNote(null);
                      setIsCreating(false);
                    }}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Editor Form */}
              <form onSubmit={handleSave} className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-lg font-bold text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />

                {editorTab === 'edit' ? (
                  <textarea
                    rows={14}
                    placeholder="Write content in Markdown syntax (# Header, - bullet, > blockquote)..."
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                ) : (
                  <div className="w-full flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-sm text-zinc-200 overflow-y-auto leading-relaxed prose prose-invert">
                    <h2 className="text-xl font-bold text-indigo-400 mb-2">{editTitle || 'Untitled'}</h2>
                    <div className="whitespace-pre-wrap font-sans">{editContent}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <input
                    type="text"
                    placeholder="Tags (comma separated)..."
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
                  />

                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
                    <span className="text-xs text-zinc-400">Accent Color:</span>
                    {['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'].map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`w-5 h-5 rounded-full border ${
                          editColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNote(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-glow transition-all"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
