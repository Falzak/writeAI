import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Profile operations
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Writing projects operations
  getProjects: async (userId: string) => {
    const { data, error } = await supabase
      .from('writing_projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  createProject: async (project: any) => {
    const { data, error } = await supabase
      .from('writing_projects')
      .insert(project)
      .select()
      .single();
    return { data, error };
  },

  updateProject: async (projectId: string, updates: any) => {
    const { data, error } = await supabase
      .from('writing_projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    return { data, error };
  },

  deleteProject: async (projectId: string) => {
    const { error } = await supabase
      .from('writing_projects')
      .delete()
      .eq('id', projectId);
    return { error };
  },

  // Audio generations operations
  getAudioGenerations: async (userId: string) => {
    const { data, error } = await supabase
      .from('audio_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createAudioGeneration: async (audioData: any) => {
    const { data, error } = await supabase
      .from('audio_generations')
      .insert(audioData)
      .select()
      .single();
    return { data, error };
  },

  // Templates operations
  getUserTemplates: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getPublicTemplates: async () => {
    const { data, error } = await supabase
      .from('user_templates')
      .select('*')
      .eq('is_public', true)
      .order('usage_count', { ascending: false });
    return { data, error };
  },

  createTemplate: async (template: any) => {
    const { data, error } = await supabase
      .from('user_templates')
      .insert(template)
      .select()
      .single();
    return { data, error };
  },

  // Analytics operations
  logUsage: async (userId: string, actionType: string, metadata: any = {}) => {
    const { error } = await supabase
      .from('usage_analytics')
      .insert({
        user_id: userId,
        action_type: actionType,
        ...metadata
      });
    return { error };
  },

  getUsageAnalytics: async (userId: string, days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('usage_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    return { data, error };
  }
};