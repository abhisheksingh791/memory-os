export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ProfileRow {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface FolderRow {
  id: string
  user_id: string
  name: string
  parent_id: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export interface CollectionRow {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  icon: string
  created_at: string
  updated_at: string
}

export interface TagRow {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface NoteRow {
  id: string
  user_id: string
  folder_id: string | null
  collection_id: string | null
  title: string
  content: string
  type: 'rich' | 'markdown' | 'quick'
  color: string
  tags: string[]
  is_favorite: boolean
  is_archived: boolean
  is_pinned: boolean
  is_trash: boolean
  created_at: string
  updated_at: string
}

export interface TaskRow {
  id: string
  user_id: string
  folder_id: string | null
  collection_id: string | null
  title: string
  description: string | null
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
  subtasks: Json
  tags: string[]
  is_favorite: boolean
  is_archived: boolean
  is_trash: boolean
  created_at: string
  updated_at: string
}

export interface JournalRow {
  id: string
  user_id: string
  date: string
  content: string
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible'
  weather: string | null
  tags: string[]
  prompt: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface BookmarkRow {
  id: string
  user_id: string
  collection_id: string | null
  title: string
  url: string
  description: string | null
  favicon: string | null
  tags: string[]
  is_favorite: boolean
  is_archived: boolean
  is_trash: boolean
  created_at: string
  updated_at: string
}

export interface FileRow {
  id: string
  user_id: string
  folder_id: string | null
  name: string
  size_bytes: number
  mime_type: string | null
  storage_path: string
  bucket: string
  public_url: string | null
  created_at: string
  updated_at: string
}

export interface PDFRow {
  id: string
  user_id: string
  file_id: string | null
  title: string
  size: string
  total_pages: number
  highlights: Json
  tags: string[]
  file_url: string | null
  created_at: string
  updated_at: string
}

export interface VoiceNoteRow {
  id: string
  user_id: string
  file_id: string | null
  title: string
  duration: number
  audio_url: string | null
  transcript: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface GalleryRow {
  id: string
  user_id: string
  file_id: string | null
  title: string
  url: string
  aspect_ratio: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface FavoriteRow {
  id: string
  user_id: string
  item_type: string
  item_id: string
  created_at: string
}

export interface ActivityRow {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  details: Json
  created_at: string
}

export interface KnowledgeNodeRow {
  id: string
  user_id: string
  label: string
  type: 'note' | 'collection' | 'tag' | 'task'
  color: string
  val: number
  data: Json
  entity_id: string | null
  created_at: string
  updated_at: string
}

export interface KnowledgeEdgeRow {
  id: string
  user_id: string
  source: string
  target: string
  label: string | null
  created_at: string
}

export interface MindMapRow {
  id: string
  user_id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface MindMapNodeRow {
  id: string
  user_id: string
  mind_map_id: string | null
  type: string
  position_x: number
  position_y: number
  data: Json
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface MindMapEdgeRow {
  id: string
  user_id: string
  mind_map_id: string | null
  source: string
  target: string
  animated: boolean
  created_at: string
}

export interface CalendarEventRow {
  id: string
  user_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string | null
  all_day: boolean
  color: string
  entity_type: string | null
  entity_id: string | null
  created_at: string
  updated_at: string
}

export interface NotificationRow {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'reminder'
  is_read: boolean
  link: string | null
  created_at: string
}

export interface SettingRow {
  id: string
  user_id: string
  theme: 'dark' | 'light' | 'system'
  accent_color: string
  auto_save: boolean
  compact_view: boolean
  language: string
  font_size: 'small' | 'medium' | 'large'
  high_contrast: boolean
  enable_animations: boolean
  created_at: string
  updated_at: string
}

export interface BackupRow {
  id: string
  user_id: string
  file_name: string
  file_size: number
  storage_path: string
  created_at: string
}

export interface TrashRow {
  id: string
  user_id: string
  item_type: string
  item_id: string
  title: string
  deleted_at: string
}

export interface SharedLinkRow {
  id: string
  user_id: string
  item_type: string
  item_id: string
  share_token: string
  is_public: boolean
  expires_at: string | null
  created_at: string
}

export interface DeviceRow {
  id: string
  user_id: string
  device_name: string
  device_type: string
  last_active_at: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Omit<ProfileRow, 'created_at' | 'updated_at'>; Update: Partial<ProfileRow> }
      folders: { Row: FolderRow; Insert: Omit<FolderRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<FolderRow> }
      collections: { Row: CollectionRow; Insert: Omit<CollectionRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<CollectionRow> }
      tags: { Row: TagRow; Insert: Omit<TagRow, 'id' | 'created_at'>; Update: Partial<TagRow> }
      notes: { Row: NoteRow; Insert: Omit<NoteRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<NoteRow> }
      note_tags: { Row: { id: string; user_id: string; note_id: string; tag_id: string }; Insert: Omit<{ id: string; user_id: string; note_id: string; tag_id: string }, 'id'>; Update: Partial<{ id: string; user_id: string; note_id: string; tag_id: string }> }
      tasks: { Row: TaskRow; Insert: Omit<TaskRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<TaskRow> }
      journal_entries: { Row: JournalRow; Insert: Omit<JournalRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<JournalRow> }
      bookmarks: { Row: BookmarkRow; Insert: Omit<BookmarkRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<BookmarkRow> }
      files: { Row: FileRow; Insert: Omit<FileRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<FileRow> }
      pdfs: { Row: PDFRow; Insert: Omit<PDFRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<PDFRow> }
      voice_notes: { Row: VoiceNoteRow; Insert: Omit<VoiceNoteRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<VoiceNoteRow> }
      gallery: { Row: GalleryRow; Insert: Omit<GalleryRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<GalleryRow> }
      favorites: { Row: FavoriteRow; Insert: Omit<FavoriteRow, 'id' | 'created_at'>; Update: Partial<FavoriteRow> }
      recent_activity: { Row: ActivityRow; Insert: Omit<ActivityRow, 'id' | 'created_at'>; Update: Partial<ActivityRow> }
      knowledge_nodes: { Row: KnowledgeNodeRow; Insert: Omit<KnowledgeNodeRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<KnowledgeNodeRow> }
      knowledge_edges: { Row: KnowledgeEdgeRow; Insert: Omit<KnowledgeEdgeRow, 'id' | 'created_at'>; Update: Partial<KnowledgeEdgeRow> }
      mind_maps: { Row: MindMapRow; Insert: Omit<MindMapRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<MindMapRow> }
      mind_map_nodes: { Row: MindMapNodeRow; Insert: Omit<MindMapNodeRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<MindMapNodeRow> }
      mind_map_edges: { Row: MindMapEdgeRow; Insert: Omit<MindMapEdgeRow, 'id' | 'created_at'>; Update: Partial<MindMapEdgeRow> }
      calendar_events: { Row: CalendarEventRow; Insert: Omit<CalendarEventRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<CalendarEventRow> }
      notifications: { Row: NotificationRow; Insert: Omit<NotificationRow, 'id' | 'created_at'>; Update: Partial<NotificationRow> }
      settings: { Row: SettingRow; Insert: Omit<SettingRow, 'id' | 'created_at' | 'updated_at'>; Update: Partial<SettingRow> }
      backups: { Row: BackupRow; Insert: Omit<BackupRow, 'id' | 'created_at'>; Update: Partial<BackupRow> }
      trash: { Row: TrashRow; Insert: Omit<TrashRow, 'id' | 'deleted_at'>; Update: Partial<TrashRow> }
      shared_links: { Row: SharedLinkRow; Insert: Omit<SharedLinkRow, 'id' | 'created_at'>; Update: Partial<SharedLinkRow> }
      devices: { Row: DeviceRow; Insert: Omit<DeviceRow, 'id' | 'created_at'>; Update: Partial<DeviceRow> }
    }
  }
}
