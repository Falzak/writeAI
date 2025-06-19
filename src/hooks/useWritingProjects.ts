import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/supabase';
import { edgeFunctions } from '../lib/edgeFunctions';
import { Database } from '../types/database';

type WritingProject = Database['public']['Tables']['writing_projects']['Row'];
type WritingProjectInsert = Database['public']['Tables']['writing_projects']['Insert'];
type WritingProjectUpdate = Database['public']['Tables']['writing_projects']['Update'];

export function useWritingProjects() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<WritingProject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await db.getProjects(user.id);
      if (error) {
        console.error('Error loading projects:', error);
      } else {
        setProjects(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (title: string, toolType: string) => {
    if (!user) return null;

    const projectData: WritingProjectInsert = {
      user_id: user.id,
      title,
      tool_type: toolType,
      content: '',
      status: 'draft'
    };

    try {
      const { data, error } = await db.createProject(projectData);
      if (error) {
        console.error('Error creating project:', error);
        return null;
      }
      
      if (data) {
        setProjects(prev => [data, ...prev]);
        
        // Log usage analytics
        await db.logUsage(user.id, 'project_created', {
          tool_used: toolType
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  };

  const updateProject = async (projectId: string, updates: WritingProjectUpdate) => {
    try {
      const { data, error } = await db.updateProject(projectId, updates);
      if (error) {
        console.error('Error updating project:', error);
        return;
      }
      
      if (data) {
        setProjects(prev => prev.map(p => p.id === projectId ? data : p));
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await db.deleteProject(projectId);
      if (error) {
        console.error('Error deleting project:', error);
        return;
      }
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const generateContent = async (prompt: string, toolType: string) => {
    if (!user) return '';
    
    setLoading(true);
    try {
      // Check usage limits for free users
      if (profile?.plan_type === 'free') {
        const currentUsage = profile.api_usage_count || 0;
        const limit = profile.monthly_usage_limit || 10000;
        
        if (currentUsage >= limit) {
          throw new Error('Monthly usage limit reached. Please upgrade to continue.');
        }
      }

      // Call the Edge Function to generate content
      const response = await edgeFunctions.generateText({
        prompt,
        toolType,
        language: 'pt-BR',
        maxTokens: 1000
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate content');
      }

      // Update user's API usage count
      if (profile) {
        await db.updateProfile(user.id, {
          api_usage_count: (profile.api_usage_count || 0) + response.wordCount
        });
      }

      // Log usage analytics
      await db.logUsage(user.id, 'content_generated', {
        tool_used: toolType,
        words_generated: response.wordCount,
        characters_generated: response.characterCount
      });

      return response.content;
    } finally {
      setLoading(false);
    }
  };

  const generateAudio = async (text: string, voiceId: string, voiceName: string, settings?: any) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Check if user has access to TTS
      if (profile?.plan_type === 'free') {
        // Free users might have limited TTS access
        const audioGenerations = await db.getAudioGenerations(user.id);
        if (audioGenerations.data && audioGenerations.data.length >= 5) {
          throw new Error('Free plan TTS limit reached. Please upgrade for unlimited access.');
        }
      }

      // Call the Edge Function to generate audio
      const response = await edgeFunctions.generateAudio({
        text,
        voiceId,
        voiceName,
        settings
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate audio');
      }

      // Save audio generation record
      const audioData = {
        user_id: user.id,
        text_content: text,
        voice_id: voiceId,
        voice_name: voiceName,
        voice_settings: settings || {},
        audio_url: response.audioUrl,
        duration_seconds: response.duration,
        file_size_bytes: response.fileSize,
        status: 'completed' as const
      };

      await db.createAudioGeneration(audioData);

      // Log usage analytics
      await db.logUsage(user.id, 'audio_generated', {
        tool_used: 'text-to-speech',
        audio_seconds_generated: response.duration || 0
      });

      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    generateContent,
    generateAudio,
    refreshProjects: loadProjects
  };
}