import React, { useState, useEffect } from 'react';
import { Save, Play, Download, RotateCcw, Sparkles, Copy } from 'lucide-react';
import { WritingTool } from '../types';
import { useWritingProjects } from '../hooks/useWritingProjects';

interface WritingEditorProps {
  tool: WritingTool;
  onBack: () => void;
}

export function WritingEditor({ tool, onBack }: WritingEditorProps) {
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { createProject, updateProject, generateContent, loading } = useWritingProjects();
  const [currentProject, setCurrentProject] = useState<any>(null);

  useEffect(() => {
    const project = createProject(`New ${tool.name}`, tool.id);
    setCurrentProject(project);
    setTitle(project.title);
  }, [tool]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const generatedContent = await generateContent(prompt, tool.name);
      setContent(generatedContent);
      
      if (currentProject) {
        updateProject(currentProject.id, { 
          content: generatedContent,
          status: 'completed'
        });
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (currentProject) {
      updateProject(currentProject.id, { 
        title,
        content,
        status: content ? 'completed' : 'draft'
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const getPromptPlaceholder = () => {
    const placeholders = {
      'rewrite': 'Enter the text you want to rewrite...',
      'article': 'Describe the article topic you want to create...',
      'email': 'Describe the context and objective of the email...',
      'social': 'What message do you want to convey on social media?',
      'product': 'Describe the product and its main benefits...',
      'correction': 'Paste the text you want to correct...'
    };
    return placeholders[tool.id as keyof typeof placeholders] || 'Describe what you want to create...';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{tool.name}</h1>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!content}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      </div>

      <div className="flex-1 flex">
        {/* Input Panel */}
        <div className="w-1/2 p-6 border-r border-gray-200 bg-white">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your project name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description/Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder={getPromptPlaceholder()}
              />
            </div>

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
              <h3 className="text-sm font-medium text-gray-700 mb-3">Available Features</h3>
              <div className="space-y-2">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-1/2 p-6 bg-white">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Generated Content</h3>
              {content && (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 border border-gray-200 rounded-lg p-4 overflow-y-auto">
              {content ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-900 leading-relaxed">
                    {content}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Generated content will appear here</p>
                    <p className="text-sm mt-2">Enter a prompt and click "Generate Content"</p>
                  </div>
                </div>
              )}
            </div>

            {content && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
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