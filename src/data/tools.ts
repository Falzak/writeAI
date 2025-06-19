import { WritingTool } from '../types';

export const writingTools: WritingTool[] = [
  {
    id: 'rewrite',
    name: 'Smart Rewriting',
    description: 'Improve existing texts with different tones and styles',
    icon: 'RefreshCw',
    category: 'writing',
    features: ['Professional tone', 'Casual style', 'Simplification', 'Expansion']
  },
  {
    id: 'article',
    name: 'Article Generation',
    description: 'Create complete SEO-optimized articles',
    icon: 'FileText',
    category: 'writing',
    features: ['SEO optimized', 'Professional structure', 'Research included', 'CTA integrated']
  },
  {
    id: 'email',
    name: 'Professional Emails',
    description: 'Templates and automatic responses for emails',
    icon: 'Mail',
    category: 'writing',
    features: ['Ready templates', 'Custom tone', 'Quick responses', 'Follow-up']
  },
  {
    id: 'social',
    name: 'Social Media Posts',
    description: 'Content optimized for multiple platforms',
    icon: 'Share2',
    category: 'writing',
    features: ['Multi-platform', 'Hashtags included', 'Call-to-action', 'Scheduling']
  },
  {
    id: 'product',
    name: 'Product Descriptions',
    description: 'Persuasive texts that convert visitors into customers',
    icon: 'Package',
    category: 'writing',
    features: ['Persuasive copywriting', 'SEO friendly', 'Benefits highlighted', 'Urgency']
  },
  {
    id: 'correction',
    name: 'Correction & Style',
    description: 'Advanced grammar checking with suggestions',
    icon: 'CheckCircle',
    category: 'writing',
    features: ['Grammar', 'Spelling', 'Style', 'Tone']
  },
  {
    id: 'tts',
    name: 'Text-to-Speech',
    description: 'Convert any text to professional audio',
    icon: 'Volume2',
    category: 'audio',
    features: ['32 languages', '3000+ voices', 'Voice cloning', 'Real-time']
  },
  {
    id: 'audiobook',
    name: 'Automatic Audiobooks',
    description: 'Transform long articles into audiobooks',
    icon: 'Headphones',
    category: 'audio',
    features: ['Auto chapters', 'Bookmarks', 'Multiple voices', 'Download']
  }
];