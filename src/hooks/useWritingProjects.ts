import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/supabase';
import { Database } from '../types/database';

type WritingProject = Database['public']['Tables']['writing_projects']['Row'];
type WritingProjectInsert = Database['public']['Tables']['writing_projects']['Insert'];
type WritingProjectUpdate = Database['public']['Tables']['writing_projects']['Update'];

export function useWritingProjects() {
  const { user } = useAuth();
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
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = `Este é um conteúdo gerado pela IA para "${prompt}" usando a ferramenta ${toolType}. 

O conteúdo seria personalizado baseado na ferramenta específica e no prompt fornecido. Por exemplo:

- Para artigos: estrutura completa com introdução, desenvolvimento e conclusão
- Para e-mails: tom profissional com call-to-action
- Para redes sociais: linguagem envolvente com hashtags
- Para produtos: descrições persuasivas com benefícios

Esta é uma demonstração do funcionamento da plataforma WriteAI Pro.`;

      // Log usage analytics
      await db.logUsage(user.id, 'content_generated', {
        tool_used: toolType,
        words_generated: mockContent.split(' ').length,
        characters_generated: mockContent.length
      });

      return mockContent;
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
    refreshProjects: loadProjects
  };
}