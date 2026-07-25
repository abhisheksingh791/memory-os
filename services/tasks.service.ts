import { supabase } from '../lib/supabase/client';
import { TaskRow } from '../lib/supabase/types';
import { Task, SubTask } from '../types/memory';
import { mutationService } from '../lib/supabase/mutations';

export function mapTaskRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date || undefined,
    subtasks: (row.subtasks as unknown as SubTask[]) || [],
    tags: row.tags || [],
    collectionId: row.collection_id || undefined,
    isFavorite: row.is_favorite,
    isArchived: row.is_archived,
    isTrash: row.is_trash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const tasksService = {
  async fetchAll(userId: string): Promise<Task[]> {
    const { data, error } = await (supabase.from('tasks') as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching tasks:', error);
      return [];
    }
    return (data || []).map(mapTaskRowToTask);
  },

  async create(userId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const { data, error } = await (supabase.from('tasks') as any)
      .insert({
        user_id: userId,
        title: task.title,
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.dueDate || null,
        subtasks: (task.subtasks || []) as any,
        tags: task.tags || [],
        collection_id: task.collectionId || null,
        is_favorite: task.isFavorite || false,
        is_archived: task.isArchived || false,
        is_trash: task.isTrash || false,
      })
      .select('*')
      .single();

    if (error) throw error;
    await mutationService.logActivity(userId, 'create', 'tasks', data.id, { title: data.title });
    return mapTaskRowToTask(data);
  },

  async update(userId: string, id: string, patch: Partial<Task>): Promise<Task | null> {
    const updates: Partial<TaskRow> = {};
    if (patch.title !== undefined) updates.title = patch.title;
    if (patch.description !== undefined) updates.description = patch.description;
    if (patch.status !== undefined) updates.status = patch.status;
    if (patch.priority !== undefined) updates.priority = patch.priority;
    if (patch.dueDate !== undefined) updates.due_date = patch.dueDate || null;
    if (patch.subtasks !== undefined) updates.subtasks = patch.subtasks as any;
    if (patch.tags !== undefined) updates.tags = patch.tags;
    if (patch.collectionId !== undefined) updates.collection_id = patch.collectionId || null;
    if (patch.isFavorite !== undefined) updates.is_favorite = patch.isFavorite;
    if (patch.isArchived !== undefined) updates.is_archived = patch.isArchived;
    if (patch.isTrash !== undefined) updates.is_trash = patch.isTrash;

    const { data, error } = await (supabase.from('tasks') as any)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) return null;
    return mapTaskRowToTask(data);
  },

  async delete(userId: string, id: string, permanent: boolean = false, title: string = 'Task'): Promise<void> {
    if (permanent) {
      await mutationService.purgeItem('tasks', id, userId);
    } else {
      await mutationService.moveToTrash('tasks', id, userId, title);
    }
  },

  async duplicate(userId: string, id: string): Promise<Task> {
    const row = await mutationService.duplicateTask(id, userId);
    return mapTaskRowToTask(row);
  },
};
