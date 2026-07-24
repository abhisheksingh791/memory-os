'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  CheckSquare, 
  BookOpen, 
  Search 
} from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';

export function BottomNav() {
  const pathname = usePathname();
  const { setQuickCaptureOpen } = useMemoryStore();

  const mobileNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Notes', href: '/notes', icon: FileText },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Journal', href: '/journal', icon: BookOpen },
    { label: 'Search', href: '/search', icon: Search },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 px-4 py-2 flex items-center justify-around safe-area-pb">
      {mobileNavItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-all ${
              isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Center Floating Action Button */}
      <button
        onClick={() => setQuickCaptureOpen(true)}
        className="-mt-5 w-12 h-12 rounded-full bg-indigo-600 border-2 border-zinc-950 text-white flex items-center justify-center shadow-glow active:scale-95 transition-transform"
        aria-label="Quick Capture"
      >
        <Plus className="w-6 h-6" />
      </button>

      {mobileNavItems.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-all ${
              isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
