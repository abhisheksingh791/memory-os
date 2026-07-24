'use client';

import React from 'react';
import { TimelineView } from '../../components/TimelineView';

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Activity Timeline</h1>
        <p className="text-xs text-zinc-400">Vertical chronological stream of captured notes, tasks & reflections</p>
      </div>

      <TimelineView />
    </div>
  );
}
