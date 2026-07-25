import { supabase } from '../lib/supabase/client';
import { storageService, BucketName } from '../lib/supabase/storage';
import { VoiceNote, PDFDoc, MediaItem } from '../types/memory';
import { VoiceNoteRow, PDFRow, GalleryRow } from '../lib/supabase/types';

export const filesService = {
  // Voice Notes
  async fetchVoiceNotes(userId: string): Promise<VoiceNote[]> {
    const { data } = await (supabase.from('voice_notes') as any).select('*').eq('user_id', userId);
    return (data || []).map((row: VoiceNoteRow) => ({
      id: row.id,
      title: row.title,
      duration: row.duration,
      audioUrl: row.audio_url || undefined,
      transcript: row.transcript,
      tags: row.tags || [],
      isFavorite: row.is_favorite,
      createdAt: row.created_at,
    }));
  },

  async uploadVoiceNote(userId: string, title: string, duration: number, audioFile?: File | Blob, transcript: string = '', tags: string[] = []): Promise<VoiceNote> {
    let audioUrl = '';
    if (audioFile) {
      const fileName = `${userId}/${Date.now()}_voice.mp3`;
      const res = await storageService.uploadFile('voice-notes', fileName, audioFile);
      audioUrl = res.publicUrl;
    }

    const { data, error } = await (supabase.from('voice_notes') as any)
      .insert({
        user_id: userId,
        title,
        duration,
        audio_url: audioUrl,
        transcript,
        tags,
      })
      .select('*')
      .single();

    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      duration: data.duration,
      audioUrl: data.audio_url || undefined,
      transcript: data.transcript,
      tags: data.tags || [],
      isFavorite: data.is_favorite,
      createdAt: data.created_at,
    };
  },

  async deleteVoiceNote(userId: string, id: string): Promise<void> {
    await (supabase.from('voice_notes') as any).delete().eq('id', id).eq('user_id', userId);
  },

  // PDF Docs
  async fetchPDFDocs(userId: string): Promise<PDFDoc[]> {
    const { data } = await (supabase.from('pdfs') as any).select('*').eq('user_id', userId);
    return (data || []).map((row: PDFRow) => ({
      id: row.id,
      title: row.title,
      size: row.size,
      totalPages: row.total_pages,
      highlights: (row.highlights as any) || [],
      tags: row.tags || [],
      fileUrl: row.file_url || undefined,
      createdAt: row.created_at,
    }));
  },

  async uploadPDFDoc(userId: string, title: string, pdfFile: File, totalPages: number = 1, tags: string[] = []): Promise<PDFDoc> {
    const fileName = `${userId}/${Date.now()}_${pdfFile.name}`;
    const res = await storageService.uploadFile('documents', fileName, pdfFile);

    const sizeStr = `${(pdfFile.size / 1024).toFixed(1)} KB`;

    const { data, error } = await (supabase.from('pdfs') as any)
      .insert({
        user_id: userId,
        title,
        size: sizeStr,
        total_pages: totalPages,
        highlights: [],
        tags,
        file_url: res.publicUrl,
      })
      .select('*')
      .single();

    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      size: data.size,
      totalPages: data.total_pages,
      highlights: [],
      tags: data.tags || [],
      fileUrl: data.file_url || undefined,
      createdAt: data.created_at,
    };
  },

  // Gallery / Media Items
  async fetchMediaItems(userId: string): Promise<MediaItem[]> {
    const { data } = await (supabase.from('gallery') as any).select('*').eq('user_id', userId);
    return (data || []).map((row: GalleryRow) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      aspectRatio: row.aspect_ratio,
      tags: row.tags || [],
      isFavorite: row.is_favorite,
      createdAt: row.created_at,
    }));
  },

  async uploadMediaItem(userId: string, title: string, imageFile: File, aspectRatio: string = '1:1', tags: string[] = []): Promise<MediaItem> {
    const fileName = `${userId}/${Date.now()}_${imageFile.name}`;
    const res = await storageService.uploadFile('gallery', fileName, imageFile);

    const { data, error } = await (supabase.from('gallery') as any)
      .insert({
        user_id: userId,
        title,
        url: res.publicUrl,
        aspect_ratio: aspectRatio,
        tags,
      })
      .select('*')
      .single();

    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      aspectRatio: data.aspect_ratio,
      tags: data.tags || [],
      isFavorite: data.is_favorite,
      createdAt: data.created_at,
    };
  },

  async deleteMediaItem(userId: string, id: string): Promise<void> {
    await (supabase.from('gallery') as any).delete().eq('id', id).eq('user_id', userId);
  },
};
