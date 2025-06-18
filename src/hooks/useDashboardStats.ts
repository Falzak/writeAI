import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/supabase';

export interface DashboardStats {
  totalProjects: number;
  totalWords: number;
  completedProjects: number;
  draftProjects: number;
  audioGenerations: number;
  weeklyProjects: number;
  monthlyWords: number;
  averageWordsPerProject: number;
  productivityScore: number;
  topTools: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    time: string;
    status: string;
  }>;
  weeklyActivity: Array<{
    day: string;
    projects: number;
    words: number;
  }>;
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [projectsResult, analyticsResult, audioResult] = await Promise.all([
        db.getProjects(user.id),
        db.getUsageAnalytics(user.id, 30),
        db.getAudioGenerations(user.id)
      ]);

      const projects = projectsResult.data || [];
      const analytics = analyticsResult.data || [];
      const audioGens = audioResult.data || [];

      // Calculate date ranges
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Basic stats
      const totalProjects = projects.length;
      const totalWords = projects.reduce((acc, p) => acc + (p.word_count || 0), 0);
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const draftProjects = projects.filter(p => p.status === 'draft').length;
      const weeklyProjects = projects.filter(p => 
        new Date(p.created_at) >= oneWeekAgo
      ).length;
      const monthlyWords = projects
        .filter(p => new Date(p.created_at) >= oneMonthAgo)
        .reduce((acc, p) => acc + (p.word_count || 0), 0);
      const averageWordsPerProject = totalProjects > 0 ? Math.round(totalWords / totalProjects) : 0;

      // Productivity score calculation
      const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
      const wordsPerDay = monthlyWords / 30;
      const projectsPerWeek = weeklyProjects;
      const productivityScore = Math.min(100, Math.round(
        (completionRate * 0.4) + 
        (Math.min(wordsPerDay / 100, 1) * 30) + 
        (Math.min(projectsPerWeek / 5, 1) * 30)
      ));

      // Tool usage analysis
      const toolCounts = projects.reduce((acc, project) => {
        const tool = project.tool_type;
        acc[tool] = (acc[tool] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topTools = Object.entries(toolCounts)
        .map(([tool, count]) => ({
          name: getToolDisplayName(tool),
          count,
          percentage: Math.round((count / totalProjects) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent activity
      const recentActivity = projects
        .slice(0, 10)
        .map(project => ({
          id: project.id,
          type: project.tool_type,
          title: project.title,
          time: formatRelativeTime(project.updated_at),
          status: project.status
        }));

      // Weekly activity chart data
      const weeklyActivity = generateWeeklyActivity(projects);

      setStats({
        totalProjects,
        totalWords,
        completedProjects,
        draftProjects,
        audioGenerations: audioGens.length,
        weeklyProjects,
        monthlyWords,
        averageWordsPerProject,
        productivityScore,
        topTools,
        recentActivity,
        weeklyActivity
      });

    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    if (user) {
      loadStats();
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats
  };
}

function getToolDisplayName(toolType: string): string {
  const toolNames: Record<string, string> = {
    'rewrite': 'Reescrita',
    'article': 'Artigos',
    'email': 'E-mails',
    'social': 'Redes Sociais',
    'product': 'Produtos',
    'correction': 'Correção',
    'tts': 'Text-to-Speech',
    'audiobook': 'Audiobooks'
  };
  return toolNames[toolType] || toolType;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Agora mesmo';
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return date.toLocaleDateString('pt-BR');
}

function generateWeeklyActivity(projects: any[]): Array<{day: string, projects: number, words: number}> {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const now = new Date();
  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayProjects = projects.filter(p => {
      const projectDate = new Date(p.created_at);
      return projectDate.toDateString() === date.toDateString();
    });

    weeklyData.push({
      day: days[date.getDay()],
      projects: dayProjects.length,
      words: dayProjects.reduce((acc, p) => acc + (p.word_count || 0), 0)
    });
  }

  return weeklyData;
}