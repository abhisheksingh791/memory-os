'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Maximize2, X, Sparkles } from 'lucide-react';
import { useMemoryStore } from '../../store/useMemoryStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryPage() {
  const { data, addMediaItem, deleteMediaItem } = useMemoryStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const mediaItems = data.mediaItems || [];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    addMediaItem({
      title: newTitle || 'Media Item',
      url: newUrl,
      aspectRatio: '16/9',
      tags: ['gallery', 'design'],
      isFavorite: false,
    });

    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Media Gallery</h1>
          <p className="text-xs text-zinc-400">Visual memory vault, design assets & UI mockups</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </div>

      {/* Add Media Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <h3 className="font-semibold text-sm text-zinc-200">Add Image / Visual Asset</h3>
          <input
            type="url"
            placeholder="Image URL (https://...)..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
          <input
            type="text"
            placeholder="Asset Title / Caption..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-1.5 text-xs bg-indigo-600 text-white rounded-xl font-semibold">
              Save Asset
            </button>
          </div>
        </form>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-subtle flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden bg-zinc-950">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedImage(item.url)}
                  className="p-2 rounded-xl bg-black/60 text-white hover:bg-indigo-600 backdrop-blur-md transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMediaItem(item.id)}
                  className="p-2 rounded-xl bg-black/60 text-white hover:bg-red-600 backdrop-blur-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <h4 className="font-semibold text-xs text-zinc-200 truncate">{item.title}</h4>
              <div className="flex gap-1">
                {item.tags?.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] text-zinc-500 font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Expanded Lightbox"
              className="max-w-full max-h-[90vh] rounded-2xl shadow-glass object-contain"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
