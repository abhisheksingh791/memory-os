import { supabase } from '../lib/supabase/client';
import { UserSettings } from '../types/memory';
import { SettingRow } from '../lib/supabase/types';

export const settingsService = {
  async fetchSettings(userId: string): Promise<UserSettings> {
    const { data } = await (supabase.from('settings') as any)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!data) {
      return {
        theme: 'dark',
        accentColor: '#6366F1',
        autoSave: true,
        compactView: false,
        language: 'en',
        fontSize: 'medium',
        highContrast: false,
        enableAnimations: true,
      };
    }

    return {
      theme: data.theme as any,
      accentColor: data.accent_color,
      autoSave: data.auto_save,
      compactView: data.compact_view,
      language: data.language,
      fontSize: data.font_size as any,
      highContrast: data.high_contrast,
      enableAnimations: data.enable_animations,
    };
  },

  async updateSettings(userId: string, patch: Partial<UserSettings>): Promise<UserSettings> {
    const updates: Partial<SettingRow> = {};
    if (patch.theme !== undefined) updates.theme = patch.theme;
    if (patch.accentColor !== undefined) updates.accent_color = patch.accentColor;
    if (patch.autoSave !== undefined) updates.auto_save = patch.autoSave;
    if (patch.compactView !== undefined) updates.compact_view = patch.compactView;
    if (patch.language !== undefined) updates.language = patch.language;
    if (patch.fontSize !== undefined) updates.font_size = patch.fontSize;
    if (patch.highContrast !== undefined) updates.high_contrast = patch.highContrast;
    if (patch.enableAnimations !== undefined) updates.enable_animations = patch.enableAnimations;

    const { data, error } = await (supabase.from('settings') as any)
      .upsert({ user_id: userId, ...updates })
      .select('*')
      .single();

    if (error) throw error;
    return {
      theme: data.theme as any,
      accentColor: data.accent_color,
      autoSave: data.auto_save,
      compactView: data.compact_view,
      language: data.language,
      fontSize: data.font_size as any,
      highContrast: data.high_contrast,
      enableAnimations: data.enable_animations,
    };
  },
};
