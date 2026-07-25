import { supabase } from '../lib/supabase/client';
import { CalendarEventRow } from '../lib/supabase/types';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  allDay: boolean;
  color: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

export function mapCalendarRowToEvent(row: CalendarEventRow): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    startTime: row.start_time,
    endTime: row.end_time || undefined,
    allDay: row.all_day,
    color: row.color || '#6366F1',
    entityType: row.entity_type || undefined,
    entityId: row.entity_id || undefined,
    createdAt: row.created_at,
  };
}

export const calendarService = {
  async fetchEvents(userId: string): Promise<CalendarEvent[]> {
    const { data, error } = await (supabase.from('calendar_events') as any)
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) return [];
    return (data || []).map(mapCalendarRowToEvent);
  },

  async createEvent(userId: string, event: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<CalendarEvent> {
    const { data, error } = await (supabase.from('calendar_events') as any)
      .insert({
        user_id: userId,
        title: event.title,
        description: event.description || null,
        start_time: event.startTime,
        end_time: event.endTime || null,
        all_day: event.allDay || false,
        color: event.color || '#6366F1',
        entity_type: event.entityType || null,
        entity_id: event.entityId || null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapCalendarRowToEvent(data);
  },

  async updateEvent(userId: string, id: string, patch: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const updates: Partial<CalendarEventRow> = {};
    if (patch.title !== undefined) updates.title = patch.title;
    if (patch.description !== undefined) updates.description = patch.description;
    if (patch.startTime !== undefined) updates.start_time = patch.startTime;
    if (patch.endTime !== undefined) updates.end_time = patch.endTime;
    if (patch.allDay !== undefined) updates.all_day = patch.allDay;
    if (patch.color !== undefined) updates.color = patch.color;

    const { data, error } = await (supabase.from('calendar_events') as any)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) return null;
    return mapCalendarRowToEvent(data);
  },

  async deleteEvent(userId: string, id: string): Promise<void> {
    await (supabase.from('calendar_events') as any).delete().eq('id', id).eq('user_id', userId);
  },
};
