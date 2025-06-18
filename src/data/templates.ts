import { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'blog-intro',
    name: 'Introdução de Blog Post',
    description: 'Introdução envolvente para artigos de blog',
    category: 'Blog',
    content: 'Você já se perguntou como {topic}? Neste artigo, vamos explorar {main_points} e descobrir {benefit}. Continue lendo para descobrir {call_to_action}.',
    variables: ['topic', 'main_points', 'benefit', 'call_to_action']
  },
  {
    id: 'email-follow-up',
    name: 'E-mail de Follow-up',
    description: 'E-mail de acompanhamento profissional',
    category: 'E-mail',
    content: 'Olá {name},\n\nEspero que esteja bem. Estou entrando em contato para acompanhar nossa conversa sobre {topic}.\n\n{main_message}\n\nFico no aguardo do seu retorno.\n\nAtenciosamente,\n{sender_name}',
    variables: ['name', 'topic', 'main_message', 'sender_name']
  },
  {
    id: 'social-engagement',
    name: 'Post Engajamento Social',
    description: 'Post para aumentar engajamento nas redes sociais',
    category: 'Social Media',
    content: '🚀 {hook_question}\n\n{main_content}\n\n✨ {call_to_action}\n\n{hashtags}',
    variables: ['hook_question', 'main_content', 'call_to_action', 'hashtags']
  },
  {
    id: 'product-description',
    name: 'Descrição de Produto E-commerce',
    description: 'Descrição persuasiva para produtos online',
    category: 'E-commerce',
    content: '✨ {product_name}\n\n🎯 {main_benefit}\n\n📋 Características:\n{features_list}\n\n💡 {unique_selling_point}\n\n🛒 {call_to_action}',
    variables: ['product_name', 'main_benefit', 'features_list', 'unique_selling_point', 'call_to_action']
  }
];