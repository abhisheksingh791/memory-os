import Fuse from 'fuse.js';
import { StorageData, EntityType } from '../types/memory';
import { INITIAL_DATA } from '../mock/initialData';

const STORAGE_KEY = 'MEMORY_OS_DATA_V1';

class LocalStorageManager {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // Get full state from LocalStorage or seed with INITIAL_DATA
  private readStorage(): StorageData {
    if (!this.isBrowser()) return INITIAL_DATA;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.writeStorage(INITIAL_DATA);
        return INITIAL_DATA;
      }
      return JSON.parse(data) as StorageData;
    } catch (error) {
      console.error('[Memory Storage] Error reading LocalStorage:', error);
      return INITIAL_DATA;
    }
  }

  // Persist full state to LocalStorage
  private writeStorage(data: StorageData): boolean {
    if (!this.isBrowser()) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('[Memory Storage] Error writing to LocalStorage:', error);
      return false;
    }
  }

  /**
   * Save a new entity to the specified collection type
   */
  public save<T extends { id: string }>(type: EntityType, item: T): T {
    const data = this.readStorage();
    if (Array.isArray(data[type])) {
      (data[type] as unknown as T[]).unshift(item);
      this.writeStorage(data);
    }
    return item;
  }

  /**
   * Update an existing entity by ID
   */
  public update<T>(type: EntityType, id: string, patch: Partial<T>): T | null {
    const data = this.readStorage();
    if (Array.isArray(data[type])) {
      const array = data[type] as unknown as (T & { id: string })[];
      const index = array.findIndex((item) => item.id === id);
      if (index !== -1) {
        array[index] = { ...array[index], ...patch };
        this.writeStorage(data);
        return array[index];
      }
    } else if (type === 'settings') {
      data.settings = { ...data.settings, ...patch } as any;
      this.writeStorage(data);
      return data.settings as unknown as T;
    }
    return null;
  }

  /**
   * Remove an entity by ID
   */
  public remove(type: EntityType, id: string): boolean {
    const data = this.readStorage();
    if (Array.isArray(data[type])) {
      const array = data[type] as unknown as { id: string }[];
      const filtered = array.filter((item) => item.id !== id);
      if (filtered.length !== array.length) {
        (data as any)[type] = filtered;
        this.writeStorage(data);
        return true;
      }
    }
    return false;
  }

  /**
   * Get a single item by ID
   */
  public get<T extends { id: string }>(type: EntityType, id: string): T | null {
    const data = this.readStorage();
    if (Array.isArray(data[type])) {
      const array = data[type] as unknown as T[];
      return array.find((item) => item.id === id) || null;
    }
    return null;
  }

  /**
   * Get all items for an entity type or full storage
   */
  public getAll<T>(type?: EntityType): T {
    const data = this.readStorage();
    if (!type) {
      return data as unknown as T;
    }
    return data[type] as unknown as T;
  }

  /**
   * Perform fuzzy search using Fuse.js across specified items or all text content
   */
  public search(query: string, type?: 'notes' | 'tasks' | 'journals' | 'bookmarks'): any[] {
    if (!query.trim()) return [];
    const data = this.readStorage();

    let itemsToSearch: any[] = [];
    if (type) {
      itemsToSearch = data[type] || [];
    } else {
      itemsToSearch = [
        ...data.notes.map((n) => ({ ...n, itemType: 'note' })),
        ...data.tasks.map((t) => ({ ...t, itemType: 'task' })),
        ...data.journals.map((j) => ({ ...j, itemType: 'journal' })),
        ...data.bookmarks.map((b) => ({ ...b, itemType: 'bookmark' })),
      ];
    }

    const fuse = new Fuse(itemsToSearch, {
      keys: ['title', 'content', 'description', 'tags', 'url', 'transcript'],
      threshold: 0.4,
      ignoreLocation: true,
    });

    return fuse.search(query).map((res) => res.item);
  }

  /**
   * Generate a stringified JSON snapshot of the local storage database
   */
  public backup(): string {
    const data = this.readStorage();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Restore storage from a JSON string payload
   */
  public restore(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString) as StorageData;
      if (parsed && typeof parsed === 'object' && parsed.notes && parsed.tasks) {
        return this.writeStorage(parsed);
      }
      return false;
    } catch (e) {
      console.error('[Memory Storage] Failed to restore storage:', e);
      return false;
    }
  }

  /**
   * Export database directly as a downloadable .json file artifact
   */
  public exportJSON(filename = 'memory-os-backup.json'): void {
    if (!this.isBrowser()) return;
    const jsonStr = this.backup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Import database from a File object
   */
  public async importJSON(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          const success = this.restore(content);
          resolve(success);
        } else {
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }

  /**
   * Clear all storage and reset to initial state or empty state
   */
  public clear(resetToInitial = false): void {
    if (!this.isBrowser()) return;
    if (resetToInitial) {
      this.writeStorage(INITIAL_DATA);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export const memoryStorage = new LocalStorageManager();
