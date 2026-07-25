import { supabase } from './client';

export const queryService = {
  // Global Search across Notes, Tasks, Bookmarks, Journal
  async globalSearch(searchTerm: string, userId: string) {
    if (!searchTerm.trim()) {
      return { notes: [], tasks: [], bookmarks: [], journal: [] };
    }

    const pattern = `%${searchTerm.trim()}%`;

    const [notesRes, tasksRes, bookmarksRes, journalRes] = await Promise.all([
      (supabase.from('notes') as any)
        .select('*')
        .eq('user_id', userId)
        .eq('is_trash', false)
        .or(`title.ilike.${pattern},content.ilike.${pattern}`),
      (supabase.from('tasks') as any)
        .select('*')
        .eq('user_id', userId)
        .eq('is_trash', false)
        .or(`title.ilike.${pattern},description.ilike.${pattern}`),
      (supabase.from('bookmarks') as any)
        .select('*')
        .eq('user_id', userId)
        .eq('is_trash', false)
        .or(`title.ilike.${pattern},url.ilike.${pattern},description.ilike.${pattern}`),
      (supabase.from('journal_entries') as any)
        .select('*')
        .eq('user_id', userId)
        .or(`content.ilike.${pattern},prompt.ilike.${pattern}`),
    ]);

    return {
      notes: notesRes.data || [],
      tasks: tasksRes.data || [],
      bookmarks: bookmarksRes.data || [],
      journal: journalRes.data || [],
    };
  },

  // PostgreSQL Full Text Search for Notes using tsvector GIN index
  async searchNotesFullText(queryText: string, userId: string) {
    const { data, error } = await (supabase.from('notes') as any)
      .select('*')
      .eq('user_id', userId)
      .eq('is_trash', false)
      .textSearch('fts', queryText, {
        config: 'english',
        type: 'plain',
      });

    if (error) {
      console.warn('FTS error fallback to ilike:', error);
      const { data: fallback } = await (supabase.from('notes') as any)
        .select('*')
        .eq('user_id', userId)
        .eq('is_trash', false)
        .or(`title.ilike.%${queryText}%,content.ilike.%${queryText}%`);
      return fallback || [];
    }
    return data || [];
  },

  // Tag Search
  async searchByTag(tag: string, userId: string) {
    const [notes, tasks, bookmarks] = await Promise.all([
      (supabase.from('notes') as any)
        .select('*')
        .eq('user_id', userId)
        .contains('tags', [tag]),
      (supabase.from('tasks') as any)
        .select('*')
        .eq('user_id', userId)
        .contains('tags', [tag]),
      (supabase.from('bookmarks') as any)
        .select('*')
        .eq('user_id', userId)
        .contains('tags', [tag]),
    ]);

    return {
      notes: notes.data || [],
      tasks: tasks.data || [],
      bookmarks: bookmarks.data || [],
    };
  },

  // Folder Content Search
  async getFolderContents(folderId: string, userId: string) {
    const [notes, tasks, files] = await Promise.all([
      (supabase.from('notes') as any).select('*').eq('user_id', userId).eq('folder_id', folderId),
      (supabase.from('tasks') as any).select('*').eq('user_id', userId).eq('folder_id', folderId),
      (supabase.from('files') as any).select('*').eq('user_id', userId).eq('folder_id', folderId),
    ]);

    return {
      notes: notes.data || [],
      tasks: tasks.data || [],
      files: files.data || [],
    };
  },

  // Trash Bin Items
  async getTrashItems(userId: string) {
    const [notes, tasks, bookmarks] = await Promise.all([
      (supabase.from('notes') as any).select('*').eq('user_id', userId).eq('is_trash', true),
      (supabase.from('tasks') as any).select('*').eq('user_id', userId).eq('is_trash', true),
      (supabase.from('bookmarks') as any).select('*').eq('user_id', userId).eq('is_trash', true),
    ]);

    return {
      notes: notes.data || [],
      tasks: tasks.data || [],
      bookmarks: bookmarks.data || [],
    };
  },

  // Favorites Items
  async getFavoriteItems(userId: string) {
    const [notes, tasks, bookmarks, journal, voiceNotes, gallery] = await Promise.all([
      (supabase.from('notes') as any).select('*').eq('user_id', userId).eq('is_favorite', true),
      (supabase.from('tasks') as any).select('*').eq('user_id', userId).eq('is_favorite', true),
      (supabase.from('bookmarks') as any).select('*').eq('user_id', userId).eq('is_favorite', true),
      (supabase.from('journal_entries') as any).select('*').eq('user_id', userId).eq('is_favorite', true),
      (supabase.from('voice_notes') as any).select('*').eq('user_id', userId).eq('is_favorite', true),
      (supabase.from('gallery') as any).select('*').eq('user_id', userId).eq('is_favorite', true),
    ]);

    return {
      notes: notes.data || [],
      tasks: tasks.data || [],
      bookmarks: bookmarks.data || [],
      journal: journal.data || [],
      voiceNotes: voiceNotes.data || [],
      gallery: gallery.data || [],
    };
  },

  // Recent Activity Log
  async getRecentActivity(userId: string, limit: number = 20) {
    const { data } = await (supabase.from('recent_activity') as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  },
};
