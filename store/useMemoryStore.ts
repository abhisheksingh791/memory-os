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
import { memoryStorage } from '../lib/storage';

interface MemoryStoreState {
  data: StorageData;
  isLoaded: boolean;
  isCommandPaletteOpen: boolean;
  isQuickCaptureOpen: boolean;
  searchQuery: string;

  // Actions
  initialize: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setQuickCaptureOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  // Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string, permanent?: boolean) => void;
  toggleFavoriteNote: (id: string) => void;
  toggleArchiveNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string, permanent?: boolean) => void;
  toggleTaskStatus: (id: string) => void;
  toggleTaskSubtask: (taskId: string, subtaskId: string) => void;

  // Journals
  addJournal: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => JournalEntry;
  updateJournal: (id: string, patch: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;

  // Bookmarks
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Bookmark;
  updateBookmark: (id: string, patch: Partial<Bookmark>) => void;
  deleteBookmark: (id: string, permanent?: boolean) => void;

  // Collections
  addCollection: (col: Omit<Collection, 'id' | 'createdAt'>) => Collection;
  updateCollection: (id: string, patch: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  // Mind Map
  addMindMapNode: (node: Omit<MindMapNode, 'id'>) => MindMapNode;
  updateMindMapNode: (id: string, patch: Partial<MindMapNode>) => void;
  addMindMapEdge: (edge: MindMapEdge) => void;

  // Voice Notes & PDF & Media
  addVoiceNote: (vn: Omit<VoiceNote, 'id' | 'createdAt'>) => VoiceNote;
  deleteVoiceNote: (id: string) => void;
  addPDFDoc: (pdf: Omit<PDFDoc, 'id' | 'createdAt'>) => PDFDoc;
  addMediaItem: (media: Omit<MediaItem, 'id' | 'createdAt'>) => MediaItem;
  deleteMediaItem: (id: string) => void;

  // Storage Admin
  updateSettings: (settings: Partial<UserSettings>) => void;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<boolean>;
  resetStorage: (seed?: boolean) => void;
}

export const useMemoryStore = create<MemoryStoreState>((set, get) => ({
  data: memoryStorage.getAll<StorageData>(),
  isLoaded: false,
  isCommandPaletteOpen: false,
  isQuickCaptureOpen: false,
  searchQuery: '',

  initialize: () => {
    const fullData = memoryStorage.getAll<StorageData>();
    set({ data: fullData, isLoaded: true });
  },

  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setQuickCaptureOpen: (open) => set({ isQuickCaptureOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Notes
  addNote: (noteData) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      ...noteData,
    };
    memoryStorage.save('notes', newNote);
    set((state) => ({
      data: { ...state.data, notes: [newNote, ...state.data.notes] },
    }));
    return newNote;
  },

  updateNote: (id, patch) => {
    const updated = memoryStorage.update<Note>('notes', id, { ...patch, updatedAt: new Date().toISOString() });
    if (updated) {
      set((state) => ({
        data: {
          ...state.data,
          notes: state.data.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
        },
      }));
    }
  },

  deleteNote: (id, permanent = false) => {
    if (permanent) {
      memoryStorage.remove('notes', id);
      set((state) => ({
        data: { ...state.data, notes: state.data.notes.filter((n) => n.id !== id) },
      }));
    } else {
      get().updateNote(id, { isTrash: true });
    }
  },

  toggleFavoriteNote: (id) => {
    const note = get().data.notes.find((n) => n.id === id);
    if (note) {
      get().updateNote(id, { isFavorite: !note.isFavorite });
    }
  },

  toggleArchiveNote: (id) => {
    const note = get().data.notes.find((n) => n.id === id);
    if (note) {
      get().updateNote(id, { isArchived: !note.isArchived });
    }
  },

  togglePinNote: (id) => {
    const note = get().data.notes.find((n) => n.id === id);
    if (note) {
      get().updateNote(id, { isPinned: !note.isPinned });
    }
  },

  // Tasks
  addTask: (taskData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      ...taskData,
    };
    memoryStorage.save('tasks', newTask);
    set((state) => ({
      data: { ...state.data, tasks: [newTask, ...state.data.tasks] },
    }));
    return newTask;
  },

  updateTask: (id, patch) => {
    const updated = memoryStorage.update<Task>('tasks', id, { ...patch, updatedAt: new Date().toISOString() });
    if (updated) {
      set((state) => ({
        data: {
          ...state.data,
          tasks: state.data.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        },
      }));
    }
  },

  deleteTask: (id, permanent = false) => {
    if (permanent) {
      memoryStorage.remove('tasks', id);
      set((state) => ({
        data: { ...state.data, tasks: state.data.tasks.filter((t) => t.id !== id) },
      }));
    } else {
      get().updateTask(id, { isTrash: true });
    }
  },

  toggleTaskStatus: (id) => {
    const task = get().data.tasks.find((t) => t.id === id);
    if (task) {
      const nextStatus = task.status === 'completed' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'completed';
      get().updateTask(id, { status: nextStatus });
    }
  },

  toggleTaskSubtask: (taskId, subtaskId) => {
    const task = get().data.tasks.find((t) => t.id === taskId);
    if (task) {
      const updatedSubtasks = task.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      get().updateTask(taskId, { subtasks: updatedSubtasks });
    }
  },

  // Journals
  addJournal: (entryData) => {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      ...entryData,
    };
    memoryStorage.save('journals', newEntry);
    set((state) => ({
      data: { ...state.data, journals: [newEntry, ...state.data.journals] },
    }));
    return newEntry;
  },

  updateJournal: (id, patch) => {
    memoryStorage.update<JournalEntry>('journals', id, patch);
    set((state) => ({
      data: {
        ...state.data,
        journals: state.data.journals.map((j) => (j.id === id ? { ...j, ...patch } : j)),
      },
    }));
  },

  deleteJournal: (id) => {
    memoryStorage.remove('journals', id);
    set((state) => ({
      data: { ...state.data, journals: state.data.journals.filter((j) => j.id !== id) },
    }));
  },

  // Bookmarks
  addBookmark: (bmData) => {
    const newBm: Bookmark = {
      id: `bm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...bmData,
    };
    memoryStorage.save('bookmarks', newBm);
    set((state) => ({
      data: { ...state.data, bookmarks: [newBm, ...state.data.bookmarks] },
    }));
    return newBm;
  },

  updateBookmark: (id, patch) => {
    memoryStorage.update<Bookmark>('bookmarks', id, patch);
    set((state) => ({
      data: {
        ...state.data,
        bookmarks: state.data.bookmarks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      },
    }));
  },

  deleteBookmark: (id, permanent = false) => {
    if (permanent) {
      memoryStorage.remove('bookmarks', id);
      set((state) => ({
        data: { ...state.data, bookmarks: state.data.bookmarks.filter((b) => b.id !== id) },
      }));
    } else {
      get().updateBookmark(id, { isTrash: true });
    }
  },

  // Collections
  addCollection: (colData) => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...colData,
    };
    memoryStorage.save('collections', newCol);
    set((state) => ({
      data: { ...state.data, collections: [newCol, ...state.data.collections] },
    }));
    return newCol;
  },

  updateCollection: (id, patch) => {
    memoryStorage.update<Collection>('collections', id, patch);
    set((state) => ({
      data: {
        ...state.data,
        collections: state.data.collections.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    }));
  },

  deleteCollection: (id) => {
    memoryStorage.remove('collections', id);
    set((state) => ({
      data: { ...state.data, collections: state.data.collections.filter((c) => c.id !== id) },
    }));
  },

  // Mind Map
  addMindMapNode: (nodeData) => {
    const newNode: MindMapNode = {
      id: `mm-${Date.now()}`,
      ...nodeData,
    };
    memoryStorage.save('mindMapNodes', newNode);
    set((state) => ({
      data: { ...state.data, mindMapNodes: [...state.data.mindMapNodes, newNode] },
    }));
    return newNode;
  },

  updateMindMapNode: (id, patch) => {
    memoryStorage.update<MindMapNode>('mindMapNodes', id, patch);
    set((state) => ({
      data: {
        ...state.data,
        mindMapNodes: state.data.mindMapNodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      },
    }));
  },

  addMindMapEdge: (edge) => {
    memoryStorage.save('mindMapEdges', edge);
    set((state) => ({
      data: { ...state.data, mindMapEdges: [...state.data.mindMapEdges, edge] },
    }));
  },

  // Voice Notes
  addVoiceNote: (vnData) => {
    const newVn: VoiceNote = {
      id: `vn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...vnData,
    };
    memoryStorage.save('voiceNotes', newVn);
    set((state) => ({
      data: { ...state.data, voiceNotes: [newVn, ...state.data.voiceNotes] },
    }));
    return newVn;
  },

  deleteVoiceNote: (id) => {
    memoryStorage.remove('voiceNotes', id);
    set((state) => ({
      data: { ...state.data, voiceNotes: state.data.voiceNotes.filter((v) => v.id !== id) },
    }));
  },

  // PDF
  addPDFDoc: (pdfData) => {
    const newPdf: PDFDoc = {
      id: `pdf-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...pdfData,
    };
    memoryStorage.save('pdfDocs', newPdf);
    set((state) => ({
      data: { ...state.data, pdfDocs: [newPdf, ...state.data.pdfDocs] },
    }));
    return newPdf;
  },

  // Media
  addMediaItem: (mediaData) => {
    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...mediaData,
    };
    memoryStorage.save('mediaItems', newMedia);
    set((state) => ({
      data: { ...state.data, mediaItems: [newMedia, ...state.data.mediaItems] },
    }));
    return newMedia;
  },

  deleteMediaItem: (id) => {
    memoryStorage.remove('mediaItems', id);
    set((state) => ({
      data: { ...state.data, mediaItems: state.data.mediaItems.filter((m) => m.id !== id) },
    }));
  },

  // Storage Admin
  updateSettings: (settingsPatch) => {
    memoryStorage.update('settings', '', settingsPatch);
    set((state) => ({
      data: { ...state.data, settings: { ...state.data.settings, ...settingsPatch } },
    }));
  },

  exportJSON: () => {
    memoryStorage.exportJSON();
  },

  importJSON: async (file) => {
    const success = await memoryStorage.importJSON(file);
    if (success) {
      get().initialize();
    }
    return success;
  },

  resetStorage: (seed = true) => {
    memoryStorage.clear(seed);
    get().initialize();
  },
}));
