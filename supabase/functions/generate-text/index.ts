/*
  # Generate Text Edge Function
  
  Esta função integra com a API da OpenAI para gerar conteúdo baseado em prompts.
  Suporta diferentes tipos de ferramentas de escrita.
*/

import { corsHeaders } from '../_shared/cors.ts';

interface GenerateTextRequest {
  prompt: string;
  toolType: string;
  language?: string;
  maxTokens?: number;
}

interface GenerateTextResponse {
  content: string;
  wordCount: number;
  characterCount: number;
  success: boolean;
  error?: string;
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set');
}

// Prompts específicos para cada ferramenta
const getSystemPrompt = (toolType: string, language: string = 'pt-BR'): string => {
  const prompts: Record<string, string> = {
    'rewrite': `Você é um especialista em reescrita de textos. Sua tarefa é melhorar textos mantendo o significado original, mas com melhor clareza, fluidez e engajamento. Responda em ${language}.`,
    
    'article': `Você é um redator especialista em criar artigos completos e otimizados para SEO. Crie artigos bem estruturados com introdução, desenvolvimento e conclusão. Inclua subtítulos e seja informativo. Responda em ${language}.`,
    
    'email': `Você é um especialista em comunicação empresarial. Crie emails profissionais, claros e persuasivos com tom apropriado para o contexto. Responda em ${language}.`,
    
    'social': `Você é um especialista em marketing de conteúdo para redes sociais. Crie posts envolventes, com call-to-action e hashtags relevantes. Responda em ${language}.`,
    
    'product': `Você é um copywriter especializado em descrições de produtos. Crie textos persuasivos que destacam benefícios, características e criam urgência de compra. Responda em ${language}.`,
    
    'correction': `Você é um revisor especialista. Corrija erros gramaticais, ortográficos e de estilo, mantendo o tom original do texto. Responda em ${language}.`
  };

  return prompts[toolType] || `Você é um assistente de escrita especializado. Ajude com a criação de conteúdo de qualidade. Responda em ${language}.`;
};

const generateWithOpenAI = async (prompt: string, toolType: string, language: string, maxTokens: number): Promise<string> => {
  const systemPrompt = getSystemPrompt(toolType, language);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No content generated from OpenAI');
  }

  return data.choices[0].message.content.trim();
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

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          success: false 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { prompt, toolType, language = 'pt-BR', maxTokens = 1000 }: GenerateTextRequest = await req.json();

    if (!prompt || !toolType) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: prompt and toolType',
          success: false 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate content using OpenAI
    const content = await generateWithOpenAI(prompt, toolType, language, maxTokens);
    
    // Calculate metrics
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = content.length;

    const response: GenerateTextResponse = {
      content,
      wordCount,
      characterCount,
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
    console.error('Error in generate-text function:', error);
    
    const errorResponse: GenerateTextResponse = {
      content: '',
      wordCount: 0,
      characterCount: 0,
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