/*
  # Schema inicial do WriteAI Pro

  1. Tabelas principais
    - `profiles` - Perfis de usuário estendidos
    - `writing_projects` - Projetos de escrita dos usuários
    - `audio_generations` - Gerações de áudio TTS
    - `templates` - Templates personalizados dos usuários
    - `usage_analytics` - Analytics de uso da plataforma

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas de acesso baseadas em usuário autenticado
    - Triggers para atualização automática de timestamps

  3. Funcionalidades
    - Perfis de usuário com informações estendidas
    - Projetos de escrita com versionamento
    - Histórico de gerações de áudio
    - Templates personalizados
    - Analytics de uso
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuário (estende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  company text,
  job_title text,
  bio text,
  avatar_url text,
  plan_type text DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'enterprise')),
  subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  subscription_end_date timestamptz,
  api_usage_count integer DEFAULT 0,
  monthly_usage_limit integer DEFAULT 10000,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de projetos de escrita
CREATE TABLE IF NOT EXISTS writing_projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  tool_type text NOT NULL,
  prompt text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
  word_count integer DEFAULT 0,
  character_count integer DEFAULT 0,
  language text DEFAULT 'pt-BR',
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de gerações de áudio
CREATE TABLE IF NOT EXISTS audio_generations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES writing_projects(id) ON DELETE CASCADE,
  text_content text NOT NULL,
  voice_id text NOT NULL,
  voice_name text NOT NULL,
  voice_settings jsonb DEFAULT '{}',
  audio_url text,
  duration_seconds integer,
  file_size_bytes bigint,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de templates personalizados
CREATE TABLE IF NOT EXISTS user_templates (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  content text NOT NULL,
  variables text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de analytics de uso
CREATE TABLE IF NOT EXISTS usage_analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL,
  tool_used text,
  words_generated integer DEFAULT 0,
  characters_generated integer DEFAULT 0,
  audio_seconds_generated integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Tabela de configurações de API
CREATE TABLE IF NOT EXISTS api_configurations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  api_key_encrypted text,
  is_active boolean DEFAULT false,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_writing_projects_updated_at BEFORE UPDATE ON writing_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audio_generations_updated_at BEFORE UPDATE ON audio_generations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_templates_updated_at BEFORE UPDATE ON user_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_configurations_updated_at BEFORE UPDATE ON api_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar contadores de palavras e caracteres
CREATE OR REPLACE FUNCTION update_content_counters()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = array_length(string_to_array(trim(NEW.content), ' '), 1);
  NEW.character_count = length(NEW.content);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar contadores automaticamente
CREATE TRIGGER update_writing_projects_counters BEFORE INSERT OR UPDATE ON writing_projects FOR EACH ROW EXECUTE FUNCTION update_content_counters();

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_configurations ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas de segurança para writing_projects
CREATE POLICY "Users can view own projects"
  ON writing_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON writing_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON writing_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON writing_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas de segurança para audio_generations
CREATE POLICY "Users can view own audio generations"
  ON audio_generations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own audio generations"
  ON audio_generations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audio generations"
  ON audio_generations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own audio generations"
  ON audio_generations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas de segurança para user_templates
CREATE POLICY "Users can view own templates and public templates"
  ON user_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own templates"
  ON user_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON user_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON user_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas de segurança para usage_analytics
CREATE POLICY "Users can view own analytics"
  ON usage_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics"
  ON usage_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Políticas de segurança para api_configurations
CREATE POLICY "Users can view own API configurations"
  ON api_configurations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own API configurations"
  ON api_configurations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_writing_projects_user_id ON writing_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_projects_created_at ON writing_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_writing_projects_status ON writing_projects(status);
CREATE INDEX IF NOT EXISTS idx_audio_generations_user_id ON audio_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_generations_project_id ON audio_generations(project_id);
CREATE INDEX IF NOT EXISTS idx_user_templates_user_id ON user_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_templates_category ON user_templates(category);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON usage_analytics(created_at DESC);