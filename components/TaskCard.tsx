'use client';

import React from 'react';
import { Task, TaskPriority } from '../types/memory';
import { CheckSquare, Square, Calendar, AlertCircle, Trash2, Tag, Check } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { toggleTaskStatus, toggleTaskSubtask, deleteTask } = useMemoryStore();

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/15 border-red-500/30 text-red-400';
      case 'high':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      case 'medium':
        return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400';
      default:
        return 'bg-zinc-800 border-zinc-700 text-zinc-400';
    }
  };

  const isCompleted = task.status === 'completed';
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtaskPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-4 rounded-2xl bg-zinc-900/90 border shadow-subtle flex flex-col space-y-3 transition-all ${
        isCompleted ? 'border-zinc-800/50 opacity-60' : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-zinc-700 hover:border-indigo-500 bg-zinc-950 text-transparent'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`font-semibold text-sm truncate ${
                isCompleted ? 'line-through text-zinc-500' : 'text-zinc-100'
              }`}
            >
              {task.title}
            </h4>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-xs text-zinc-400 line-clamp-2">{task.description}</p>
          )}
        </div>
      </div>

      {/* Subtasks Progress Bar & Checklist */}
      {totalSubtasks > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Subtasks Progress</span>
            <span className="font-mono">{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${subtaskPercent}%` }}
            />
          </div>

          <div className="space-y-1 pt-1">
            {task.subtasks.map((st) => (
              <button
                key={st.id}
                onClick={() => toggleTaskSubtask(task.id, st.id)}
                className="w-full flex items-center gap-2 text-left text-xs text-zinc-400 hover:text-zinc-200"
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                    st.completed ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-zinc-700'
                  }`}
                >
                  {st.completed && <Check className="w-2.5 h-2.5" />}
                </div>
                <span className={st.completed ? 'line-through text-zinc-500' : ''}>{st.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-zinc-400">
              <Calendar className="w-3 h-3 text-indigo-400" />
              {task.dueDate}
            </span>
          )}
        </div>

        <button
          onClick={() => deleteTask(task.id)}
          className="p-1 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
          title="Delete Task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
