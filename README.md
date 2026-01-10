This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
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

**To add content:**

1. Go to `/admin`
2. Enter source name, category, and paste your content
3. Click "Ingest Content"
4. Content will be chunked, embedded, and stored
5. Return to chat to ask questions!

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-publishable-key
SUPABASE_SECRET_KEY=your-supabase-secret-key
OPENAI_API_KEY=your-openai-api-key
OLLAMA_API_URL=http://127.0.0.1:11434
EMBEDDING_PROVIDER=ollama
```

### Supabase Keys Required:

1. **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL

   - Found in: Supabase Dashboard → Project Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY**: Your Supabase publishable key (replaces legacy anon key)

   - Found in: Supabase Dashboard → Project Settings → API → Publishable Default Key
   - This is safe to expose in the browser (client-side operations)

3. **SUPABASE_SECRET_KEY**: Your Supabase secret key (replaces legacy service_role key)
   - Found in: Supabase Dashboard → Project Settings → API → Secret Key (starts with `sb_secret_...`)
   - ⚠️ Keep this secret - only use in server-side code (for vector operations, embeddings, etc.)

### OpenAI Key:

- **OPENAI_API_KEY**: Your OpenAI API key
  - Get it from: https://platform.openai.com/api-keys

### Ollama Setup:

- **OLLAMA_API_URL**: Default is `http://127.0.0.1:11434`

  - To use local Ollama:
    1. Install Ollama: `brew install ollama`
    2. Start Ollama service: `ollama serve`
    3. Pull the models:
       - For chat: `ollama pull llama3.1:8b-instruct`
       - For embeddings: `ollama pull nomic-embed-text`

- **EMBEDDING_PROVIDER**: Set to `"ollama"` (default) or `"openai"`
  - Default is `"ollama"` to avoid OpenAI rate limits
  - If using Ollama, make sure to run the database migration for 768-dimensional vectors (see step 3 in Supabase setup)

## Supabase Vector Store Setup

### 1. Enable pgvector Extension

In your Supabase Dashboard:

1. Go to **SQL Editor**
2. Run the following SQL to enable the pgvector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Create Vector Table

Run the migration file located at `supabase/migrations/001_create_vector_table.sql` in the Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx ON document_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS document_chunks_created_at_idx ON document_chunks(created_at);
```

### 3. Update Vector Dimension for Ollama (Required if using Ollama embeddings)

If you're using Ollama for embeddings (default), run this migration to update the vector dimension from 1536 to 768:

```sql
ALTER TABLE document_chunks ALTER COLUMN embedding TYPE vector(768);

DROP INDEX IF EXISTS document_chunks_embedding_idx;

CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx ON document_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

Or run the migration file: `supabase/migrations/003_update_vector_dimension_for_ollama.sql`

**Note:** This will delete existing embeddings. You'll need to re-ingest your content after running this migration.

### 4. Create Similarity Search Function

Run the migration file located at `supabase/migrations/002_create_similarity_search_function.sql` in the Supabase SQL Editor (updated for 768 dimensions):

```sql
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

### 5. Test Connection

After setting up the database, test the connection by visiting:

```
http://localhost:3000/api/test-connection
```

Or run the dev server and check the API endpoint.

## Embedding & Storage Pipeline

### Ingestion API

Use the `/api/ingest` endpoint to add product content to the vector store.

#### POST `/api/ingest`

Add new content:

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Product: Smart Watch Pro\nFeatures:\n- Heart rate monitoring\n- Sleep tracking",
    "metadata": {
      "source": "product-overview",
      "category": "wearables",
      "screen": "Product Details"
    },
    "replace": false
  }'
```

**Parameters:**

- `text` (required): The product content text to ingest
- `metadata` (optional): Additional metadata (source, category, screen name, etc.)
- `replace` (optional): If `true` and `metadata.source` is provided, deletes existing chunks with the same source before adding new ones

**Response:**

```json
{
  "success": true,
  "message": "Successfully ingested 3 chunks",
  "chunksCount": 3,
  "chunks": [...]
}
```

#### DELETE `/api/ingest?source=<source>`

Delete content by source:

```bash
curl -X DELETE "http://localhost:3000/api/ingest?source=product-overview"
```

### How It Works

1. **Text Processing**: Content is cleaned and chunked (1000 chars, 200 overlap)
2. **Embedding Generation**: Each chunk is embedded using OpenAI's `text-embedding-3-small` model (1536 dimensions)
3. **Storage**: Chunks with embeddings are stored in Supabase vector store
4. **Ready for Search**: Content is immediately available for similarity search

### Example Usage

```javascript
const response = await fetch("/api/ingest", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Your product content here...",
    metadata: {
      source: "screen-1",
      category: "products",
      screen: "Product Overview",
    },
  }),
});

const result = await response.json();
console.log(`Ingested ${result.chunksCount} chunks`);
```

### Retrieval API

Use the `/api/retrieve` endpoint to search for relevant content.

#### POST `/api/retrieve`

Search for relevant chunks:

```bash
curl -X POST http://localhost:3000/api/retrieve \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the features of the smart watch?",
    "limit": 5,
    "threshold": 0.7,
    "metadataFilter": {
      "category": "wearables"
    }
  }'
```

**Parameters:**

