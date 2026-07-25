import { create } from 'zustand';
import { 
  StorageData, 
  Note, 
  Task, 
  JournalEntry, 
  Bookmark, 
  Collection, 
  GraphNode, 
  GraphEdge, 
  MindMapNode, 
  MindMapEdge, 
  VoiceNote, 
  PDFDoc, 
  MediaItem, 
  UserSettings 
} from '../types/memory';
import { INITIAL_DATA as initialData } from '../mock/initialData';
import { supabase } from '../lib/supabase/client';
import { authService } from '../lib/supabase/auth';
import { notesService } from '../services/notes.service';
import { tasksService } from '../services/tasks.service';
import { bookmarksService } from '../services/bookmarks.service';
import { journalService } from '../services/journal.service';
import { graphService } from '../services/graph.service';
import { mindmapService } from '../services/mindmap.service';
import { filesService } from '../services/files.service';
import { settingsService } from '../services/settings.service';
import { offlineSyncEngine } from '../lib/sync/offlineSync';
import { User } from '@supabase/supabase-js';

interface MemoryStoreState {
  data: StorageData;
  isLoaded: boolean;
  isCommandPaletteOpen: boolean;
  isQuickCaptureOpen: boolean;
  searchQuery: string;
  user: User | null;
  isGuest: boolean;
  isAuthModalOpen: boolean;

