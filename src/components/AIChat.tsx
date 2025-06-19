import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronDown, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { edgeFunctions } from '../lib/edgeFunctions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
}

const aiModels: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient for most tasks',
    provider: 'OpenAI'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable model for complex tasks',
    provider: 'OpenAI'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Quick responses for simple tasks',
    provider: 'OpenAI'
  }
];

const exampleQuestions = [
  "Explain quantum entanglement simply",
  "Generate a creative app name for task management",
  "Translate 'Better late than never' into Latin",
  "Write a short riddle with the answer 'time'"
];

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(aiModels[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    // Check usage limits for free users
    if (profile?.plan_type === 'free') {
      const currentUsage = profile.api_usage_count || 0;
      const limit = profile.monthly_usage_limit || 10000;
      
      if (currentUsage >= limit) {
        alert('Monthly usage limit reached. Please upgrade to continue.');
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setChatStarted(true);

    try {
      const response = await edgeFunctions.generateText({
        prompt: text,
        toolType: 'chat',
        language: 'pt-BR',
        maxTokens: 1000
      });

      if (response.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExampleClick = (question: string) => {
    setInputValue(question);
    handleSendMessage(question);
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setChatStarted(false);
    setInputValue('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AI Chat</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Powered by {selectedModel.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {chatStarted && (
              <button
                onClick={clearChat}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Chat
              </button>
            )}
            
            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm font-medium">{selectedModel.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showModelSelector && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowModelSelector(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Choose AI Model
                      </h3>
                      {aiModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model);
                            setShowModelSelector(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedModel.id === model.id
                              ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {model.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {model.description}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {model.provider}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!chatStarted ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What can I help with?
              </h2>
              
              {/* Input Field - Centered */}
              <div className="relative mb-8">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask AI anything..."
                  className="w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Example Questions */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                  Examples of queries:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(question)}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all duration-200 group"
                    >
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {question} →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-3xl ${message.role === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area - Bottom */}
        {chatStarted && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="w-full px-6 py-4 pr-14 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage Info for Free Users */}
      {profile?.plan_type === 'free' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-800 dark:text-yellow-300">
              Usage: {(profile.api_usage_count || 0).toLocaleString()} / {(profile.monthly_usage_limit || 10000).toLocaleString()} words
            </span>
            <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 font-medium">
              Upgrade for unlimited
            </button>
          </div>
        </div>
      )}
    </div>
  );
}