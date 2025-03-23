
import { createClient } from '@supabase/supabase-js';

// These are public keys that can be included in the client-side code
// For any sensitive operations, use edge functions with server-side keys
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

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
