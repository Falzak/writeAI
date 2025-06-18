import { WritingTool } from '../types';

export const writingTools: WritingTool[] = [
  {
    id: 'rewrite',
    name: 'Reescrita Inteligente',
    description: 'Melhore textos existentes com diferentes tons e estilos',
    icon: 'RefreshCw',
    category: 'writing',
    features: ['Tom profissional', 'Estilo casual', 'Simplificação', 'Expansão']
  },
  {
    id: 'article',
    name: 'Geração de Artigos',
    description: 'Crie artigos completos otimizados para SEO',
    icon: 'FileText',
    category: 'writing',
    features: ['SEO otimizado', 'Estrutura profissional', 'Pesquisa incluída', 'CTA integrado']
  },
  {
    id: 'email',
    name: 'E-mails Profissionais',
    description: 'Templates e respostas automáticas para e-mails',
    icon: 'Mail',
    category: 'writing',
    features: ['Templates prontos', 'Tom personalizado', 'Respostas rápidas', 'Seguimento']
  },
  {
    id: 'social',
    name: 'Posts para Redes Sociais',
    description: 'Conteúdo otimizado para múltiplas plataformas',
    icon: 'Share2',
    category: 'writing',
    features: ['Multi-plataforma', 'Hashtags incluídas', 'Call-to-action', 'Agendamento']
  },
  {
    id: 'product',
    name: 'Descrições de Produtos',
    description: 'Textos persuasivos que convertem visitantes em clientes',
    icon: 'Package',
    category: 'writing',
    features: ['Copywriting persuasivo', 'SEO friendly', 'Benefícios destacados', 'Urgência']
  },
  {
    id: 'correction',
    name: 'Correção e Estilo',
    description: 'Verificação gramatical avançada com sugestões',
    icon: 'CheckCircle',
    category: 'writing',
    features: ['Gramática', 'Ortografia', 'Estilo', 'Tom']
  },
  {
    id: 'tts',
    name: 'Text-to-Speech',
    description: 'Converta qualquer texto em áudio profissional',
    icon: 'Volume2',
    category: 'audio',
    features: ['32 idiomas', '3000+ vozes', 'Voice cloning', 'Tempo real']
  },
  {
    id: 'audiobook',
    name: 'Audiobooks Automáticos',
    description: 'Transforme artigos longos em audiobooks',
    icon: 'Headphones',
    category: 'audio',
    features: ['Capítulos automáticos', 'Marcadores', 'Múltiplas vozes', 'Download']
  }
];