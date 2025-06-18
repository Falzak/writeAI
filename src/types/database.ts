export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company: string | null;
          job_title: string | null;
          bio: string | null;
          avatar_url: string | null;
          plan_type: 'free' | 'premium' | 'enterprise';
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_end_date: string | null;
          api_usage_count: number;
          monthly_usage_limit: number;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company?: string | null;
          job_title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          plan_type?: 'free' | 'premium' | 'enterprise';
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_end_date?: string | null;
          api_usage_count?: number;
          monthly_usage_limit?: number;
          preferences?: any;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          company?: string | null;
          job_title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          plan_type?: 'free' | 'premium' | 'enterprise';
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_end_date?: string | null;
          api_usage_count?: number;
          monthly_usage_limit?: number;
          preferences?: any;
        };
      };
      writing_projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          tool_type: string;
          prompt: string | null;
          status: 'draft' | 'completed' | 'archived';
          word_count: number;
          character_count: number;
          language: string;
          tags: string[];
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          content?: string;
          tool_type: string;
          prompt?: string | null;
          status?: 'draft' | 'completed' | 'archived';
          language?: string;
          tags?: string[];
          metadata?: any;
        };
        Update: {
          title?: string;
          content?: string;
          tool_type?: string;
          prompt?: string | null;
          status?: 'draft' | 'completed' | 'archived';
          language?: string;
          tags?: string[];
          metadata?: any;
        };
      };
      audio_generations: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          text_content: string;
          voice_id: string;
          voice_name: string;
          voice_settings: any;
          audio_url: string | null;
          duration_seconds: number | null;
          file_size_bytes: number | null;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          project_id?: string | null;
          text_content: string;
          voice_id: string;
          voice_name: string;
          voice_settings?: any;
          audio_url?: string | null;
          duration_seconds?: number | null;
          file_size_bytes?: number | null;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
        };
        Update: {
          text_content?: string;
          voice_id?: string;
          voice_name?: string;
          voice_settings?: any;
          audio_url?: string | null;
          duration_seconds?: number | null;
          file_size_bytes?: number | null;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
        };
      };
      user_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          category: string;
          content: string;
          variables: string[];
          is_public: boolean;
          usage_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          description?: string | null;
          category: string;
          content: string;
          variables?: string[];
          is_public?: boolean;
          usage_count?: number;
        };
        Update: {
          name?: string;
          description?: string | null;
          category?: string;
          content?: string;
          variables?: string[];
          is_public?: boolean;
          usage_count?: number;
        };
      };
      usage_analytics: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          tool_used: string | null;
          words_generated: number;
          characters_generated: number;
          audio_seconds_generated: number;
          metadata: any;
          created_at: string;
        };
        Insert: {
          user_id: string;
          action_type: string;
          tool_used?: string | null;
          words_generated?: number;
          characters_generated?: number;
          audio_seconds_generated?: number;
          metadata?: any;
        };
        Update: {
          action_type?: string;
          tool_used?: string | null;
          words_generated?: number;
          characters_generated?: number;
          audio_seconds_generated?: number;
          metadata?: any;
        };
      };
      api_configurations: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          api_key_encrypted: string | null;
          is_active: boolean;
          last_used_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          provider: string;
          api_key_encrypted?: string | null;
          is_active?: boolean;
          last_used_at?: string | null;
        };
        Update: {
          provider?: string;
          api_key_encrypted?: string | null;
          is_active?: boolean;
          last_used_at?: string | null;
        };
      };
    };
  };
}