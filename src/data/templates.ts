import { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'blog-intro',
    name: 'Blog Post Introduction',
    description: 'Engaging introduction for blog articles',
    category: 'Blog',
    content: 'Have you ever wondered how {topic}? In this article, we\'ll explore {main_points} and discover {benefit}. Keep reading to find out {call_to_action}.',
    variables: ['topic', 'main_points', 'benefit', 'call_to_action']
  },
  {
    id: 'email-follow-up',
    name: 'Follow-up Email',
    description: 'Professional follow-up email',
    category: 'Email',
    content: 'Hello {name},\n\nI hope you\'re doing well. I\'m reaching out to follow up on our conversation about {topic}.\n\n{main_message}\n\nI look forward to hearing from you.\n\nBest regards,\n{sender_name}',
    variables: ['name', 'topic', 'main_message', 'sender_name']
  },
  {
    id: 'social-engagement',
    name: 'Social Media Engagement Post',
    description: 'Post to increase engagement on social media',
    category: 'Social Media',
    content: '🚀 {hook_question}\n\n{main_content}\n\n✨ {call_to_action}\n\n{hashtags}',
    variables: ['hook_question', 'main_content', 'call_to_action', 'hashtags']
  },
  {
    id: 'product-description',
    name: 'E-commerce Product Description',
    description: 'Persuasive description for online products',
    category: 'E-commerce',
    content: '✨ {product_name}\n\n🎯 {main_benefit}\n\n📋 Features:\n{features_list}\n\n💡 {unique_selling_point}\n\n🛒 {call_to_action}',
    variables: ['product_name', 'main_benefit', 'features_list', 'unique_selling_point', 'call_to_action']
  }
];