- `query` (required): The search query text
- `limit` (optional): Maximum number of results (default: 5, max: 20)
- `threshold` (optional): Minimum similarity score (0-1, default: 0.7)
- `metadataFilter` (optional): Filter results by metadata (e.g., `{ "category": "wearables" }`)

**Response:**

```json
{
  "success": true,
  "query": "What are the features of the smart watch?",
  "resultsCount": 3,
  "results": [
    {
      "content": "Features:\n- Heart rate monitoring\n- Sleep tracking...",
      "metadata": {
        "source": "product-overview",
        "category": "wearables"
      },
      "similarity": 0.89
    }
  ]
}
```

**Example Usage:**

```javascript
const response = await fetch("/api/retrieve", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "What are the product features?",
    limit: 5,
    threshold: 0.7,
    metadataFilter: {
      category: "wearables",
    },
  }),
});

const result = await response.json();
console.log(`Found ${result.resultsCount} relevant chunks`);
```

### Chat API

Use the `/api/chat` endpoint to get AI-powered answers based on your product content.

#### POST `/api/chat`

Get AI response based on retrieved content:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the features of the smart watch?",
    "provider": "openai",
    "limit": 5,
    "threshold": 0.7
  }'
```

**Parameters:**

- `query` (required): The user's question
- `provider` (optional): LLM provider - `"openai"` or `"ollama"` (default: `"openai"`)
- `limit` (optional): Maximum number of chunks to retrieve (default: 5, max: 10)
- `threshold` (optional): Minimum similarity score for chunks (0-1, default: 0.7)
- `metadataFilter` (optional): Filter chunks by metadata

**Response:**

```json
{
  "success": true,
  "query": "What are the features of the smart watch?",
  "answer": "Based on the provided content, the smart watch features include heart rate monitoring, sleep tracking, water resistance up to 50m, and a battery life of 7 days.",
  "provider": "openai",
  "chunksUsed": 3,
  "chunks": [...]
}
```

**Example Usage:**

```javascript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "What are the product features?",
    provider: "openai",
    limit: 5,
    threshold: 0.7,
  }),
});

const result = await response.json();
console.log(result.answer);
```

**Provider Switch:**

Switch between OpenAI and Ollama:

```javascript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "What are the product features?",
    provider: "ollama",
  }),
});
```

**Important Notes:**

- **Temperature: 0** - Both providers use temperature 0 for deterministic, focused responses
- **Strict System Prompt** - The LLM is instructed to ONLY use information from retrieved chunks
- **No Guessing** - If information isn't in the context, the model will say so
- **Retriever-Only** - Answers come strictly from your product content, no general knowledge

## Content Processing Guide

### How Content Works

This chatbot processes product knowledge from **screen text content**. Here's how it works:

#### Content Flow

```
Screen Text (Product Content)
        ↓
Text Cleaning & Normalization
        ↓
Text Chunking (1000 chars, 200 overlap)
        ↓
Generate Embeddings (OpenAI)
        ↓
Store in Supabase Vector Store
        ↓
Ready for Similarity Search
```

### Content Format

#### Input: Screen Text

You'll add product content as **plain text** extracted from screens. For example:

```
Product: Smart Watch Pro
Features:
- Heart rate monitoring
- Sleep tracking
- Water resistant up to 50m
- Battery life: 7 days
- Compatible with iOS and Android

Price: $299
Warranty: 2 years
```

### Processing Steps

1. **Text Cleaning**

   - Removes extra whitespace
   - Normalizes line breaks
   - Trims content

2. **Text Chunking**

   - Default chunk size: **1000 characters**
   - Default overlap: **200 characters**
   - Splits on: paragraphs → sentences → words
   - Preserves context across chunks

3. **Metadata**
   - Each chunk can include metadata:
     - Source screen/page name
     - Product category
     - Last updated date
     - Custom tags

### Adding Content

#### Via Admin Interface (Coming Soon)

You'll be able to:

- Upload text content
- Add metadata (screen name, category, etc.)
- Update existing content
- Delete outdated content

#### Content Best Practices

1. **Clear Structure**: Use headings, bullet points, and paragraphs
2. **Complete Information**: Include all relevant product details
3. **Consistent Format**: Keep similar content in similar format
4. **Regular Updates**: Update content when products change

### Chunk Configuration

You can customize chunking in `src/lib/textProcessing.js`:

```javascript
const chunkSize = 1000; // Characters per chunk
const chunkOverlap = 200; // Overlap between chunks
```

**Recommendations:**

- **Small chunks (500-800)**: Better for specific questions, more precise matches
- **Medium chunks (1000-1500)**: Balanced for most use cases
- **Large chunks (2000+)**: Better for complex, multi-part questions

### Example Content Structure

```
Screen: Product Overview
---
Product Name: Smart Watch Pro
Category: Wearables
Description: Advanced fitness tracking watch with health monitoring features.
Features:
- Heart rate monitoring 24/7
- Sleep quality analysis
- Activity tracking
- GPS navigation
- Water resistant (50m)
Specifications:
- Battery: 7 days
- Display: 1.4" AMOLED
- Connectivity: Bluetooth 5.0
- Compatibility: iOS 12+, Android 8+
Price: $299
Warranty: 2 years
```

This content will be:

1. Cleaned and normalized
2. Split into chunks (preserving context)
3. Embedded and stored
4. Ready for retrieval when users ask questions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
