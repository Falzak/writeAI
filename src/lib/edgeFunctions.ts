import { supabase } from './supabase';

export interface GenerateTextRequest {
  prompt: string;
  toolType: string;
  language?: string;
  maxTokens?: number;
}

export interface GenerateTextResponse {
  content: string;
  wordCount: number;
  characterCount: number;
  success: boolean;
  error?: string;
}

export interface GenerateAudioRequest {
  text: string;
  voiceId: string;
  voiceName: string;
  settings?: {
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useStyleDirection?: boolean;
  };
}

export interface GenerateAudioResponse {
  audioUrl?: string;
  duration?: number;
  fileSize?: number;
  success: boolean;
  error?: string;
}

export const edgeFunctions = {
  generateText: async (request: GenerateTextRequest): Promise<GenerateTextResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: request
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error calling generate-text function:', error);
      return {
        content: '',
        wordCount: 0,
        characterCount: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  generateAudio: async (request: GenerateAudioRequest): Promise<GenerateAudioResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-audio', {
        body: request
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error calling generate-audio function:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};