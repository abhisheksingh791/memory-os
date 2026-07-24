'use client';

import React, { useState } from 'react';
import { useMemoryStore } from '../store/useMemoryStore';
import { ZoomIn, ZoomOut, RotateCcw, Network, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function KnowledgeGraphViewer() {
  const { data } = useMemoryStore();
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const nodes = data.graphNodes || [];
  const edges = data.graphEdges || [];

  // Dynamic layout calculation for node graph
  const radius = 180;
  const centerX = 350;
  const centerY = 250;

  const nodePositions = nodes.map((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { ...node, x, y };
  });

  const filteredNodes = searchQuery.trim()
    ? nodePositions.filter((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : nodePositions;

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-glass flex flex-col space-y-4 relative overflow-hidden">
      {/* Graph Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-zinc-100">Knowledge Graph Engine</h3>
            <p className="text-xs text-zinc-400">Interactive node network across notes, collections, & tasks</p>
          </div>
        </div>

        {/* Controls & Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300">
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent focus:outline-none w-32 md:w-48 placeholder-zinc-500 text-xs"
            />
          </div>

          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full h-[450px] bg-zinc-950/60 border border-zinc-900 rounded-2xl overflow-hidden flex items-center justify-center">
        <motion.svg
          animate={{ scale: zoom }}
          transition={{ duration: 0.2 }}
          viewBox="0 0 700 500"
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Render Edges */}
          {edges.map((edge) => {
            const sourceNode = nodePositions.find((n) => n.id === edge.source);
            const targetNode = nodePositions.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              selectedNode === edge.source || selectedNode === edge.target;

            return (
              <g key={edge.id}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#818CF8' : 'url(#edgeGrad)'}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  strokeDasharray={isHighlighted ? '0' : '4 4'}
                />
                {edge.label && (
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2 - 6}
                    fill="#9CA3AF"
                    fontSize="10"
                    textAnchor="middle"
                    className="font-mono select-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Center Anchor */}
          <circle cx={centerX} cy={centerY} r="18" fill="#6366F1" fillOpacity="0.2" stroke="#6366F1" strokeWidth="2" />
          <circle cx={centerX} cy={centerY} r="6" fill="#818CF8" />

          {/* Render Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className="cursor-pointer group"
              >
                {/* Outer Glow Circle */}
                <circle
                  r={node.val + (isSelected ? 10 : 4)}
                  fill={node.color}
                  fillOpacity={isSelected ? 0.35 : 0.15}
                  stroke={node.color}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all duration-300"
                />

                {/* Inner Core */}
                <circle r={node.val / 2.5} fill={node.color} />

                {/* Node Text Label */}
                <text
                  y={node.val + 16}
                  fill={isSelected ? '#FFFFFF' : '#D1D5DB'}
                  fontSize={isSelected ? '12' : '11'}
                  fontWeight={isSelected ? '700' : '500'}
                  textAnchor="middle"
                  className="select-none font-sans"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </motion.svg>

        {/* Selected Node Details Popup */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 p-3 bg-zinc-900/90 border border-indigo-500/40 rounded-xl shadow-glow text-xs text-zinc-200">
            <div className="font-semibold text-indigo-300">
              {nodePositions.find((n) => n.id === selectedNode)?.label}
            </div>
            <div className="text-[10px] text-zinc-400">
              Connected links: {edges.filter((e) => e.source === selectedNode || e.target === selectedNode).length} edges
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
