'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, color = '#6366F1', trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle flex flex-col justify-between space-y-3 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
        <div
          className="p-2.5 rounded-xl border transition-colors"
          style={{
            backgroundColor: `${color}15`,
            borderColor: `${color}30`,
            color: color,
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-extrabold tracking-tight text-zinc-100 font-mono">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-zinc-500 font-normal">{subtitle}</p>
        )}
      </div>

      {trend && (
        <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
          <span>{trend}</span>
        </div>
      )}

      {/* Background glow accent */}
      <div
        className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
