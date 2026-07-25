import { supabase } from '../lib/supabase/client';
import { BookmarkRow } from '../lib/supabase/types';
import { Bookmark } from '../types/memory';
import { mutationService } from '../lib/supabase/mutations';

export function mapBookmarkRowToBookmark(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    description: row.description || undefined,
    favicon: row.favicon || undefined,
    tags: row.tags || [],
    collectionId: row.collection_id || undefined,
    isFavorite: row.is_favorite,
    isArchived: row.is_archived,
    isTrash: row.is_trash,
    createdAt: row.created_at,
  };
}

export const bookmarksService = {
  async fetchAll(userId: string): Promise<Bookmark[]> {
    const { data, error } = await (supabase.from('bookmarks') as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapBookmarkRowToBookmark);
  },

  async create(userId: string, bm: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark> {
    const { data, error } = await (supabase.from('bookmarks') as any)
      .insert({
        user_id: userId,
        title: bm.title,
        url: bm.url,
        description: bm.description || null,
        favicon: bm.favicon || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bm.url)}&sz=64`,
        tags: bm.tags || [],
        collection_id: bm.collectionId || null,
        is_favorite: bm.isFavorite || false,
        is_archived: bm.isArchived || false,
        is_trash: bm.isTrash || false,
      })
      .select('*')
      .single();

    if (error) throw error;
    await mutationService.logActivity(userId, 'create', 'bookmarks', data.id, { title: data.title });
    return mapBookmarkRowToBookmark(data);
  },

  async update(userId: string, id: string, patch: Partial<Bookmark>): Promise<Bookmark | null> {
    const updates: Partial<BookmarkRow> = {};
    if (patch.title !== undefined) updates.title = patch.title;
    if (patch.url !== undefined) updates.url = patch.url;
    if (patch.description !== undefined) updates.description = patch.description;
    if (patch.favicon !== undefined) updates.favicon = patch.favicon;
    if (patch.tags !== undefined) updates.tags = patch.tags;
    if (patch.collectionId !== undefined) updates.collection_id = patch.collectionId || null;
    if (patch.isFavorite !== undefined) updates.is_favorite = patch.isFavorite;
    if (patch.isArchived !== undefined) updates.is_archived = patch.isArchived;
    if (patch.isTrash !== undefined) updates.is_trash = patch.isTrash;

    const { data, error } = await (supabase.from('bookmarks') as any)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) return null;
    return mapBookmarkRowToBookmark(data);
  },

  async delete(userId: string, id: string, permanent: boolean = false, title: string = 'Bookmark'): Promise<void> {
    if (permanent) {
      await mutationService.purgeItem('bookmarks', id, userId);
    } else {
      await mutationService.moveToTrash('bookmarks', id, userId, title);
    }
  },
};
