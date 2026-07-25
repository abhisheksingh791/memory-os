import { notesService } from '../../services/notes.service';
import { tasksService } from '../../services/tasks.service';
import { bookmarksService } from '../../services/bookmarks.service';
import { journalService } from '../../services/journal.service';

export interface PendingAction {
  id: string;
  entityType: 'notes' | 'tasks' | 'bookmarks' | 'journal_entries';
  action: 'create' | 'update' | 'delete';
  payload: any;
  timestamp: string;
}

const QUEUE_STORAGE_KEY = 'memory_os_offline_queue';

export const offlineSyncEngine = {
  getQueue(): PendingAction[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveQueue(queue: PendingAction[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  },

  enqueue(action: Omit<PendingAction, 'id' | 'timestamp'>) {
    const queue = this.getQueue();
    const newAction: PendingAction = {
      ...action,
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    queue.push(newAction);
    this.saveQueue(queue);
  },

  async processQueue(userId: string): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.onLine) return false;
    const queue = this.getQueue();
    if (queue.length === 0) return true;

    const remainingQueue: PendingAction[] = [];

    for (const item of queue) {
      try {
        if (item.entityType === 'notes') {
          if (item.action === 'create') await notesService.create(userId, item.payload);
          else if (item.action === 'update') await notesService.update(userId, item.payload.id, item.payload);
          else if (item.action === 'delete') await notesService.delete(userId, item.payload.id, item.payload.permanent);
        } else if (item.entityType === 'tasks') {
          if (item.action === 'create') await tasksService.create(userId, item.payload);
          else if (item.action === 'update') await tasksService.update(userId, item.payload.id, item.payload);
          else if (item.action === 'delete') await tasksService.delete(userId, item.payload.id, item.payload.permanent);
        } else if (item.entityType === 'bookmarks') {
          if (item.action === 'create') await bookmarksService.create(userId, item.payload);
          else if (item.action === 'update') await bookmarksService.update(userId, item.payload.id, item.payload);
          else if (item.action === 'delete') await bookmarksService.delete(userId, item.payload.id, item.payload.permanent);
        } else if (item.entityType === 'journal_entries') {
          if (item.action === 'create') await journalService.create(userId, item.payload);
          else if (item.action === 'update') await journalService.update(userId, item.payload.id, item.payload);
          else if (item.action === 'delete') await journalService.delete(userId, item.payload.id);
        }
      } catch (err) {
        console.warn(`Sync queue error processing item ${item.id}:`, err);
        remainingQueue.push(item);
      }
    }

    this.saveQueue(remainingQueue);
    return remainingQueue.length === 0;
  },

  initAutoSync(userIdGetter: () => string | null, onSyncComplete?: () => void) {
    if (typeof window === 'undefined') return;

    const sync = async () => {
      const uid = userIdGetter();
      if (uid && navigator.onLine) {
        const synced = await this.processQueue(uid);
        if (synced && onSyncComplete) {
          onSyncComplete();
        }
      }
    };

    window.addEventListener('online', sync);
    // Periodically sync every 30 seconds if online
    const interval = setInterval(sync, 30000);

    return () => {
      window.removeEventListener('online', sync);
      clearInterval(interval);
    };
  },
};
