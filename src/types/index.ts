export interface WritingTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'writing' | 'audio' | 'analysis';
  features: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  variables: string[];
}

export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  useStyleDirection: boolean;
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  category: 'standard' | 'premium' | 'custom';
  previewUrl?: string;
}

export interface AudioGeneration {
  id: string;
  text: string;
  voice: Voice;
  settings: VoiceSettings;
  status: 'pending' | 'generating' | 'completed' | 'error';
  audioUrl?: string;
  createdAt: Date;
}

export interface WritingProject {
  id: string;
  title: string;
  content: string;
  tool: string;
  status: 'draft' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  hasAudio: boolean;
}

export interface AnalyticsData {
  totalProjects: number;
  totalWords: number;
  totalAudioGenerated: number;
  popularTools: { name: string; usage: number }[];
  weeklyActivity: { day: string; projects: number; words: number }[];
}