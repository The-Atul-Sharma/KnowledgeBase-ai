CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  llm_provider TEXT NOT NULL DEFAULT 'ollama',
  embedding_provider TEXT NOT NULL DEFAULT 'ollama',
  openai_api_key TEXT,
  ollama_api_url TEXT DEFAULT 'http://127.0.0.1:11434',
  ollama_model TEXT DEFAULT 'qwen3:4b-thinking-2507-q8_0',
  ollama_embedding_model TEXT DEFAULT 'nomic-embed-text',
  chatbot_name TEXT DEFAULT 'Fin',
  header_title TEXT DEFAULT 'Knowledge Base Support',
  icon_url TEXT,
  greeting_message TEXT DEFAULT 'Hi there 👋 You are now speaking with Fin. How can I help?',
  custom_prompt TEXT,
  no_response_text TEXT DEFAULT 'I couldn''t find that in the current documentation, but I''m happy to help. Try rephrasing your question or asking about a specific feature.',
  input_placeholder TEXT DEFAULT 'Ask a question...',
  header_color TEXT DEFAULT '#3b82f6',
  header_text_color TEXT DEFAULT '#ffffff',
  response_card_color TEXT DEFAULT '#ffffff',
  response_text_color TEXT DEFAULT '#111827',
  response_metadata_color TEXT DEFAULT '#6b7280',
  user_card_color TEXT DEFAULT '#3b82f6',
  user_text_color TEXT DEFAULT '#ffffff',
  close_icon_color TEXT DEFAULT '#000000',
  close_icon_bg_color TEXT DEFAULT '#cccccc',
  chatbot_icon_bg_color TEXT DEFAULT '#3b82f6',
  send_icon_color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS app_settings_user_id_idx ON app_settings(user_id);

