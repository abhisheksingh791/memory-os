import { supabase } from '../lib/supabase/client';
import { NotificationRow } from '../lib/supabase/types';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'reminder';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export const notificationsService = {
  async fetchNotifications(userId: string): Promise<NotificationItem[]> {
    const { data } = await (supabase.from('notifications') as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return (data || []).map((row: NotificationRow) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type,
      isRead: row.is_read,
      link: row.link || undefined,
      createdAt: row.created_at,
    }));
  },

  async markAsRead(userId: string, id: string): Promise<void> {
    await (supabase.from('notifications') as any).update({ is_read: true }).eq('id', id).eq('user_id', userId);
  },

  async createNotification(userId: string, title: string, message: string, type: 'info' | 'warning' | 'success' | 'reminder' = 'info', link?: string): Promise<NotificationItem> {
    const { data, error } = await (supabase.from('notifications') as any)
      .insert({
        user_id: userId,
        title,
        message,
        type,
        is_read: false,
        link: link || null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: data.is_read,
      link: data.link || undefined,
      createdAt: data.created_at,
    };
  },
};
