'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileText, CheckSquare, BookOpen } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';

export default function CalendarPage() {
  const { data } = useMemoryStore();
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-24');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const notesCount = data.notes?.filter((n) => n.createdAt?.startsWith(dateStr)).length || 0;
    const tasksCount = data.tasks?.filter((t) => t.createdAt?.startsWith(dateStr)).length || 0;
    const journalCount = data.journals?.filter((j) => j.date === dateStr).length || 0;

    return {
      dayNum,
      dateStr,
      notesCount,
      tasksCount,
      journalCount,
      total: notesCount + tasksCount + journalCount,
    };
  });

  const selectedItems = {
    notes: data.notes?.filter((n) => n.createdAt?.startsWith(selectedDate)) || [],
    tasks: data.tasks?.filter((t) => t.createdAt?.startsWith(selectedDate)) || [],
    journals: data.journals?.filter((j) => j.date === selectedDate) || [],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Memory Calendar</h1>
          <p className="text-xs text-zinc-400">Chronological history of notes, tasks & reflections</p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300">
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold">July 2026</span>
        </div>
      </div>

      {/* Month Grid & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Grid */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-glass space-y-4">
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((d) => {
              const isSelected = selectedDate === d.dateStr;
              return (
                <button
                  key={d.dayNum}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-between min-h-[70px] transition-all relative ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-glow ring-2 ring-indigo-500/40'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">{d.dayNum}</span>

                  {d.total > 0 && (
                    <div className="flex gap-1 mt-1">
                      {d.notesCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                      {d.tasksCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      {d.journalCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Inspector */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-glass space-y-4">
          <h3 className="font-bold text-base text-zinc-100 border-b border-zinc-900 pb-3">
            Activity on {selectedDate}
          </h3>

          <div className="space-y-3">
            {selectedItems.notes.map((n) => (
              <div key={n.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{n.title}</span>
                </div>
                <p className="text-zinc-400 line-clamp-1">{n.content}</p>
              </div>
            ))}

            {selectedItems.tasks.map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{t.title}</span>
                </div>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">{t.status}</span>
              </div>
            ))}

            {selectedItems.journals.map((j) => (
              <div key={j.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <div className="flex items-center gap-2 text-pink-400 font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Daily Reflection ({j.mood})</span>
                </div>
                <p className="text-zinc-400 line-clamp-2">{j.content}</p>
              </div>
            ))}

            {selectedItems.notes.length === 0 &&
              selectedItems.tasks.length === 0 &&
              selectedItems.journals.length === 0 && (
                <div className="text-center py-8 text-xs text-zinc-500">
                  No memory entries recorded on this date.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
