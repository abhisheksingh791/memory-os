'use client';

import React, { useState } from 'react';
import { FileCode, Highlighter, Plus, FileText, Search, Bookmark } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';

export default function PDFLibraryPage() {
  const { data } = useMemoryStore();
  const [selectedPdfId, setSelectedPdfId] = useState<string>('pdf-1');

  const pdfDocs = data.pdfDocs || [];
  const activePdf = pdfDocs.find((p) => p.id === selectedPdfId) || pdfDocs[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">PDF Library</h1>
          <p className="text-xs text-zinc-400">Document reader, annotations, highlight lists & tags</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PDF Documents Selector Column */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-zinc-300">Documents ({pdfDocs.length})</h3>
          {pdfDocs.map((pdf) => (
            <div
              key={pdf.id}
              onClick={() => setSelectedPdfId(pdf.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPdfId === pdf.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-glow'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs truncate">{pdf.title}</h4>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {pdf.size} • {pdf.totalPages} pages
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected PDF Viewer & Highlights Inspector */}
        {activePdf && (
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-glass space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <FileCode className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-base text-zinc-100">{activePdf.title}</h3>
                  <p className="text-xs text-zinc-400">
                    {activePdf.totalPages} pages • {activePdf.highlights?.length || 0} highlights
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                {activePdf.tags?.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Document Reader Mockup */}
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 text-xs leading-relaxed text-zinc-300 font-mono">
              <div className="text-zinc-500 uppercase tracking-widest text-[10px]">
                --- PAGE 3 PREVIEW ---
              </div>
              <p>
                Local-first software represents a fundamental paradigm shift in cognitive tool design.
                By keeping data in browser storage as the primary authority, user applications remain fast,
                durable, and resilient to cloud server outages.
              </p>
            </div>

            {/* Highlights List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                Annotations & Highlights
              </h4>
              {activePdf.highlights?.map((hl) => (
                <div key={hl.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                    <span className="font-semibold text-amber-400">Page {hl.page}</span>
                    <span className="font-mono">{hl.createdAt?.split('T')[0]}</span>
                  </div>
                  <blockquote className="p-2.5 rounded-xl bg-amber-500/10 border-l-2 border-amber-500 text-amber-200 italic">
                    "{hl.highlightText}"
                  </blockquote>
                  {hl.note && <p className="text-zinc-400 font-normal">Note: {hl.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
