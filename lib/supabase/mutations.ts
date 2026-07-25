import { supabase } from './client';

export const mutationService = {
  // Log User Activity
  async logActivity(userId: string, action: string, entityType: string, entityId: string, details: Record<string, any> = {}) {
    try {
      await (supabase.from('recent_activity') as any).insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
      });
    } catch (err) {
      console.warn('Activity logging error:', err);
    }
  },

  // Soft delete item (Move to Trash)
  async moveToTrash(table: 'notes' | 'tasks' | 'bookmarks', id: string, userId: string, title: string) {
    await (supabase.from(table) as any).update({ is_trash: true }).eq('id', id).eq('user_id', userId);
    await (supabase.from('trash') as any).insert({
      user_id: userId,
      item_type: table,
      item_id: id,
      title,
    });
    await this.logActivity(userId, 'delete', table, id, { title });
  },

  // Restore item from Trash
  async restoreFromTrash(table: 'notes' | 'tasks' | 'bookmarks', id: string, userId: string) {
    await (supabase.from(table) as any).update({ is_trash: false }).eq('id', id).eq('user_id', userId);
    await (supabase.from('trash') as any).delete().eq('item_id', id).eq('user_id', userId);
    await this.logActivity(userId, 'restore', table, id);
  },

  // Permanent Delete
  async purgeItem(table: 'notes' | 'tasks' | 'bookmarks' | 'journal_entries' | 'voice_notes' | 'gallery' | 'pdfs', id: string, userId: string) {
    await (supabase.from(table) as any).delete().eq('id', id).eq('user_id', userId);
    await (supabase.from('trash') as any).delete().eq('item_id', id).eq('user_id', userId);
    await this.logActivity(userId, 'purge', table, id);
  },

  // Empty Trash Bin
  async emptyTrash(userId: string) {
    await Promise.all([
      supabase.from('notes').delete().eq('user_id', userId).eq('is_trash', true),
      supabase.from('tasks').delete().eq('user_id', userId).eq('is_trash', true),
      supabase.from('bookmarks').delete().eq('user_id', userId).eq('is_trash', true),
      supabase.from('trash').delete().eq('user_id', userId),
    ]);
  },

  // Create Shared Link for Note / Mind Map / Collection
  async createSharedLink(userId: string, itemType: string, itemId: string, expiresDays?: number) {
    const expiresAt = expiresDays
      ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await (supabase.from('shared_links') as any)
      .insert({
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        is_public: true,
        expires_at: expiresAt,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  // Duplicate Note
  async duplicateNote(noteId: string, userId: string) {
    const { data: note, error: fetchErr } = await (supabase.from('notes') as any)
      .select('*')
      .eq('id', noteId)
      .single();

    if (fetchErr || !note) throw new Error('Note not found');

    const { data: newNote, error: insertErr } = await (supabase.from('notes') as any)
      .insert({
        user_id: userId,
        folder_id: note.folder_id,
        collection_id: note.collection_id,
        title: `${note.title} (Copy)`,
        content: note.content,
        type: note.type,
        color: note.color,
        tags: note.tags,
        is_favorite: false,
        is_pinned: false,
        is_archived: false,
        is_trash: false,
      })
      .select('*')
      .single();

    if (insertErr) throw insertErr;
    await this.logActivity(userId, 'duplicate', 'notes', newNote.id);
    return newNote;
  },

  // Duplicate Task
  async duplicateTask(taskId: string, userId: string) {
    const { data: task, error: fetchErr } = await (supabase.from('tasks') as any)
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchErr || !task) throw new Error('Task not found');

    const { data: newTask, error: insertErr } = await (supabase.from('tasks') as any)
      .insert({
        user_id: userId,
        folder_id: task.folder_id,
        collection_id: task.collection_id,
        title: `${task.title} (Copy)`,
        description: task.description,
        status: 'todo',
        priority: task.priority,
        due_date: task.due_date,
        subtasks: task.subtasks,
        tags: task.tags,
        is_favorite: false,
        is_archived: false,
        is_trash: false,
      })
      .select('*')
      .single();

    if (insertErr) throw insertErr;
    await this.logActivity(userId, 'duplicate', 'tasks', newTask.id);
    return newTask;
  },
};
