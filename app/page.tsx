'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Brain, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Network, 
  GitFork, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Download, 
  ChevronDown, 
  Star,
  CheckCircle2,
  Lock,
  WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'notes' | 'graph' | 'mindmap'>('notes');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { label: 'Sub-Millisecond Search', value: '< 1ms', sub: 'Fuse.js client engine' },
    { label: 'Offline Resilience', value: '100%', sub: 'No cloud required' },
    { label: 'Data Ownership', value: 'Local First', sub: 'JSON & local storage' },
    { label: 'Platform Support', value: 'PWA Mobile', sub: 'iOS, Android & Desktop' },
  ];

  const features = [
    {
      title: 'Spatial Markdown Notes',
      desc: 'Rich text and markdown writing canvas with tags, folder collections, pin state, and color labels.',
      icon: FileText,
      color: '#6366F1',
    },
    {
      title: 'Knowledge Graph Engine',
      desc: 'Visualize dynamic connections between concepts, notes, collections, and action items in real time.',
      icon: Network,
      color: '#EC4899',
    },
    {
      title: 'Interactive Mind Maps',
      desc: 'Brainstorm complex architectures, project trees, and mental models with collapsible branch nodes.',
      icon: GitFork,
      color: '#10B981',
    },
    {
      title: 'Daily Journal & Mood Tracker',
      desc: 'Record daily reflection logs, weather context, focus prompts, and personal growth metrics.',
      icon: BookOpen,
      color: '#F59E0B',
    },
    {
      title: 'Raycast Quick Capture (Cmd+K)',
      desc: 'Instantly capture ideas, tasks, voice clips, or web bookmarks from anywhere with zero friction.',
      icon: Zap,
      color: '#8B5CF6',
    },
    {
      title: 'Local-First Data Sovereignty',
      desc: '100% stored in browser LocalStorage. One-click JSON backup, restore, and zero cloud tracking.',
      icon: ShieldCheck,
      color: '#3B82F6',
    },
  ];

  const faqs = [
    {
      q: 'Does Memory OS work completely offline?',
      a: 'Yes, absolutely. Memory OS is designed from the ground up as a Local-First Progressive Web App (PWA). All notes, tasks, journals, bookmarks, and mind maps are stored directly in your browser LocalStorage. Zero network connection is needed.',
    },
    {
      q: 'How do I backup or transfer my data?',
      a: 'You can export a full stringified JSON backup of your database anytime from the Settings page or Command Palette (Cmd+K). You can restore or import this file on any device instantaneously.',
    },
    {
      q: 'Can I install Memory OS as a native app on iPhone or Android?',
      a: 'Yes! Simply open Memory OS in Safari on iOS or Chrome on Android and tap "Add to Home Screen" or click the "Install App" button inside the navigation bar.',
    },
    {
      q: 'Are my notes kept private and secure?',
      a: 'Your data never leaves your device. We do not use remote backend servers, database vendors, or external API trackers. You have complete data sovereignty.',
    },
  ];

  return (
    <div className="space-y-24 pt-4">
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center text-center space-y-8 pt-12 pb-8">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-glow"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Local-First PWA • Apple & Vercel Aesthetic</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Your Mind</span>
          </h1>
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Capture Everything. Organize Everything. Remember Forever.
            <br className="hidden sm:inline" />
            Zero Latency. 100% Offline Local-First Vault.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-glow hover:scale-105 transition-all text-sm"
          >
            <span>Start Writing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 px-7 py-3.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-semibold rounded-2xl transition-all text-sm"
          >
            Explore Features
          </a>
        </motion.div>

        {/* Floating Feature Cards Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-5xl mt-8 p-3 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-glass backdrop-blur-2xl overflow-hidden"
        >
          <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-900 space-y-4">
            {/* Interactive Preview Tabs */}
            <div className="flex justify-center gap-2 border-b border-zinc-800 pb-3">
              {[
                { id: 'notes', label: 'Notes Canvas', icon: FileText },
                { id: 'graph', label: 'Knowledge Graph', icon: Network },
                { id: 'mindmap', label: 'Mind Maps', icon: GitFork },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Visual Mockup */}
            <div className="p-6 min-h-[250px] flex items-center justify-center">
              {activeTab === 'notes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="text-xs font-mono text-indigo-400"># architecture #pwa</div>
                    <div className="font-bold text-sm text-zinc-100">Local-First Engine Specification</div>
                    <p className="text-xs text-zinc-400">Sub-millisecond query search using Fuse.js index stored in browser memory...</p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="text-xs font-mono text-pink-400"># design #glassmorphism</div>
                    <div className="font-bold text-sm text-zinc-100">Apple & Vercel Aesthetic Blueprint</div>
                    <p className="text-xs text-zinc-400">Spatial depth, soft glowing shadows, Geist font hierarchy, and Framer Motion micro-interactions...</p>
                  </div>
                </div>
              )}

              {activeTab === 'graph' && (
                <div className="w-full flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-semibold text-xs">
                      🧠 Memory OS
                    </div>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500" />
                    <div className="p-3 rounded-2xl bg-pink-600/20 border border-pink-500/40 text-pink-300 font-semibold text-xs">
                      ⚡ LocalStorage Vault
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500">Linked Graph Nodes Visualizer</div>
                </div>
              )}

              {activeTab === 'mindmap' && (
                <div className="w-full flex justify-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    Core Brain
                  </div>
                  <div className="p-3 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                    Daily Reflection
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
                    Tasks Kanban
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-1 shadow-subtle"
          >
            <div className="text-3xl lg:text-4xl font-extrabold text-zinc-100 font-mono">
              {st.value}
            </div>
            <div className="text-xs font-semibold text-indigo-400">{st.label}</div>
            <div className="text-[11px] text-zinc-500">{st.sub}</div>
          </div>
        ))}
      </section>

      {/* FEATURE GRID SECTION */}
      <section id="features" className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built for Power Thinkers & Creators
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Combines the speed of Raycast, the visual depth of Obsidian, and the elegance of Notion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 shadow-subtle space-y-4 group transition-all"
              >
                <div
                  className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-subtle"
                  style={{
                    backgroundColor: `${f.color}15`,
                    borderColor: `${f.color}30`,
                    color: f.color,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-zinc-400">Everything you need to know about Memory OS local architecture</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-900/80 border border-zinc-800/80 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-zinc-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-zinc-300">Memory OS</span>
          <span>© 2026. The Operating System for Your Mind.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-zinc-300">Dashboard</Link>
          <Link href="/notes" className="hover:text-zinc-300">Notes</Link>
          <Link href="/graph" className="hover:text-zinc-300">Graph</Link>
          <Link href="/settings" className="hover:text-zinc-300">Settings</Link>
          <Link href="/about" className="hover:text-zinc-300">About</Link>
        </div>
      </footer>
    </div>
  );
}
