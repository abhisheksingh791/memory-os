-- ====================================================================
-- SEED DATA FOR MEMORY OS SUPABASE DATABASE
-- ====================================================================

-- Insert sample profiles (Only for local development/testing)
-- Note: Replace demo-user-id with actual auth user ID if seeding directly in SQL Editor

DO $$
DECLARE
  demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
  col_work_id UUID := gen_random_uuid();
  col_personal_id UUID := gen_random_uuid();
  folder_projects_id UUID := gen_random_uuid();
  node1_id UUID := gen_random_uuid();
  node2_id UUID := gen_random_uuid();
  mm_id UUID := gen_random_uuid();
  mm_node1_id UUID := gen_random_uuid();
  mm_node2_id UUID := gen_random_uuid();
BEGIN

  -- Profiles & Settings
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (demo_user_id, 'demo@memoryos.app', 'Memory OS Demo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.settings (user_id, theme, accent_color, auto_save, compact_view, language, font_size, high_contrast, enable_animations)
  VALUES (demo_user_id, 'dark', '#6366F1', true, false, 'en', 'medium', false, true)
  ON CONFLICT (user_id) DO NOTHING;

  -- Collections
  INSERT INTO public.collections (id, user_id, name, description, color, icon)
  VALUES 
    (col_work_id, demo_user_id, 'Work & Engineering', 'Software architecture, specs, and sprints', '#6366F1', 'briefcase'),
    (col_personal_id, demo_user_id, 'Personal Growth', 'Life goals, books, and reflections', '#EC4899', 'heart')
  ON CONFLICT DO NOTHING;

  -- Folders
  INSERT INTO public.folders (id, user_id, name, color)
  VALUES (folder_projects_id, demo_user_id, 'Active Projects', '#10B981')
  ON CONFLICT DO NOTHING;

  -- Tags
  INSERT INTO public.tags (user_id, name, color)
  VALUES 
    (demo_user_id, 'architecture', '#6366F1'),
    (demo_user_id, 'pwa', '#10B981'),
    (demo_user_id, 'react', '#3B82F6'),
    (demo_user_id, 'supabase', '#00C853')
  ON CONFLICT DO NOTHING;

  -- Notes
  INSERT INTO public.notes (user_id, folder_id, collection_id, title, content, type, color, tags, is_favorite, is_pinned)
  VALUES 
    (demo_user_id, folder_projects_id, col_work_id, 'Memory OS Architecture Blueprint', 'Memory OS is built using Next.js 15, Supabase PostgreSQL with RLS, Zustand state synchronization, and Local-First offline persistence.', 'markdown', '#6366F1', ARRAY['architecture', 'supabase', 'pwa'], true, true),
    (demo_user_id, folder_projects_id, col_work_id, 'Supabase Realtime & RLS Strategy', 'Row Level Security ensures users can only query their own notes, tasks, and media assets. Realtime channels subscribe to tables.', 'rich', '#EC4899', ARRAY['supabase', 'security'], true, false)
  ON CONFLICT DO NOTHING;

  -- Tasks
  INSERT INTO public.tasks (user_id, collection_id, title, description, status, priority, tags, subtasks, is_favorite)
  VALUES 
    (demo_user_id, col_work_id, 'Finalize Supabase Integration', 'Implement client.ts, server.ts, storage.ts, and Zustand sync stores.', 'in-progress', 'urgent', ARRAY['supabase', 'dev'], '[{"id": "s1", "title": "Create SQL Migrations", "completed": true}, {"id": "s2", "title": "Connect Zustand Stores", "completed": true}]'::jsonb, true),
    (demo_user_id, col_personal_id, 'Review Daily Reflection Logs', 'Check mood tracking trends for July.', 'todo', 'medium', ARRAY['life'], '[]'::jsonb, false)
  ON CONFLICT DO NOTHING;

  -- Journal Entries
  INSERT INTO public.journal_entries (user_id, date, content, mood, weather, tags, prompt)
  VALUES 
    (demo_user_id, CURRENT_DATE, 'Successfully transformed Memory OS into a full production app powered by Supabase!', 'great', 'Sunny 25°C', ARRAY['milestone', 'focus'], 'What major achievement did you accomplish today?')
  ON CONFLICT DO NOTHING;

  -- Bookmarks
  INSERT INTO public.bookmarks (user_id, collection_id, title, url, description, tags, is_favorite)
  VALUES 
    (demo_user_id, col_work_id, 'Supabase Next.js Docs', 'https://supabase.com/docs/guides/auth/auth-helpers/nextjs', 'Official Supabase Auth & SSR guide for Next.js App Router.', ARRAY['docs', 'supabase'], true)
  ON CONFLICT DO NOTHING;

  -- Knowledge Graph Nodes & Edges
  INSERT INTO public.knowledge_nodes (id, user_id, label, type, color, val)
  VALUES 
    (node1_id, demo_user_id, 'Memory OS Core', 'note', '#6366F1', 10),
    (node2_id, demo_user_id, 'Supabase Backend', 'collection', '#00C853', 8)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.knowledge_edges (user_id, source, target, label)
  VALUES 
    (demo_user_id, node1_id, node2_id, 'Powered By')
  ON CONFLICT DO NOTHING;

  -- Mind Maps
  INSERT INTO public.mind_maps (id, user_id, title, description)
  VALUES 
    (mm_id, demo_user_id, 'SaaS Product Architecture', 'Mental map of client, server, auth, and database')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.mind_map_nodes (id, user_id, mind_map_id, position_x, position_y, data)
  VALUES 
    (mm_node1_id, demo_user_id, mm_id, 0, 0, '{"label": "Memory OS App"}'::jsonb),
    (mm_node2_id, demo_user_id, mm_id, 200, 100, '{"label": "Supabase Auth & Storage"}'::jsonb)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.mind_map_edges (user_id, mind_map_id, source, target)
  VALUES 
    (demo_user_id, mm_id, mm_node1_id, mm_node2_id)
  ON CONFLICT DO NOTHING;

  -- Notifications
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES 
    (demo_user_id, 'Welcome to Memory OS', 'Your local-first vault is connected to Supabase Cloud Engine.', 'success')
  ON CONFLICT DO NOTHING;

END $$;
