import { supabase } from '../lib/supabase/client';
import { KnowledgeNodeRow, KnowledgeEdgeRow } from '../lib/supabase/types';
import { GraphNode, GraphEdge } from '../types/memory';

export function mapNodeRowToNode(row: KnowledgeNodeRow): GraphNode {
  return {
    id: row.id,
    label: row.label,
    type: row.type,
    color: row.color || '#6366F1',
    val: row.val || 1,
    data: (row.data as Record<string, any>) || {},
  };
}

export function mapEdgeRowToEdge(row: KnowledgeEdgeRow): GraphEdge {
  return {
    id: row.id,
    source: row.source,
    target: row.target,
    label: row.label || undefined,
  };
}

export const graphService = {
  async fetchGraph(userId: string): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const [nodesRes, edgesRes] = await Promise.all([
      (supabase.from('knowledge_nodes') as any).select('*').eq('user_id', userId),
      (supabase.from('knowledge_edges') as any).select('*').eq('user_id', userId),
    ]);

    const nodes = (nodesRes.data || []).map(mapNodeRowToNode);
    const edges = (edgesRes.data || []).map(mapEdgeRowToEdge);

    return { nodes, edges };
  },

  async addNode(userId: string, node: Omit<GraphNode, 'id'>): Promise<GraphNode> {
    const { data, error } = await (supabase.from('knowledge_nodes') as any)
      .insert({
        user_id: userId,
        label: node.label,
        type: node.type,
        color: node.color || '#6366F1',
        val: node.val || 1,
        data: (node.data as any) || {},
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapNodeRowToNode(data);
  },

  async addEdge(userId: string, edge: Omit<GraphEdge, 'id'>): Promise<GraphEdge> {
    const { data, error } = await (supabase.from('knowledge_edges') as any)
      .insert({
        user_id: userId,
        source: edge.source,
        target: edge.target,
        label: edge.label || null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapEdgeRowToEdge(data);
  },

  async deleteNode(userId: string, id: string): Promise<void> {
    await (supabase.from('knowledge_nodes') as any).delete().eq('id', id).eq('user_id', userId);
  },
};
