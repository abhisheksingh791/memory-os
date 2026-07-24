'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Bookmark as BookmarkIcon, 
  X, 
  Sparkles,
  Tag,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemoryStore } from '../store/useMemoryStore';

type CaptureTab = 'note' | 'task' | 'journal' | 'bookmark';

export function QuickCaptureModal() {
  const { isQuickCaptureOpen, setQuickCaptureOpen, addNote, addTask, addJournal, addBookmark, data } = useMemoryStore();

  const [activeTab, setActiveTab] = useState<CaptureTab>('note');
  
  // Note Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Journal Form State
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<'great' | 'good' | 'neutral' | 'bad' | 'terrible'>('good');

  // Bookmark Form State
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [bookmarkUrl, setBookmarkUrl] = useState('');

  if (!isQuickCaptureOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = noteTags ? noteTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : ['quick-capture'];

    if (activeTab === 'note') {
      if (!noteTitle.trim() && !noteContent.trim()) return;
      addNote({
        title: noteTitle || 'Quick Note',
        content: noteContent,
        type: 'markdown',
        tags: tagsArr,
        collectionId: selectedCollection || undefined,
        isFavorite: false,
        isArchived: false,
        isPinned: false,
        isTrash: false,
      });
    } else if (activeTab === 'task') {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle,
        description: '',
        status: 'todo',
        priority: taskPriority,
        dueDate: taskDueDate || undefined,
        subtasks: [],
        tags: tagsArr,
        collectionId: selectedCollection || undefined,
        isFavorite: false,
        isArchived: false,
        isTrash: false,
      });
    } else if (activeTab === 'journal') {
      if (!journalContent.trim()) return;
      addJournal({
        date: new Date().toISOString().split('T')[0],
        content: journalContent,
        mood: journalMood,
        weather: 'Sunny',
        tags: ['journal', ...tagsArr],
        prompt: 'What captured your focus today?',
        isFavorite: false,
      });
    } else if (activeTab === 'bookmark') {
      if (!bookmarkUrl.trim()) return;
      addBookmark({
        title: bookmarkTitle || bookmarkUrl,
        url: bookmarkUrl,
        description: 'Captured via Quick Action',
        tags: tagsArr,
        collectionId: selectedCollection || undefined,
        isFavorite: false,
        isArchived: false,
        isTrash: false,
      });
    }

    // Reset & Close
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setTaskTitle('');
    setJournalContent('');
    setBookmarkTitle('');
    setBookmarkUrl('');
    setQuickCaptureOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-glass overflow-hidden flex flex-col text-zinc-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-base">Quick Capture</h3>
            </div>
            <button
              onClick={() => setQuickCaptureOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/30 p-2 gap-1">
            {[
              { id: 'note', label: 'Note', icon: FileText },
              { id: 'task', label: 'Task', icon: CheckSquare },
              { id: 'journal', label: 'Journal', icon: BookOpen },
              { id: 'bookmark', label: 'Bookmark', icon: BookmarkIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CaptureTab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {activeTab === 'note' && (
              <>
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <textarea
                  rows={4}
                  placeholder="Write your note content in Markdown..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </>
            )}

            {activeTab === 'task' && (
              <>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Due Date</label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'journal' && (
              <>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Today's Mood</label>
                  <div className="flex gap-2">
                    {(['great', 'good', 'neutral', 'bad', 'terrible'] as const).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setJournalMood(m)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-capitalize transition-all border ${
                          journalMood === m
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={4}
                  placeholder="Reflect on your day, thoughts, or achievements..."
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                  autoFocus
                />
              </>
            )}

            {activeTab === 'bookmark' && (
              <>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={bookmarkUrl}
                  onChange={(e) => setBookmarkUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Link Title / Label..."
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </>
            )}

            {/* Collection & Tag inputs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                <Folder className="w-4 h-4 text-zinc-500 shrink-0" />
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="">No Collection</option>
                  {data.collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                <Tag className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full bg-transparent text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setQuickCaptureOpen(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 rounded-xl hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-glow transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Save Entry
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
