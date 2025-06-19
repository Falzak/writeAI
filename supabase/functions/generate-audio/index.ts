/*
  # Generate Audio Edge Function
  
  Esta função integra com a API da ElevenLabs para converter texto em áudio.
  Suporta diferentes vozes e configurações de qualidade.
*/

import { corsHeaders } from '../_shared/cors.ts';

interface GenerateAudioRequest {
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

interface GenerateAudioResponse {
  audioUrl?: string;
  duration?: number;
  fileSize?: number;
  success: boolean;
  error?: string;
}

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

if (!ELEVENLABS_API_KEY) {
  console.error('ELEVENLABS_API_KEY is not set');
}

const generateWithElevenLabs = async (
  text: string, 
  voiceId: string, 
  settings: any
): Promise<{ audioData: ArrayBuffer; contentType: string }> => {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: settings.stability || 0.5,
        similarity_boost: settings.similarityBoost || 0.75,
        style: settings.style || 0.3,
        use_speaker_boost: true
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const audioData = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'audio/mpeg';

  return { audioData, contentType };
};

const uploadToSupabaseStorage = async (audioData: ArrayBuffer, fileName: string): Promise<string> => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing');
  }

  const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/audio/${fileName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioData.byteLength.toString(),
    },
    body: audioData,
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.text();
    throw new Error(`Storage upload error: ${uploadResponse.status} - ${error}`);
  }

  // Return public URL
  return `${supabaseUrl}/storage/v1/object/public/audio/${fileName}`;
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'ElevenLabs API key not configured',
          success: false 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { text, voiceId, voiceName, settings = {} }: GenerateAudioRequest = await req.json();

    if (!text || !voiceId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: text and voiceId',
          success: false 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate audio using ElevenLabs
    const { audioData, contentType } = await generateWithElevenLabs(text, voiceId, settings);
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `audio_${timestamp}_${voiceId}.mp3`;
    
    // Upload to Supabase Storage
    const audioUrl = await uploadToSupabaseStorage(audioData, fileName);
    
    // Calculate metrics
    const fileSize = audioData.byteLength;
    const estimatedDuration = Math.ceil(text.length / 10); // Rough estimation: 10 chars per second

    const response: GenerateAudioResponse = {
      audioUrl,
      duration: estimatedDuration,
      fileSize,
      success: true
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-audio function:', error);
    
    const errorResponse: GenerateAudioResponse = {
      success: false,
      error: error.message || 'Internal server error'
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});