'use client';

import React, { useState } from 'react';
import { useMemoryStore } from '../store/useMemoryStore';
import { GitFork, Plus, Trash2, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';

export function MindMapCanvas() {
  const { data, addMindMapNode, updateMindMapNode } = useMemoryStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('mm-root');
  const [newNodeText, setNewNodeText] = useState('');

  const nodes = data.mindMapNodes || [];
  const edges = data.mindMapEdges || [];

  const handleAddChild = () => {
    if (!newNodeText.trim()) return;
    const parent = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
    const newX = (parent?.position.x || 250) + (Math.random() * 160 - 80);
    const newY = (parent?.position.y || 150) + 120;

    const created = addMindMapNode({
      type: 'default',
      position: { x: newX, y: newY },
      data: { label: newNodeText, color: '#EC4899' },
      parentId: selectedNodeId,
    });

    setNewNodeText('');
  };

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-glass flex flex-col space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-zinc-100">Interactive Mind Map Canvas</h3>
            <p className="text-xs text-zinc-400">Expand ideas recursively with branch nodes</p>
          </div>
        </div>

        {/* Add Node Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="New child node label..."
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 w-48"
          />
          <button
            onClick={handleAddChild}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold rounded-xl shadow-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Branch
          </button>
        </div>
      </div>

      {/* SVG Canvas Tree */}
      <div className="w-full h-[450px] bg-zinc-950/80 border border-zinc-900 rounded-2xl overflow-hidden relative">
        <svg className="w-full h-full">
          {/* Render Connections */}
          {nodes.map((node) => {
            if (!node.parentId) return null;
            const parentNode = nodes.find((n) => n.id === node.parentId);
            if (!parentNode) return null;

            return (
              <path
                key={`edge-${node.id}`}
                d={`M ${parentNode.position.x + 80} ${parentNode.position.y + 25} C ${parentNode.position.x + 80} ${(parentNode.position.y + node.position.y) / 2}, ${node.position.x + 80} ${(parentNode.position.y + node.position.y) / 2}, ${node.position.x + 80} ${node.position.y}`}
                fill="none"
                stroke="#6366F1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Render Mind Map Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <foreignObject
                key={node.id}
                x={node.position.x}
                y={node.position.y}
                width="180"
                height="55"
              >
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full h-full p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-center text-center shadow-subtle ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-glow ring-2 ring-indigo-500/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'
                  }`}
                  style={{
                    borderColor: isSelected ? '#818CF8' : node.data.color || '#6366F1',
                  }}
                >
                  <span className="text-xs font-semibold truncate">{node.data.label}</span>
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
