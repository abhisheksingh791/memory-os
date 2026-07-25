import { supabase } from '../lib/supabase/client';
import { NoteRow } from '../lib/supabase/types';
import { Note } from '../types/memory';
import { mutationService } from '../lib/supabase/mutations';

export function mapNoteRowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    type: row.type,
    tags: row.tags || [],
    collectionId: row.collection_id || undefined,
    color: row.color || '#6366F1',
    isFavorite: row.is_favorite,
    isArchived: row.is_archived,
    isPinned: row.is_pinned,
    isTrash: row.is_trash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const notesService = {
  async fetchAll(userId: string): Promise<Note[]> {
    const { data, error } = await (supabase.from('notes') as any)
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Error fetching notes from Supabase:', error);
      return [];
    }
    return (data || []).map(mapNoteRowToNote);
  },

  async create(userId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const { data, error } = await (supabase.from('notes') as any)
      .insert({
        user_id: userId,
        title: note.title,
        content: note.content || '',
        type: note.type || 'rich',
        tags: note.tags || [],
        collection_id: note.collectionId || null,
        color: note.color || '#6366F1',
        is_favorite: note.isFavorite || false,
        is_archived: note.isArchived || false,
        is_pinned: note.isPinned || false,
        is_trash: note.isTrash || false,
      })
      .select('*')
      .single();

    if (error) throw error;
    await mutationService.logActivity(userId, 'create', 'notes', data.id, { title: data.title });
    return mapNoteRowToNote(data);
  },

  async update(userId: string, id: string, patch: Partial<Note>): Promise<Note | null> {
    const updates: Partial<NoteRow> = {};
    if (patch.title !== undefined) updates.title = patch.title;
    if (patch.content !== undefined) updates.content = patch.content;
    if (patch.type !== undefined) updates.type = patch.type;
    if (patch.tags !== undefined) updates.tags = patch.tags;
    if (patch.collectionId !== undefined) updates.collection_id = patch.collectionId || null;
    if (patch.color !== undefined) updates.color = patch.color;
    if (patch.isFavorite !== undefined) updates.is_favorite = patch.isFavorite;
    if (patch.isArchived !== undefined) updates.is_archived = patch.isArchived;
    if (patch.isPinned !== undefined) updates.is_pinned = patch.isPinned;
    if (patch.isTrash !== undefined) updates.is_trash = patch.isTrash;

    const { data, error } = await (supabase.from('notes') as any)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      console.warn('Error updating note:', error);
      return null;
    }
    return mapNoteRowToNote(data);
  },

  async delete(userId: string, id: string, permanent: boolean = false, title: string = 'Note'): Promise<void> {
    if (permanent) {
      await mutationService.purgeItem('notes', id, userId);
    } else {
      await mutationService.moveToTrash('notes', id, userId, title);
    }
  },

  async duplicate(userId: string, id: string): Promise<Note> {
    const row = await mutationService.duplicateNote(id, userId);
    return mapNoteRowToNote(row);
  },

  async share(userId: string, id: string) {
    return await mutationService.createSharedLink(userId, 'note', id);
  },
};
