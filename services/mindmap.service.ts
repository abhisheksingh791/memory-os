import { supabase } from '../lib/supabase/client';
import { MindMapNodeRow, MindMapEdgeRow } from '../lib/supabase/types';
import { MindMapNode, MindMapEdge } from '../types/memory';

export function mapNodeRowToMindMapNode(row: MindMapNodeRow): MindMapNode {
  return {
    id: row.id,
    type: row.type || 'default',
    position: { x: row.position_x, y: row.position_y },
    data: (row.data as any) || { label: 'Node' },
    parentId: row.parent_id || undefined,
  };
}

export function mapEdgeRowToMindMapEdge(row: MindMapEdgeRow): MindMapEdge {
  return {
    id: row.id,
    source: row.source,
    target: row.target,
    animated: row.animated,
  };
}

export const mindmapService = {
  async fetchMindMap(userId: string): Promise<{ nodes: MindMapNode[]; edges: MindMapEdge[] }> {
    const [nodesRes, edgesRes] = await Promise.all([
      (supabase.from('mind_map_nodes') as any).select('*').eq('user_id', userId),
      (supabase.from('mind_map_edges') as any).select('*').eq('user_id', userId),
    ]);

    const nodes = (nodesRes.data || []).map(mapNodeRowToMindMapNode);
    const edges = (edgesRes.data || []).map(mapEdgeRowToMindMapEdge);

    return { nodes, edges };
  },

  async addNode(userId: string, node: Omit<MindMapNode, 'id'>): Promise<MindMapNode> {
    const { data, error } = await (supabase.from('mind_map_nodes') as any)
      .insert({
        user_id: userId,
        type: node.type || 'default',
        position_x: node.position.x,
        position_y: node.position.y,
        data: node.data as any,
        parent_id: node.parentId || null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapNodeRowToMindMapNode(data);
  },

  async updateNode(userId: string, id: string, patch: Partial<MindMapNode>): Promise<MindMapNode | null> {
    const updates: Partial<MindMapNodeRow> = {};
    if (patch.position) {
      updates.position_x = patch.position.x;
      updates.position_y = patch.position.y;
    }
    if (patch.data) updates.data = patch.data as any;

    const { data, error } = await (supabase.from('mind_map_nodes') as any)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) return null;
    return mapNodeRowToMindMapNode(data);
  },

  async addEdge(userId: string, edge: MindMapEdge): Promise<MindMapEdge> {
    const { data, error } = await (supabase.from('mind_map_edges') as any)
      .insert({
        user_id: userId,
        source: edge.source,
        target: edge.target,
        animated: edge.animated ?? true,
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapEdgeRowToMindMapEdge(data);
  },
};
