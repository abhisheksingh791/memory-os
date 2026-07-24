'use client';

import React from 'react';
import { useMemoryStore } from '../store/useMemoryStore';
import { FileText, CheckSquare, BookOpen, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function TimelineView() {
  const { data } = useMemoryStore();

  const timelineItems = [
    ...(data.notes?.map((n) => ({
      id: n.id,
      title: n.title,
      type: 'note' as const,
      timestamp: n.createdAt,
      detail: n.tags?.join(', '),
    })) || []),
    ...(data.tasks?.map((t) => ({
      id: t.id,
      title: t.title,
      type: 'task' as const,
      timestamp: t.createdAt,
      detail: `Status: ${t.status} | Priority: ${t.priority}`,
    })) || []),
    ...(data.journals?.map((j) => ({
      id: j.id,
      title: `Daily Reflection (${j.date})`,
      type: 'journal' as const,
      timestamp: j.createdAt,
      detail: `Mood: ${j.mood}`,
    })) || []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getIcon = (type: 'note' | 'task' | 'journal') => {
    switch (type) {
      case 'note':
        return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'journal':
        return <BookOpen className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-zinc-800">
      {timelineItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative pl-12 group"
        >
          {/* Timeline Node Bullet */}
          <div className="absolute left-2.5 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            {getIcon(item.type)}
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 shadow-subtle flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                {item.type}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>
            <h4 className="font-semibold text-sm text-zinc-100">{item.title}</h4>
            {item.detail && <p className="text-xs text-zinc-400">{item.detail}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
