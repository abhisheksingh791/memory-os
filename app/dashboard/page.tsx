'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Bookmark, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Pin, 
  Star, 
  Folder,
  Network,
  Database
} from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';
import { StatCard } from '../../components/StatCard';
import { NoteCard } from '../../components/NoteCard';
import { TaskCard } from '../../components/TaskCard';
import { KnowledgeGraphViewer } from '../../components/KnowledgeGraphViewer';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data, setQuickCaptureOpen } = useMemoryStore();

  const notesCount = data.notes?.filter((n) => !n.isTrash && !n.isArchived).length || 0;
  const tasksCount = data.tasks?.filter((t) => !t.isTrash && t.status !== 'completed').length || 0;
  const journalsCount = data.journals?.length || 0;
  const collectionsCount = data.collections?.length || 0;

  const pinnedNotes = data.notes?.filter((n) => n.isPinned && !n.isTrash) || [];
  const recentNotes = data.notes?.filter((n) => !n.isTrash && !n.isArchived).slice(0, 4) || [];
  const pendingTasks = data.tasks?.filter((t) => t.status !== 'completed' && !t.isTrash).slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-zinc-950 border border-indigo-500/20 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back to Memory OS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Mind, Organized.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            All data stored in your local vault with zero cloud latency. What would you like to capture today?
          </p>
        </div>

        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-glow hover:scale-105 transition-all shrink-0 z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Capture Entry</span>
        </button>

        {/* Ambient glow decoration */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Notes"
          value={notesCount}
          subtitle="Spatial Markdown & Rich Notes"
          icon={FileText}
          color="#6366F1"
        />
        <StatCard
          title="Pending Tasks"
          value={tasksCount}
          subtitle="Kanban & Action Items"
          icon={CheckSquare}
          color="#22C55E"
        />
        <StatCard
          title="Daily Reflections"
          value={journalsCount}
          subtitle="Reflections & Mood Logs"
          icon={BookOpen}
          color="#EC4899"
        />
        <StatCard
          title="Collections"
          value={collectionsCount}
          subtitle="System Folders & Spaces"
          icon={Folder}
          color="#F59E0B"
        />
      </div>

      {/* Pinned & Recent Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-indigo-400" />
            <h2 className="font-bold text-lg text-zinc-100">Pinned & Recent Notes</h2>
          </div>
          <Link
            href="/notes"
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <span>View All Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pinnedNotes.length > 0
            ? pinnedNotes.map((note) => <NoteCard key={note.id} note={note} />)
            : recentNotes.map((note) => <NoteCard key={note.id} note={note} />)}
        </div>
      </div>

      {/* Knowledge Graph Preview */}
      <KnowledgeGraphViewer />

      {/* Tasks & Active Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks Kanban Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <h2 className="font-bold text-lg text-zinc-100">Action Items</h2>
            </div>
            <Link
              href="/tasks"
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <span>Tasks Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>

        {/* Collections Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-lg text-zinc-100">Collections</h2>
            </div>
            <Link
              href="/collections"
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              <span>All Spaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data.collections?.map((col) => (
              <Link
                key={col.id}
                href="/collections"
                className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: col.color }}
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-200 group-hover:text-white">
                      {col.name}
                    </h4>
                    <p className="text-xs text-zinc-500 line-clamp-1">{col.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