  // Actions
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setGuest: (isGuest: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setQuickCaptureOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  // Realtime
  subscribeRealtime: (userId: string) => () => void;

  // Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, patch: Partial<Note>) => Promise<void>;
  deleteNote: (id: string, permanent?: boolean) => Promise<void>;
  toggleFavoriteNote: (id: string) => Promise<void>;
  toggleArchiveNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;

  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string, permanent?: boolean) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  toggleTaskSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  // Journals
  addJournal: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<JournalEntry>;
  updateJournal: (id: string, patch: Partial<JournalEntry>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;

  // Bookmarks
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Promise<Bookmark>;
  updateBookmark: (id: string, patch: Partial<Bookmark>) => Promise<void>;
  deleteBookmark: (id: string, permanent?: boolean) => Promise<void>;

  // Collections
  addCollection: (col: Omit<Collection, 'id' | 'createdAt'>) => Collection;
  updateCollection: (id: string, patch: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  // Mind Map
  addMindMapNode: (node: Omit<MindMapNode, 'id'>) => Promise<MindMapNode>;
  updateMindMapNode: (id: string, patch: Partial<MindMapNode>) => Promise<void>;
  addMindMapEdge: (edge: MindMapEdge) => Promise<void>;

  // Voice Notes & PDF & Media
  addVoiceNote: (vn: Omit<VoiceNote, 'id' | 'createdAt'>) => Promise<VoiceNote>;
  deleteVoiceNote: (id: string) => Promise<void>;
  addPDFDoc: (pdf: Omit<PDFDoc, 'id' | 'createdAt'>) => Promise<PDFDoc>;
  addMediaItem: (media: Omit<MediaItem, 'id' | 'createdAt'>) => Promise<MediaItem>;
  deleteMediaItem: (id: string) => Promise<void>;

  // Storage Admin
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<boolean>;
  resetStorage: (seed?: boolean) => Promise<void>;
}

export const useMemoryStore = create<MemoryStoreState>((set, get) => ({
  data: initialData,
  isLoaded: false,
  isCommandPaletteOpen: false,
  isQuickCaptureOpen: false,
  searchQuery: '',
  user: null,
  isGuest: false,
  isAuthModalOpen: false,

  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setUser: (user) => set({ user }),
  setGuest: (isGuest) => set({ isGuest }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setQuickCaptureOpen: (open) => set({ isQuickCaptureOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  initialize: async () => {
    try {
      const currentUser = await authService.getUser();
      const guest = authService.isGuestMode();
      set({ user: currentUser, isGuest: guest });

      if (currentUser && !guest) {
        // Fetch real production data from Supabase
        const [notes, tasks, bookmarks, journals, graph, mindmap, voiceNotes, pdfDocs, mediaItems, settings] = await Promise.all([
          notesService.fetchAll(currentUser.id),
          tasksService.fetchAll(currentUser.id),
          bookmarksService.fetchAll(currentUser.id),
          journalService.fetchAll(currentUser.id),
          graphService.fetchGraph(currentUser.id),
          mindmapService.fetchMindMap(currentUser.id),
          filesService.fetchVoiceNotes(currentUser.id),
          filesService.fetchPDFDocs(currentUser.id),
          filesService.fetchMediaItems(currentUser.id),
          settingsService.fetchSettings(currentUser.id),
        ]);

        set({
          data: {
            notes: notes.length > 0 ? notes : initialData.notes,
            tasks: tasks.length > 0 ? tasks : initialData.tasks,
            journals: journals.length > 0 ? journals : initialData.journals,
            bookmarks: bookmarks.length > 0 ? bookmarks : initialData.bookmarks,
            collections: initialData.collections,
            graphNodes: graph.nodes.length > 0 ? graph.nodes : initialData.graphNodes,
            graphEdges: graph.edges.length > 0 ? graph.edges : initialData.graphEdges,
            mindMapNodes: mindmap.nodes.length > 0 ? mindmap.nodes : initialData.mindMapNodes,
            mindMapEdges: mindmap.edges.length > 0 ? mindmap.edges : initialData.mindMapEdges,
            voiceNotes: voiceNotes.length > 0 ? voiceNotes : initialData.voiceNotes,
            pdfDocs: pdfDocs.length > 0 ? pdfDocs : initialData.pdfDocs,
            mediaItems: mediaItems.length > 0 ? mediaItems : initialData.mediaItems,
            settings,
          },
          isLoaded: true,
        });

        // Initialize Offline Sync Engine
        offlineSyncEngine.initAutoSync(() => get().user?.id || null, () => {
          get().initialize();
        });

        // Enable Realtime Subscriptions
        get().subscribeRealtime(currentUser.id);
      } else {
        // Guest mode fallback
        set({ data: initialData, isLoaded: true });
      }
    } catch (err) {
      console.warn('Initialization error, fallback to local:', err);
      set({ data: initialData, isLoaded: true });
    }
  },

  subscribeRealtime: (userId: string) => {
    const channel = supabase
      .channel(`user-realtime-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${userId}` }, async () => {
        const notes = await notesService.fetchAll(userId);
        set((state) => ({ data: { ...state.data, notes } }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` }, async () => {
        const tasks = await tasksService.fetchAll(userId);
        set((state) => ({ data: { ...state.data, tasks } }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` }, async () => {
        const bookmarks = await bookmarksService.fetchAll(userId);
        set((state) => ({ data: { ...state.data, bookmarks } }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries', filter: `user_id=eq.${userId}` }, async () => {
        const journals = await journalService.fetchAll(userId);
        set((state) => ({ data: { ...state.data, journals } }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Notes
  addNote: async (noteData) => {
    const user = get().user;
    const now = new Date().toISOString();
    const tempId = `note-${Date.now()}`;
    const newNote: Note = {
      id: tempId,
      createdAt: now,
      updatedAt: now,
      ...noteData,
    };

    // Optimistic Update
    set((state) => ({
      data: { ...state.data, notes: [newNote, ...state.data.notes] },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      try {
        const created = await notesService.create(user.id, noteData);
        set((state) => ({
          data: {
            ...state.data,
            notes: state.data.notes.map((n) => (n.id === tempId ? created : n)),
          },
        }));
        return created;
      } catch {
        offlineSyncEngine.enqueue({ entityType: 'notes', action: 'create', payload: noteData });
      }
    } else {
      offlineSyncEngine.enqueue({ entityType: 'notes', action: 'create', payload: noteData });
    }
    return newNote;
  },

  updateNote: async (id, patch) => {
    const user = get().user;
    set((state) => ({
      data: {
        ...state.data,
        notes: state.data.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)),
      },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      try {
        await notesService.update(user.id, id, patch);
      } catch {
        offlineSyncEngine.enqueue({ entityType: 'notes', action: 'update', payload: { id, ...patch } });
      }
    } else {
      offlineSyncEngine.enqueue({ entityType: 'notes', action: 'update', payload: { id, ...patch } });
    }
  },

  deleteNote: async (id, permanent = false) => {
    const user = get().user;
    const note = get().data.notes.find((n) => n.id === id);
    const title = note?.title || 'Note';

    if (permanent) {
      set((state) => ({
        data: { ...state.data, notes: state.data.notes.filter((n) => n.id !== id) },
      }));
    } else {
      get().updateNote(id, { isTrash: true });
    }

    if (user && !get().isGuest && navigator.onLine) {
      try {
        await notesService.delete(user.id, id, permanent, title);
      } catch {
        offlineSyncEngine.enqueue({ entityType: 'notes', action: 'delete', payload: { id, permanent } });
      }
    }
  },

  toggleFavoriteNote: async (id) => {
    const note = get().data.notes.find((n) => n.id === id);
    if (note) {
      await get().updateNote(id, { isFavorite: !note.isFavorite });
    }
  },

  toggleArchiveNote: async (id) => {
    const note = get().data.notes.find((n) => n.id === id);
    if (note) {
      await get().updateNote(id, { isArchived: !note.isArchived });
    }
  },

  togglePinNote: async (id) => {
    const note = get().data.notes.find((n) => n.id === id);
    if (note) {
      await get().updateNote(id, { isPinned: !note.isPinned });
    }
  },

  // Tasks
  addTask: async (taskData) => {
    const user = get().user;
    const now = new Date().toISOString();
    const tempId = `task-${Date.now()}`;
    const newTask: Task = {
      id: tempId,
      createdAt: now,
      updatedAt: now,
      ...taskData,
    };

    set((state) => ({
      data: { ...state.data, tasks: [newTask, ...state.data.tasks] },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      try {
        const created = await tasksService.create(user.id, taskData);
        set((state) => ({
          data: {
            ...state.data,
            tasks: state.data.tasks.map((t) => (t.id === tempId ? created : t)),
          },
        }));
        return created;
      } catch {
        offlineSyncEngine.enqueue({ entityType: 'tasks', action: 'create', payload: taskData });
      }
    } else {
      offlineSyncEngine.enqueue({ entityType: 'tasks', action: 'create', payload: taskData });
    }
    return newTask;
  },

  updateTask: async (id, patch) => {
    const user = get().user;
    set((state) => ({
      data: {
        ...state.data,
        tasks: state.data.tasks.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)),
      },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      try {
        await tasksService.update(user.id, id, patch);
      } catch {
        offlineSyncEngine.enqueue({ entityType: 'tasks', action: 'update', payload: { id, ...patch } });
      }
    }
  },

  deleteTask: async (id, permanent = false) => {
    const user = get().user;
    const task = get().data.tasks.find((t) => t.id === id);
    const title = task?.title || 'Task';

    if (permanent) {
      set((state) => ({
        data: { ...state.data, tasks: state.data.tasks.filter((t) => t.id !== id) },
      }));
    } else {
      await get().updateTask(id, { isTrash: true });
    }

    if (user && !get().isGuest && navigator.onLine) {
      try {
        await tasksService.delete(user.id, id, permanent, title);
      } catch {
        offlineSyncEngine.enqueue({ entityType: 'tasks', action: 'delete', payload: { id, permanent } });
      }
    }
  },

  toggleTaskStatus: async (id) => {
    const task = get().data.tasks.find((t) => t.id === id);
    if (task) {
      const nextStatus = task.status === 'completed' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'completed';
      await get().updateTask(id, { status: nextStatus });
    }
  },

  toggleTaskSubtask: async (taskId, subtaskId) => {
    const task = get().data.tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedSubtasks = task.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      await get().updateTask(taskId, { subtasks: updatedSubtasks });
    }
  },

  // Journals
  addJournal: async (entryData) => {
    const user = get().user;
    const now = new Date().toISOString();
    const tempId = `j-${Date.now()}`;
    const newEntry: JournalEntry = {
      id: tempId,
      createdAt: now,
      updatedAt: now,
      ...entryData,
    };

    set((state) => ({
      data: { ...state.data, journals: [newEntry, ...state.data.journals] },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      try {
        const created = await journalService.create(user.id, entryData);
        set((state) => ({
          data: {
            ...state.data,
            journals: state.data.journals.map((j) => (j.id === tempId ? created : j)),
          },
        }));
        return created;
      } catch {
        offlineSyncEngine.enqueue({ entityType: 'journal_entries', action: 'create', payload: entryData });
      }
    }
    return newEntry;
  },

  updateJournal: async (id, patch) => {
    const user = get().user;
    set((state) => ({
      data: {
        ...state.data,
        journals: state.data.journals.map((j) => (j.id === id ? { ...j, ...patch } : j)),
      },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      await journalService.update(user.id, id, patch);
    }
  },

  deleteJournal: async (id) => {
    const user = get().user;
    set((state) => ({
      data: { ...state.data, journals: state.data.journals.filter((j) => j.id !== id) },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      await journalService.delete(user.id, id);
    }
  },

  // Bookmarks
  addBookmark: async (bmData) => {
    const user = get().user;
    const tempId = `bm-${Date.now()}`;
    const newBm: Bookmark = {
      id: tempId,
      createdAt: new Date().toISOString(),
      ...bmData,
    };

    set((state) => ({
      data: { ...state.data, bookmarks: [newBm, ...state.data.bookmarks] },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      try {
        const created = await bookmarksService.create(user.id, bmData);
        set((state) => ({
          data: {
            ...state.data,
            bookmarks: state.data.bookmarks.map((b) => (b.id === tempId ? created : b)),
          },
        }));
        return created;
      } catch {
        offlineSyncEngine.enqueue({ entityType: 'bookmarks', action: 'create', payload: bmData });
      }
    }
    return newBm;
  },

  updateBookmark: async (id, patch) => {
    const user = get().user;
    set((state) => ({
      data: {
        ...state.data,
        bookmarks: state.data.bookmarks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      await bookmarksService.update(user.id, id, patch);
    }
  },

  deleteBookmark: async (id, permanent = false) => {
    const user = get().user;
    const bm = get().data.bookmarks.find((b) => b.id === id);
    const title = bm?.title || 'Bookmark';

    if (permanent) {
      set((state) => ({
        data: { ...state.data, bookmarks: state.data.bookmarks.filter((b) => b.id !== id) },
      }));
    } else {
      await get().updateBookmark(id, { isTrash: true });
    }

    if (user && !get().isGuest && navigator.onLine) {
      await bookmarksService.delete(user.id, id, permanent, title);
    }
  },

  // Collections
  addCollection: (colData) => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...colData,
    };
    set((state) => ({
      data: { ...state.data, collections: [newCol, ...state.data.collections] },
    }));
    return newCol;
  },

  updateCollection: (id, patch) => {
    set((state) => ({
      data: {
        ...state.data,
        collections: state.data.collections.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    }));
  },

  deleteCollection: (id) => {
    set((state) => ({
      data: { ...state.data, collections: state.data.collections.filter((c) => c.id !== id) },
    }));
  },

  // Mind Map
  addMindMapNode: async (nodeData) => {
    const user = get().user;
    const tempId = `mm-${Date.now()}`;
    const newNode: MindMapNode = { id: tempId, ...nodeData };

    set((state) => ({
      data: { ...state.data, mindMapNodes: [...state.data.mindMapNodes, newNode] },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      const created = await mindmapService.addNode(user.id, nodeData);
      set((state) => ({
        data: {
          ...state.data,
          mindMapNodes: state.data.mindMapNodes.map((n) => (n.id === tempId ? created : n)),
        },
      }));
      return created;
    }
    return newNode;
  },

  updateMindMapNode: async (id, patch) => {
    const user = get().user;
    set((state) => ({
      data: {
        ...state.data,
        mindMapNodes: state.data.mindMapNodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      await mindmapService.updateNode(user.id, id, patch);
    }
  },

  addMindMapEdge: async (edge) => {
    const user = get().user;
    set((state) => ({
      data: { ...state.data, mindMapEdges: [...state.data.mindMapEdges, edge] },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      await mindmapService.addEdge(user.id, edge);
    }
  },

  // Voice Notes
  addVoiceNote: async (vnData) => {
    const user = get().user;
    const tempId = `vn-${Date.now()}`;
    const newVn: VoiceNote = {
      id: tempId,
      createdAt: new Date().toISOString(),
      ...vnData,
    };

    set((state) => ({
      data: { ...state.data, voiceNotes: [newVn, ...state.data.voiceNotes] },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      const created = await filesService.uploadVoiceNote(user.id, vnData.title, vnData.duration, undefined, vnData.transcript, vnData.tags);
      set((state) => ({
        data: {
          ...state.data,
          voiceNotes: state.data.voiceNotes.map((v) => (v.id === tempId ? created : v)),
        },
      }));
      return created;
    }
    return newVn;
  },

  deleteVoiceNote: async (id) => {
    const user = get().user;
    set((state) => ({
      data: { ...state.data, voiceNotes: state.data.voiceNotes.filter((v) => v.id !== id) },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      await filesService.deleteVoiceNote(user.id, id);
    }
  },

  // PDF
  addPDFDoc: async (pdfData) => {
    const tempId = `pdf-${Date.now()}`;
    const newPdf: PDFDoc = {
      id: tempId,
      createdAt: new Date().toISOString(),
      ...pdfData,
    };
    set((state) => ({
      data: { ...state.data, pdfDocs: [newPdf, ...state.data.pdfDocs] },
    }));
    return newPdf;
  },

  // Media
  addMediaItem: async (mediaData) => {
    const tempId = `med-${Date.now()}`;
    const newMedia: MediaItem = {
      id: tempId,
      createdAt: new Date().toISOString(),
      ...mediaData,
    };
    set((state) => ({
      data: { ...state.data, mediaItems: [newMedia, ...state.data.mediaItems] },
    }));
    return newMedia;
  },

  deleteMediaItem: async (id) => {
    const user = get().user;
    set((state) => ({
      data: { ...state.data, mediaItems: state.data.mediaItems.filter((m) => m.id !== id) },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      await filesService.deleteMediaItem(user.id, id);
    }
  },

  // Storage Admin
  updateSettings: async (settingsPatch) => {
    const user = get().user;
    set((state) => ({
      data: { ...state.data, settings: { ...state.data.settings, ...settingsPatch } },
    }));

    if (user && !get().isGuest && navigator.onLine) {
      await settingsService.updateSettings(user.id, settingsPatch);
    }
  },

  exportJSON: () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(get().data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `memory_os_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importJSON: async (file) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as StorageData;
      set({ data: parsed });
      return true;
    } catch {
      return false;
    }
  },

  resetStorage: async (seed = true) => {
    set({ data: seed ? initialData : {
      notes: [],
      tasks: [],
      journals: [],
      bookmarks: [],
      collections: [],
      graphNodes: [],
      graphEdges: [],
      mindMapNodes: [],
      mindMapEdges: [],
      voiceNotes: [],
      pdfDocs: [],
      mediaItems: [],
      settings: initialData.settings,
    } });
  },
}));
