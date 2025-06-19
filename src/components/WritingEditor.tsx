import React, { useState, useEffect } from 'react';
import { Save, Play, Download, RotateCcw, Sparkles, Copy, Volume2 } from 'lucide-react';
import { WritingTool } from '../types';
import { useWritingProjects } from '../hooks/useWritingProjects';
import { useAuth } from '../contexts/AuthContext';

interface WritingEditorProps {
  tool: WritingTool;
  onBack: () => void;
}

export function WritingEditor({ tool, onBack }: WritingEditorProps) {
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createProject, updateProject, generateContent, loading } = useWritingProjects();
  const { profile } = useAuth();
  const [currentProject, setCurrentProject] = useState<any>(null);

  useEffect(() => {
    const project = createProject(`New ${tool.name}`, tool.id);
    setCurrentProject(project);
    setTitle(`New ${tool.name}`);
  }, [tool]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Check usage limits for free users
      if (profile?.plan_type === 'free') {
        const currentUsage = profile.api_usage_count || 0;
        const limit = profile.monthly_usage_limit || 10000;
        
        if (currentUsage >= limit) {
          setError('Monthly usage limit reached. Please upgrade to continue.');
          return;
        }
      }

      const generatedContent = await generateContent(prompt, tool.id);
      setContent(generatedContent);
      
      if (currentProject) {
        updateProject(currentProject.id, { 
          content: generatedContent,
          prompt: prompt,
          status: 'completed'
        });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (currentProject) {
      updateProject(currentProject.id, { 
        title,
        content,
        prompt,
        status: content ? 'completed' : 'draft'
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  const getPromptPlaceholder = () => {
    const placeholders = {
      'rewrite': 'Cole o texto que você deseja reescrever...',
      'article': 'Descreva o tópico do artigo que você quer criar...',
      'email': 'Descreva o contexto e objetivo do email...',
      'social': 'Que mensagem você quer transmitir nas redes sociais?',
      'product': 'Descreva o produto e seus principais benefícios...',
      'correction': 'Cole o texto que você quer corrigir...'
    };
    return placeholders[tool.id as keyof typeof placeholders] || 'Descreva o que você quer criar...';
  };

  const getUsageInfo = () => {
    if (profile?.plan_type === 'free') {
      const currentUsage = profile.api_usage_count || 0;
      const limit = profile.monthly_usage_limit || 10000;
      const percentage = Math.round((currentUsage / limit) * 100);
      
      return {
        current: currentUsage,
        limit,
        percentage,
        remaining: limit - currentUsage
      };
    }
    return null;
  };

  const usageInfo = getUsageInfo();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!content}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCopy}
              disabled={!content}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>

        {/* Usage Info for Free Users */}
        {usageInfo && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-800 dark:text-blue-300">
                Usage: {usageInfo.current.toLocaleString()} / {usageInfo.limit.toLocaleString()} words
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {usageInfo.remaining.toLocaleString()} remaining
              </span>
            </div>
            <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(usageInfo.percentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex">
        {/* Input Panel */}
        <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your project name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description/Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder={getPromptPlaceholder()}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating || loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </>
              )}
            </button>

            {/* Features */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available Features</h3>
              <div className="space-y-2">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-1/2 p-6 bg-white dark:bg-gray-800">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generated Content</h3>
              {content && (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg p-4 overflow-y-auto">
              {content ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100 leading-relaxed">
                    {content}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>Generated content will appear here</p>
                    <p className="text-sm mt-2">Enter a prompt and click "Generate Content"</p>
                  </div>
                </div>
              )}
            </div>

            {content && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium">
                    Content generated successfully! ({content.split(' ').length} words)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}