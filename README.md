# ProductMind AI

An AI-powered chatbot that answers questions about your products using RAG (Retrieval-Augmented Generation). Upload your product content, and the chatbot will provide accurate answers based on your knowledge base.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Application Overview

### Chat Interface (`/`)

The main chat interface where you can:

- Ask questions about your products
- Switch between OpenAI and Ollama providers
- Get answers based strictly on your product content

### Admin Interface (`/admin`)

The content management interface where you can:

- Upload product content (text from screens)
- Add metadata (source, category, screen name)
- Delete content by source
- Manage your knowledge base
- Customize chatbot appearance and behavior

**To add content:**

1. Go to `/admin`
2. Enter source name, category, and paste your content
3. Click "Ingest Content"
4. Content will be chunked, embedded, and stored
5. Return to chat to ask questions!

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-publishable-key
```

**Where to find these values:**

- **NEXT_PUBLIC_SUPABASE_URL**: Supabase Dashboard → Project Settings → API → Project URL
- **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY**: Supabase Dashboard → Project Settings → API → Publishable Default Key`

**Ollama Setup (if using local Ollama):**

1. Install Ollama: `brew install ollama`
2. Start Ollama service: `ollama serve`
3. Pull the models:
   - For chat: `ollama pull qwen3:4b-thinking-2507-q8_0`
   - For embeddings: `ollama pull nomic-embed-text`

## Database Setup

Run the following SQL in your Supabase SQL Editor to set up the database:

### Step 1: Initial Setup

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx ON document_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS document_chunks_created_at_idx ON document_chunks(created_at);

CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_chunks.id,
    document_chunks.content,
    document_chunks.metadata,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) >= match_threshold
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### Step 2: App Settings

```sql
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
```

## Test Connection

After setting up the database, test the connection by visiting:

```
http://localhost:3000/api/test-connection
```

## Testing the Embed Functionality

### Prerequisites

1. Make sure your Next.js dev server is running: `npm run dev`
2. Make sure you're logged in and have configured your settings in the Admin panel

### Step 1: Get Your User ID

1. Go to `http://localhost:3000/admin`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run this command to get your user ID:

```javascript
const user = await (await fetch("/api/auth/user")).json();
console.log("User ID:", user.user?.id);
```

Or check the Network tab when loading the admin page - look for requests to `/api/settings?userId=...`

### Step 2: Test the Embed Settings API

Test the API endpoint directly in your browser or using curl:

```bash
# Replace YOUR_USER_ID with your actual user ID
curl "http://localhost:3000/api/embed-settings?userId=YOUR_USER_ID"
```

You should get a JSON response with your settings.

### Step 3: Test the Embed Script File

1. Open: `http://localhost:3000/embed.js`
2. You should see the JavaScript code (not an error page)

### Step 4: Test the Embed Tab in Admin

1. Go to `http://localhost:3000/admin`
2. Click on the "Embed" tab
3. You should see:

   - Instructions
   - Your embed code with your user ID
   - A "Copy" button
   - Example HTML

4. Click the "Copy" button - it should copy the code to your clipboard
5. Verify the code includes your user ID and base URL

### Step 5: Test the Embed on a Test Page

#### Option A: Use the Test HTML File

1. Copy your embed code from the Admin panel
2. Open `public/test-embed.html` in an editor
3. Replace the placeholder script tag with your actual embed code:
   ```html
   <script
     src="http://localhost:3000/embed.js"
     data-user-id="YOUR_ACTUAL_USER_ID"
     data-base-url="http://localhost:3000"
   ></script>
   ```
4. Open in browser: `http://localhost:3000/test-embed.html`
5. You should see:
   - A chat button in the bottom-right corner
   - Clicking it opens the chat widget
   - The widget shows your customized colors and messages

#### Option B: Create Your Own Test Page

1. Create a simple HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Test Page</title>
  </head>
  <body>
    <h1>Test Page</h1>
    <p>This is a test page for the chatbot embed.</p>

    <!-- Paste your embed code here -->
    <script
      src="http://localhost:3000/embed.js"
      data-user-id="YOUR_USER_ID"
      data-base-url="http://localhost:3000"
    ></script>
  </body>
</html>
```

2. Open it in your browser
3. The chatbot should appear

### Step 6: Test Chat Functionality

1. Click the chat button
2. You should see your greeting message
3. Type a question and send it
4. You should get a response (if you have content ingested)
5. Test the close button - it should close the widget
6. Test opening it again

### Step 7: Test Customization

1. Go to Admin → Customization tab
2. Change some colors or messages
3. Save the settings
4. Refresh your test page
5. The widget should reflect your new customization

### Troubleshooting

#### Widget doesn't appear

- Check browser console for errors (F12 → Console)
- Verify the embed.js file is accessible
- Check that your user ID is correct
- Make sure the script tag is before `</body>`

#### API errors

- Check that you're logged in
- Verify your user ID is correct
- Check Network tab in DevTools for failed requests

#### Widget appears but chat doesn't work

- Make sure you've configured LLM/embedding providers in Settings
- Check that you have content ingested
- Look for errors in browser console

#### CORS errors

- This shouldn't happen on localhost, but if deploying:
  - Make sure your base URL matches your actual domain
  - Check Next.js CORS configuration if needed
