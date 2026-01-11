import OpenAI from "openai";

const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || "ollama";
const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
const OPENAI_EMBEDDING_DIMENSION = 1536;
const OLLAMA_EMBEDDING_MODEL = "nomic-embed-text";
const OLLAMA_EMBEDDING_DIMENSION = 768;

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function generateOpenAIEmbedding(text) {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  try {
    const response = await openai.embeddings.create({
      model: OPENAI_EMBEDDING_MODEL,
      input: text,
      dimensions: OPENAI_EMBEDDING_DIMENSION,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating OpenAI embedding:", error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

function normalizeOllamaUrl(url) {
  if (!url) {
    return "http://127.0.0.1:11434";
  }

  url = String(url).trim();

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `http://${url}`;
  }

  return url;
}

async function generateOllamaEmbedding(text) {
  const rawUrl = process.env.OLLAMA_API_URL || "http://127.0.0.1:11434";
  const ollamaUrl = normalizeOllamaUrl(rawUrl);
  const model = OLLAMA_EMBEDDING_MODEL;

  console.log(`[Ollama Embedding] URL: ${ollamaUrl}, Model: ${model}`);

  try {
    const response = await fetch(`${ollamaUrl}/api/embed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`[Ollama Embedding] Response keys:`, Object.keys(data));

    let embedding = null;

    if (data.embeddings && Array.isArray(data.embeddings)) {
      embedding = data.embeddings[0];
    } else if (data.embedding && Array.isArray(data.embedding)) {
      embedding = data.embedding;
    } else if (Array.isArray(data)) {
      embedding = data[0] || data;
    } else {
      console.error(`[Ollama Embedding] Invalid response:`, data);
      throw new Error(
        `Invalid embedding response from Ollama. Expected embeddings array, got: ${JSON.stringify(
          data
        )}`
      );
    }

    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      console.error(
        `[Ollama Embedding] Empty or invalid embedding:`,
        embedding
      );
      throw new Error(
        `Ollama returned empty embedding. Make sure:\n` +
          `1. The model '${model}' is pulled: ollama pull ${model}\n` +
          `2. The model supports embeddings\n` +
          `3. Ollama is running correctly`
      );
    }

    console.log(
      `[Ollama Embedding] Generated embedding with dimension: ${embedding.length}`
    );
    return embedding;
  } catch (error) {
    console.error("Error generating Ollama embedding:", error);
    console.error(`Ollama URL used: ${ollamaUrl}`);
    console.error(`Error details:`, error.cause || error);

    if (
      error.message.includes("unknown scheme") ||
      error.message.includes("fetch failed")
    ) {
      throw new Error(
        `Failed to connect to Ollama at ${ollamaUrl}. Please ensure:\n` +
          `1. Ollama is running: ollama serve\n` +
          `2. OLLAMA_API_URL is set correctly in .env.local\n` +
          `3. The URL format is correct (e.g., http://127.0.0.1:11434)`
      );
    }

    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

export async function generateEmbedding(text, provider = null) {
  const embeddingProvider = provider || EMBEDDING_PROVIDER;

  if (embeddingProvider === "ollama") {
    return await generateOllamaEmbedding(text);
  }

  return await generateOpenAIEmbedding(text);
}

export async function generateEmbeddings(texts, provider = null) {
  const embeddingProvider = provider || EMBEDDING_PROVIDER;

  if (embeddingProvider === "ollama") {
    const embeddings = await Promise.all(
      texts.map((text) => generateOllamaEmbedding(text))
    );
    return embeddings;
  }

  if (!openai) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  try {
    const response = await openai.embeddings.create({
      model: OPENAI_EMBEDDING_MODEL,
      input: texts,
      dimensions: OPENAI_EMBEDDING_DIMENSION,
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
}

export function getEmbeddingDimension(provider = null) {
  const embeddingProvider = provider || EMBEDDING_PROVIDER;
  return embeddingProvider === "ollama"
    ? OLLAMA_EMBEDDING_DIMENSION
    : OPENAI_EMBEDDING_DIMENSION;
}

export {
  EMBEDDING_PROVIDER,
  OPENAI_EMBEDDING_MODEL,
  OPENAI_EMBEDDING_DIMENSION,
  OLLAMA_EMBEDDING_MODEL,
  OLLAMA_EMBEDDING_DIMENSION,
};
