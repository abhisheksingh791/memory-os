'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, Home, Database } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
        <WifiOff className="w-8 h-8 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-bold text-zinc-100">You Are Offline</h1>
        <p className="text-xs text-zinc-400">
          Memory OS is a Local-First Progressive Web App. All your notes, tasks, and journals remain fully accessible from local storage!
        </p>
      </div>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-xs shadow-glow transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
