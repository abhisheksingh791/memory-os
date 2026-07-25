'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Command, 
  Wifi, 
  WifiOff, 
  Sparkles, 
  Sun, 
  Moon,
  Database,
  Brain,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { usePWA } from './PWAProvider';
import { useTheme } from 'next-themes';
import { authService } from '../lib/supabase/auth';

export function Navbar() {
  const pathname = usePathname();
  const { setCommandPaletteOpen, setQuickCaptureOpen, data, user, isGuest, setAuthModalOpen, setUser, setGuest } = useMemoryStore();
  const { isOnline } = usePWA();
  const { theme, setTheme } = useTheme();

  // Determine current page title
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'LPU Memory OS';
      case '/dashboard': return 'Dashboard';
      case '/notes': return 'Notes Vault';
      case '/tasks': return 'Tasks Kanban';
      case '/journal': return 'Daily Journal';
      case '/calendar': return 'Memory Calendar';
      case '/graph': return 'Knowledge Graph';
      case '/mindmap': return 'Mind Maps';
      case '/collections': return 'Collections';
      case '/bookmarks': return 'Bookmarks';
      case '/gallery': return 'Media Gallery';
      case '/voicenotes': return 'Voice Notes';
      case '/pdf': return 'PDF Library';
      case '/timeline': return 'Activity Timeline';
      case '/favorites': return 'Favorites & Pinned';
      case '/archive': return 'Archived Items';
      case '/trash': return 'Trash Bin';
      case '/search': return 'Global Search';
      case '/settings': return 'System Settings';
      case '/about': return 'About LPU Memory OS';
      default: return 'LPU Memory OS';
    }
  };

  const totalEntries = (data.notes?.length || 0) + (data.tasks?.length || 0) + (data.journals?.length || 0);

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    setGuest(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between transition-colors">
      {/* Left Title & Status */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-zinc-100 font-bold group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-glow group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="text-base tracking-tight font-semibold hidden sm:inline">LPU Memory OS</span>
        </Link>
        <span className="text-zinc-700 text-sm hidden sm:inline">/</span>
        <h1 className="text-sm font-medium text-zinc-300">{getPageTitle(pathname)}</h1>
      </div>

      {/* Center Search Bar Trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden md:flex items-center justify-between w-64 lg:w-80 px-3.5 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all shadow-subtle"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>Search or command...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Offline Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isOnline
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}
          title={isOnline ? 'Online - Supabase Active' : 'Offline Mode Active'}
        >
          {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 animate-pulse" />}
          <span className="hidden lg:inline">{isOnline ? 'Supabase Sync' : 'Offline'}</span>
        </div>

        {/* Entry counter badge */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-xl">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>{totalEntries} items</span>
        </div>

        {/* Quick Capture Button */}
        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Capture</span>
        </button>

        {/* Auth / Profile Trigger */}
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold" title={user.email || 'User'}>
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium rounded-xl transition-all"
          >
            <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sign In</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
}
