'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';
import { TaskCard } from '../../components/TaskCard';
import { TaskStatus } from '../../types/memory';

export default function TasksPage() {
  const { data, addTask, setQuickCaptureOpen } = useMemoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const tasks = data.tasks?.filter((t) => !t.isTrash && !t.isArchived) || [];

  const todoTasks = tasks.filter(
    (t) => t.status === 'todo' && (filterPriority === 'all' || t.priority === filterPriority)
  );
  const inProgressTasks = tasks.filter(
    (t) => t.status === 'in-progress' && (filterPriority === 'all' || t.priority === filterPriority)
  );
  const completedTasks = tasks.filter(
    (t) => t.status === 'completed' && (filterPriority === 'all' || t.priority === filterPriority)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Tasks Kanban</h1>
          <p className="text-xs text-zinc-400">Action items, subtasks, priorities & due dates</p>
        </div>

        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Action Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 w-full sm:w-72">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent focus:outline-none w-full placeholder-zinc-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Priority:</span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-xl text-xs uppercase font-bold transition-all ${
                filterPriority === p
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Todo */}
        <div className="p-4 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <h3 className="font-bold text-sm text-zinc-200">To Do</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {todoTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="p-4 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="font-bold text-sm text-zinc-200">In Progress</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {inProgressTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="p-4 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-sm text-zinc-200">Completed</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
              {completedTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {completedTasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
