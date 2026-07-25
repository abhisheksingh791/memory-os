import { supabase } from '../lib/supabase/client';
import { JournalRow } from '../lib/supabase/types';
import { JournalEntry } from '../types/memory';
import { mutationService } from '../lib/supabase/mutations';

export function mapJournalRowToEntry(row: JournalRow): JournalEntry {
  return {
    id: row.id,
    date: row.date,
    content: row.content,
    mood: row.mood,
    weather: row.weather || undefined,
    tags: row.tags || [],
    prompt: row.prompt || undefined,
    isFavorite: row.is_favorite,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const journalService = {
  async fetchAll(userId: string): Promise<JournalEntry[]> {
    const { data, error } = await (supabase.from('journal_entries') as any)
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) return [];
    return (data || []).map(mapJournalRowToEntry);
  },

  async create(userId: string, entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
    const { data, error } = await (supabase.from('journal_entries') as any)
      .insert({
        user_id: userId,
        date: entry.date,
        content: entry.content || '',
        mood: entry.mood || 'neutral',
        weather: entry.weather || null,
        tags: entry.tags || [],
        prompt: entry.prompt || null,
        is_favorite: entry.isFavorite || false,
      })
      .select('*')
      .single();

    if (error) throw error;
    await mutationService.logActivity(userId, 'create', 'journal_entries', data.id, { date: data.date });
    return mapJournalRowToEntry(data);
  },

  async update(userId: string, id: string, patch: Partial<JournalEntry>): Promise<JournalEntry | null> {
    const updates: Partial<JournalRow> = {};
    if (patch.date !== undefined) updates.date = patch.date;
    if (patch.content !== undefined) updates.content = patch.content;
    if (patch.mood !== undefined) updates.mood = patch.mood;
    if (patch.weather !== undefined) updates.weather = patch.weather;
    if (patch.tags !== undefined) updates.tags = patch.tags;
    if (patch.prompt !== undefined) updates.prompt = patch.prompt;
    if (patch.isFavorite !== undefined) updates.is_favorite = patch.isFavorite;

    const { data, error } = await (supabase.from('journal_entries') as any)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) return null;
    return mapJournalRowToEntry(data);
  },

  async delete(userId: string, id: string): Promise<void> {
    await mutationService.purgeItem('journal_entries', id, userId);
  },
};
