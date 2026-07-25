import { supabase } from './client';

export type BucketName = 'avatars' | 'images' | 'voice-notes' | 'documents' | 'gallery' | 'backups';

export const storageService = {
  // Upload file to bucket
  async uploadFile(bucket: BucketName, filePath: string, file: File | Blob, options?: { cacheControl?: string; upsert?: boolean }) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: options?.cacheControl || '3600',
          upsert: options?.upsert ?? true,
        });

      if (error) throw error;

      const publicUrl = this.getPublicUrl(bucket, data.path);
      return { path: data.path, publicUrl };
    } catch (err) {
      console.error(`Storage upload error in ${bucket}:`, err);
      throw err;
    }
  },

  // Get Public URL for a file
  getPublicUrl(bucket: BucketName, filePath: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },

  // Delete file from bucket
  async deleteFile(bucket: BucketName, filePaths: string[]) {
    try {
      const { data, error } = await supabase.storage.from(bucket).remove(filePaths);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Storage delete error in ${bucket}:`, err);
      throw err;
    }
  },

  // Move / Rename file within bucket
  async moveFile(bucket: BucketName, fromPath: string, toPath: string) {
    try {
      const { data, error } = await supabase.storage.from(bucket).move(fromPath, toPath);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Storage move error in ${bucket}:`, err);
      throw err;
    }
  },

  // Download file as Blob
  async downloadFile(bucket: BucketName, filePath: string): Promise<Blob> {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(filePath);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Storage download error in ${bucket}:`, err);
      throw err;
    }
  },

  // List files in bucket directory
  async listFiles(bucket: BucketName, path: string = '') {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(path);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Storage list error in ${bucket}:`, err);
      return [];
    }
  },
};
