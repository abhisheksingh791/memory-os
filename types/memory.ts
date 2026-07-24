export type NoteType = 'rich' | 'markdown' | 'quick';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  tags: string[];
  collectionId?: string;
  color?: string;
  isFavorite: boolean;
  isArchived: boolean;
  isPinned: boolean;
  isTrash: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  subtasks: SubTask[];
  tags: string[];
  collectionId?: string;
  isFavorite: boolean;
  isArchived: boolean;
  isTrash: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JournalMood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood: JournalMood;
  weather?: string;
  tags: string[];
  prompt?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  tags: string[];
  collectionId?: string;
  isFavorite: boolean;
  isArchived: boolean;
  isTrash: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'note' | 'collection' | 'tag' | 'task';
  color: string;
  val: number;
  data?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface MindMapNodeData {
  label: string;
  color?: string;
  [key: string]: any;
}

export interface MindMapNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: MindMapNodeData;
  parentId?: string;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface VoiceNote {
  id: string;
  title: string;
  duration: number; // in seconds
  audioUrl?: string;
  transcript: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

export interface PDFAnnotation {
  id: string;
  page: number;
  highlightText: string;
  note?: string;
  createdAt: string;
}

export interface PDFDoc {
  id: string;
  title: string;
  size: string;
  totalPages: number;
  highlights: PDFAnnotation[];
  tags: string[];
  fileUrl?: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  aspectRatio?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  autoSave: boolean;
  compactView: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  enableAnimations: boolean;
}

export type EntityType = 
  | 'notes' 
  | 'tasks' 
  | 'journals' 
  | 'bookmarks' 
  | 'collections' 
  | 'graphNodes' 
  | 'graphEdges' 
  | 'mindMapNodes' 
  | 'mindMapEdges'
  | 'voiceNotes' 
  | 'pdfDocs' 
  | 'mediaItems' 
  | 'settings';

export interface StorageData {
  notes: Note[];
  tasks: Task[];
  journals: JournalEntry[];
  bookmarks: Bookmark[];
  collections: Collection[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  mindMapNodes: MindMapNode[];
  mindMapEdges: MindMapEdge[];
  voiceNotes: VoiceNote[];
  pdfDocs: PDFDoc[];
  mediaItems: MediaItem[];
  settings: UserSettings;
}
