'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Bookmark as BookmarkIcon, 
  GitFork, 
  Network, 
  Folder, 
  Settings, 
  Plus, 
  Download, 
  Sun, 
  Moon, 
  Command,
  ArrowRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemoryStore } from '../store/useMemoryStore';
import { useTheme } from 'next-themes';
import { memoryStorage } from '../lib/storage';

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { 
    isCommandPaletteOpen, 
    setCommandPaletteOpen, 
    setQuickCaptureOpen,
    exportJSON
  } = useMemoryStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  // Keyboard shortcut listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Handle live query search
  useEffect(() => {
    if (query.trim()) {
      const searchRes = memoryStorage.search(query);
      setResults(searchRes.slice(0, 8));
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (path: string) => {
    setCommandPaletteOpen(false);
    setQuery('');
    router.push(path);
  };

  const quickActions = [
    {
      id: 'quick-capture',
      label: 'Quick Capture Entry...',
      icon: Plus,
      action: () => {
        setCommandPaletteOpen(false);
        setQuickCaptureOpen(true);
      },
    },
    {
      id: 'go-notes',
      label: 'Go to Notes Canvas',
      icon: FileText,
      action: () => navigateTo('/notes'),
    },
    {
      id: 'go-tasks',
      label: 'Go to Tasks Kanban',
      icon: CheckSquare,
      action: () => navigateTo('/tasks'),
    },
    {
      id: 'go-journal',
      label: 'Go to Daily Journal',
      icon: BookOpen,
      action: () => navigateTo('/journal'),
    },
    {
      id: 'go-graph',
      label: 'Open Knowledge Graph',
      icon: Network,
      action: () => navigateTo('/graph'),
    },
    {
      id: 'go-mindmap',
      label: 'Open Mind Maps',
      icon: GitFork,
      action: () => navigateTo('/mindmap'),
    },
    {
      id: 'toggle-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'export-data',
      label: 'Export Local Data Backup (JSON)',
      icon: Download,
      action: () => {
        exportJSON();
        setCommandPaletteOpen(false);
      },
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-glass overflow-hidden flex flex-col text-zinc-100"
        >
          {/* Header Search Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/40">
            <Search className="w-5 h-5 text-indigo-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search notes, tasks, bookmarks..."
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 outline-none text-base font-normal"
              autoFocus
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Results List */}
          <div className="max-h-96 overflow-y-auto p-2 divide-y divide-zinc-800/50">
            {/* Search Query Results */}
            {query.trim() !== '' && (
              <div className="p-2 space-y-1">
                <div className="text-xs font-semibold text-zinc-500 uppercase px-2 mb-1">
                  Search Results ({results.length})
                </div>
                {results.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-zinc-500">
                    No matching items found for "{query}"
                  </div>
                ) : (
                  results.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.itemType === 'note' || item.title) navigateTo('/notes');
                        else if (item.itemType === 'task') navigateTo('/tasks');
                        else if (item.itemType === 'journal') navigateTo('/journal');
                        else navigateTo('/bookmarks');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-600/10 hover:border-indigo-500/20 border border-transparent text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-sm font-medium text-zinc-200 group-hover:text-indigo-300">
                            {item.title || item.name || item.content?.slice(0, 40) || 'Untitled'}
                          </div>
                          {item.tags && (
                            <div className="text-xs text-zinc-500 truncate">
                              #{item.tags.join(' #')}
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Default Quick Commands */}
            {query.trim() === '' && (
              <div className="p-2 space-y-1">
                <div className="text-xs font-semibold text-zinc-500 uppercase px-2 mb-1">
                  Quick Actions & Navigation
                </div>
                {quickActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={act.action}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-zinc-800 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{act.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-t border-zinc-800/80 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">
                <Command className="w-3 h-3 inline mr-0.5" />K
              </span>
              <span>to toggle</span>
            </div>
            <span>Memory OS Offline-First Vault</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
