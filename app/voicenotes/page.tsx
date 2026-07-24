'use client';

import React, { useState } from 'react';
import { Mic, Play, Pause, Trash2, Plus, Sparkles, Volume2 } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';

export default function VoiceNotesPage() {
  const { data, addVoiceNote, deleteVoiceNote } = useMemoryStore();
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordTranscript, setRecordTranscript] = useState('');

  const voiceNotes = data.voiceNotes || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordTitle.trim()) return;

    addVoiceNote({
      title: recordTitle,
      duration: Math.floor(Math.random() * 90) + 30,
      transcript: recordTranscript || 'Audio dictation captured via Voice Engine.',
      tags: ['audio', 'dictation'],
      isFavorite: false,
    });

    setRecordTitle('');
    setRecordTranscript('');
    setIsRecording(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Voice Notes UI</h1>
          <p className="text-xs text-zinc-400">Audio dictation, automatic speech transcription & sound archives</p>
        </div>

        <button
          onClick={() => setIsRecording(!isRecording)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-glow transition-all"
        >
          <Mic className="w-4 h-4" />
          <span>Record Audio Note</span>
        </button>
      </div>

      {/* Record Modal Simulation */}
      {isRecording && (
        <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
            <h3 className="font-semibold text-sm text-zinc-200">Recording Voice Note...</h3>
          </div>

          <input
            type="text"
            placeholder="Audio Title..."
            value={recordTitle}
            onChange={(e) => setRecordTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            autoFocus
          />

          <textarea
            rows={3}
            placeholder="Transcribed text preview..."
            value={recordTranscript}
            onChange={(e) => setRecordTranscript(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRecording(false)}
              className="px-4 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-1.5 text-xs bg-indigo-600 text-white rounded-xl font-semibold">
              Save Recording
            </button>
          </div>
        </form>
      )}

      {/* Voice Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {voiceNotes.map((vn) => {
          const playing = isPlaying === vn.id;
          return (
            <div
              key={vn.id}
              className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(playing ? null : vn.id)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      playing ? 'bg-indigo-600 text-white shadow-glow' : 'bg-zinc-950 text-indigo-400 border border-zinc-800'
                    }`}
                  >
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-100">{vn.title}</h4>
                    <span className="text-xs text-zinc-500 font-mono">{vn.duration}s duration</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteVoiceNote(vn.id)}
                  className="p-1 text-zinc-600 hover:text-red-400 rounded"
                  title="Delete Voice Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Animated Waveform Visualization */}
              <div className="flex items-center justify-between gap-1 h-8 px-2 bg-zinc-950 border border-zinc-900 rounded-xl">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      playing ? 'bg-indigo-500 animate-pulse' : 'bg-zinc-800'
                    }`}
                    style={{
                      height: playing ? `${Math.floor(Math.random() * 24) + 6}px` : '10px',
                    }}
                  />
                ))}
              </div>

              {/* Transcript */}
              <p className="text-xs text-zinc-400 italic bg-zinc-950/40 p-3 rounded-xl border border-zinc-900">
                "{vn.transcript}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
