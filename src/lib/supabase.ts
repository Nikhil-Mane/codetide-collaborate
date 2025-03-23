
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
// NOTE: In a production environment, you should use environment variables
// For development, you can replace these with your actual Supabase project details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
};

export type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  group_id: string;
  language: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type ProjectFile = {
  id: string;
  project_id: string;
  path: string;
  content: string;
  is_directory: boolean;
  created_at: string;
  updated_at: string;
};

/*
Database Schema:

- users:
  - id (UUID, PK)
  - name (TEXT)
  - email (TEXT, UNIQUE)
  - avatar (TEXT, nullable)
  - created_at (TIMESTAMP)

- groups:
  - id (UUID, PK)
  - name (TEXT)
  - description (TEXT, nullable)
  - owner_id (UUID, FK to users.id)
  - created_at (TIMESTAMP)

- group_members:
  - id (UUID, PK)
  - group_id (UUID, FK to groups.id)
  - user_id (UUID, FK to users.id)
  - role (TEXT: 'admin', 'moderator', 'member')
  - joined_at (TIMESTAMP)

- projects:
  - id (UUID, PK)
  - name (TEXT)
  - description (TEXT, nullable)
  - group_id (UUID, FK to groups.id)
  - language (TEXT)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- chat_messages:
  - id (UUID, PK)
  - group_id (UUID, FK to groups.id)
  - user_id (UUID, FK to users.id)
  - content (TEXT)
  - created_at (TIMESTAMP)

- project_files:
  - id (UUID, PK)
  - project_id (UUID, FK to projects.id)
  - path (TEXT)
  - content (TEXT, nullable)
  - is_directory (BOOLEAN)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
*/
