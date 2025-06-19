import React, { useEffect, useState } from 'react';
import { TrendingUp, FileText, Volume2, Target, Award, Calendar, Zap, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/supabase';

interface DashboardStats {
  totalProjects: number;
  totalWords: number;
  completedProjects: number;
  audioGenerations: number;
  weeklyProjects: number;
  monthlyWords: number;
  averageWordsPerProject: number;
  productivityScore: number;
}

interface RecentActivity {
  type: string;
  title: string;
  time: string;
  status: string;
  tool_type: string;
}

interface ToolUsage {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalWords: 0,
    completedProjects: 0,
    audioGenerations: 0,
    weeklyProjects: 0,
    monthlyWords: 0,
    averageWordsPerProject: 0,
    productivityScore: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [toolUsage, setToolUsage] = useState<ToolUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: projects } = await db.getProjects(user.id);
      const { data: analytics } = await db.getUsageAnalytics(user.id, 30);
      const { data: audioGens } = await db.getAudioGenerations(user.id);

      if (projects) {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const totalProjects = projects.length;
        const totalWords = projects.reduce((acc, p) => acc + (p.word_count || 0), 0);
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const weeklyProjects = projects.filter(p => 
          new Date(p.created_at) >= oneWeekAgo
        ).length;
        const monthlyWords = projects
          .filter(p => new Date(p.created_at) >= oneMonthAgo)
          .reduce((acc, p) => acc + (p.word_count || 0), 0);
        const averageWordsPerProject = totalProjects > 0 ? Math.round(totalWords / totalProjects) : 0;
        
        const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
        const wordsPerDay = monthlyWords / 30;
        const projectsPerWeek = weeklyProjects;
        const productivityScore = Math.min(100, Math.round(
          (completionRate * 0.4) + 
          (Math.min(wordsPerDay / 100, 1) * 30) + 
          (Math.min(projectsPerWeek / 5, 1) * 30)
        ));

        setStats({
          totalProjects,
          totalWords,
          completedProjects,
          audioGenerations: audioGens?.length || 0,
          weeklyProjects,
          monthlyWords,
          averageWordsPerProject,
          productivityScore
        });

        const activity = projects
          .slice(0, 4)
          .map(project => ({
            type: project.tool_type,
            title: project.title,
            time: formatRelativeTime(project.updated_at),
            status: project.status,
            tool_type: project.tool_type
          }));
        setRecentActivity(activity);

        const toolCounts = projects.reduce((acc, project) => {
          const tool = project.tool_type;
          acc[tool] = (acc[tool] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const toolUsageData = Object.entries(toolCounts)
          .map(([tool, count]) => ({
            name: getToolDisplayName(tool),
            count,
            percentage: Math.round((count / totalProjects) * 100),
            color: getToolColor(tool)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        setToolUsage(toolUsageData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US');
  };

  const getToolDisplayName = (toolType: string) => {
    const toolNames: Record<string, string> = {
      'rewrite': 'Rewrite',
      'article': 'Articles',
      'email': 'Emails',
      'social': 'Social Media',
      'product': 'Products',
      'correction': 'Correction',
      'tts': 'Text-to-Speech',
      'audiobook': 'Audiobooks'
    };
    return toolNames[toolType] || toolType;
  };

  const getToolColor = (toolType: string) => {
    const colors: Record<string, string> = {
      'rewrite': 'from-blue-500 to-blue-600',
      'article': 'from-green-500 to-green-600',
      'email': 'from-purple-500 to-purple-600',
      'social': 'from-pink-500 to-pink-600',
      'product': 'from-orange-500 to-orange-600',
      'correction': 'from-red-500 to-red-600',
      'tts': 'from-indigo-500 to-indigo-600',
      'audiobook': 'from-yellow-500 to-yellow-600'
    };
    return colors[toolType] || 'from-gray-500 to-gray-600';
  };

  const getStatusText = (status: string) => {
    return status === 'completed' ? 'Completed' : 'Draft';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getUsagePercentage = () => {
    if (!profile) return 0;
    return Math.round(((profile.api_usage_count || 0) / (profile.monthly_usage_limit || 10000)) * 100);
  };

  const statsData = [
    {
      title: 'Projects Created',
      value: stats.totalProjects.toString(),
      change: stats.weeklyProjects > 0 ? `+${stats.weeklyProjects} this week` : 'None this week',
      positive: stats.weeklyProjects > 0,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Words Generated',
      value: formatNumber(stats.totalWords),
      change: stats.monthlyWords > 0 ? `+${formatNumber(stats.monthlyWords)} this month` : 'None this month',
      positive: stats.monthlyWords > 0,
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Audio Created',
      value: stats.audioGenerations.toString(),
      change: stats.audioGenerations > 0 ? 'Available' : 'None yet',
      positive: stats.audioGenerations > 0,
      icon: Volume2,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Completion Rate',
      value: stats.totalProjects > 0 ? `${Math.round((stats.completedProjects / stats.totalProjects) * 100)}%` : '0%',
      change: `${stats.completedProjects} of ${stats.totalProjects}`,
      positive: stats.completedProjects > 0,
      icon: Target,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 transition-colors duration-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Hello, {profile?.full_name || 'User'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {stats.totalProjects > 0 
            ? `You've created ${stats.totalProjects} projects and generated ${formatNumber(stats.totalWords)} words!`
            : 'Start by creating your first project with our AI tools.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 transition-colors duration-200">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-all duration-200">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getToolColor(activity.tool_type)} rounded-xl flex items-center justify-center shadow-sm`}>
                    <span className="text-white text-xs font-medium">
                      {getToolDisplayName(activity.tool_type)[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getToolDisplayName(activity.tool_type)} • {activity.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {getStatusText(activity.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No recent activity</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start by creating your first project!</p>
              </div>
            )}
          </div>
        </div>

        {/* Tool Usage */}
        <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 transition-colors duration-200">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Used Tools</h2>
          <div className="space-y-4">
            {toolUsage.length > 0 ? (
              toolUsage.map((tool, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{tool.count} projects</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tool.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${tool.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${tool.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No usage data yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Use the tools to see statistics!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Productivity & Plan Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Score */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Productivity Score</h3>
              <p className="text-blue-100 text-sm">Based on your activity</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.productivityScore}</div>
              <div className="text-blue-100 text-sm">out of 100</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Completed projects</span>
              <span>{stats.completedProjects}/{stats.totalProjects}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Words per project</span>
              <span>{stats.averageWordsPerProject}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Projects this week</span>
              <span>{stats.weeklyProjects}</span>
            </div>
          </div>
        </div>

        {/* Plan Status */}
        <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {profile?.plan_type === 'free' ? 'Free Plan' : 'Premium Plan'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile?.plan_type === 'free' ? 'Monthly limit' : 'Unlimited access'}
                </p>
              </div>
            </div>
            {profile?.plan_type === 'free' && (
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm">
                Upgrade
              </button>
            )}
          </div>

          {profile?.plan_type === 'free' && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Words used</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(profile?.api_usage_count || 0).toLocaleString()} / {(profile?.monthly_usage_limit || 10000).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getUsagePercentage()}% of monthly limit used
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {stats.totalProjects === 0 && (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white text-center shadow-lg">
          <Zap className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Welcome to WriteAI Pro! 🚀</h3>
          <p className="text-green-100 mb-4">
            You're ready to revolutionize your writing productivity with AI.
          </p>
          <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-all duration-200 flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Create First Project
          </button>
        </div>
      )}
    </div>
  );
}