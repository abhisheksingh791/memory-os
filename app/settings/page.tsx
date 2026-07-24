'use client';

import React, { useRef, useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Database,
  Sparkles,
  Check
} from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { exportJSON, importJSON, resetStorage, data, updateSettings } = useMemoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importJSON(file);
      if (success) {
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(''), 4000);
      } else {
        setImportStatus('Failed to parse valid backup JSON file.');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">System Settings</h1>
        <p className="text-xs text-zinc-400">LocalStorage database administration, theme preferences & backup management</p>
      </div>

      {/* Theme Preferences */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
          <span>Appearance & Design Tokens</span>
        </h3>
        <p className="text-xs text-zinc-400">Switch between Dark Mode (#09090B Obsidian) and Light Mode</p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 p-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-glow'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Mode (#09090B)</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`flex-1 p-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-glow'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light Mode</span>
          </button>
        </div>
      </div>

      {/* Local Data Management */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-100">LocalStorage Database Administration</h3>
            <p className="text-xs text-zinc-400">100% Client-Side Local Storage Sovereignty</p>
          </div>
        </div>

        {/* Database Status Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-lg font-bold font-mono text-indigo-400">{data.notes?.length || 0}</div>
            <div className="text-[10px] text-zinc-500">Notes</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-lg font-bold font-mono text-emerald-400">{data.tasks?.length || 0}</div>
            <div className="text-[10px] text-zinc-500">Tasks</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-lg font-bold font-mono text-pink-400">{data.journals?.length || 0}</div>
            <div className="text-[10px] text-zinc-500">Journals</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-lg font-bold font-mono text-amber-400">{data.bookmarks?.length || 0}</div>
            <div className="text-[10px] text-zinc-500">Bookmarks</div>
          </div>
        </div>

        {/* Export & Import Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={exportJSON}
            className="flex items-center justify-center gap-2 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-xs shadow-glow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Full JSON Backup</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-2xl font-semibold text-xs transition-all"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import / Restore JSON Backup</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Clear Storage */}
        <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs text-zinc-200">Reset Local Storage</h4>
            <p className="text-[11px] text-zinc-500">Reset database back to initial seed data state</p>
          </div>
          <button
            onClick={() => resetStorage(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/80 rounded-xl text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
}
