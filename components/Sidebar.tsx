'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Calendar as CalendarIcon, 
  Network, 
  GitFork, 
  Folder, 
  Bookmark, 
  Image, 
  Mic, 
  FileCode, 
  Clock, 
  Star, 
  Archive, 
  Trash2, 
  Settings, 
  Search,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';

export function Sidebar() {
  const pathname = usePathname();
  const { data } = useMemoryStore();
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, count: null },
    { label: 'Notes', href: '/notes', icon: FileText, count: data.notes?.filter((n) => !n.isTrash && !n.isArchived).length },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare, count: data.tasks?.filter((t) => !t.isTrash && !t.isArchived && t.status !== 'completed').length },
    { label: 'Journal', href: '/journal', icon: BookOpen, count: data.journals?.length },
    { label: 'Calendar', href: '/calendar', icon: CalendarIcon, count: null },
    { label: 'Knowledge Graph', href: '/graph', icon: Network, count: null },
    { label: 'Mind Maps', href: '/mindmap', icon: GitFork, count: null },
    { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark, count: data.bookmarks?.filter((b) => !b.isTrash).length },
    { label: 'Collections', href: '/collections', icon: Folder, count: data.collections?.length },
    { label: 'Media Gallery', href: '/gallery', icon: Image, count: data.mediaItems?.length },
    { label: 'Voice Notes', href: '/voicenotes', icon: Mic, count: data.voiceNotes?.length },
    { label: 'PDF Library', href: '/pdf', icon: FileCode, count: data.pdfDocs?.length },
    { label: 'Timeline', href: '/timeline', icon: Clock, count: null },
  ];

  const secondaryNav = [
    { label: 'Favorites', href: '/favorites', icon: Star, count: data.notes?.filter((n) => n.isFavorite).length },
    { label: 'Archive', href: '/archive', icon: Archive, count: data.notes?.filter((n) => n.isArchived).length },
    { label: 'Trash', href: '/trash', icon: Trash2, count: data.notes?.filter((n) => n.isTrash).length },
    { label: 'Global Search', href: '/search', icon: Search, count: null },
    { label: 'Settings', href: '/settings', icon: Settings, count: null },
    { label: 'About App', href: '/about', icon: Info, count: null },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-61px)] sticky top-[61px] bg-zinc-950 border-r border-zinc-800/80 p-3 space-y-4 overflow-y-auto text-zinc-300 select-none">
      {/* Primary Nav Menu */}
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-zinc-500 uppercase px-3 py-1 tracking-wider">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 shadow-subtle'
                  : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== null && item.count !== undefined && item.count > 0 && (
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono ${
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-900 text-zinc-500'
                }`}>
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Expandable Collections Tree */}
      <div className="pt-2 border-t border-zinc-900 space-y-1">
        <button
          onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
          className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-300"
        >
          <span>Collections</span>
          {isCollectionsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {isCollectionsOpen && (
          <div className="pl-2 space-y-1">
            {data.collections?.map((col) => (
              <Link
                key={col.id}
                href="/collections"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: col.color || '#6366F1' }}
                />
                <span className="truncate">{col.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Secondary Nav Menu */}
      <div className="pt-2 border-t border-zinc-900 space-y-1">
        <div className="text-[11px] font-semibold text-zinc-500 uppercase px-3 py-1 tracking-wider">
          System Vault
        </div>
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-300'
                  : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== null && item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full font-mono bg-zinc-900 text-zinc-500">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Storage Footer */}
      <div className="mt-auto pt-4 border-t border-zinc-900">
        <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="text-[11px] leading-snug">
            <div className="font-semibold text-zinc-200">100% Offline Vault</div>
            <div className="text-zinc-500">Stored in browser LocalStorage</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
