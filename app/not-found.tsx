'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono text-xl font-bold">
        404
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-bold text-zinc-100">Page Not Found</h1>
        <p className="text-xs text-zinc-400">
          The memory node or screen path you are looking for does not exist in this spatial vault.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-glow transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl font-semibold text-xs transition-all"
        >
          <Search className="w-4 h-4 text-indigo-400" />
          <span>Search Vault</span>
        </Link>
      </div>
    </div>
  );
}
