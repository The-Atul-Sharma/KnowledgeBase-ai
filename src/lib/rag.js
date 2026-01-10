import { similaritySearch } from "./vectorStore";
import { generateResponse } from "./llm";

import { EMBEDDING_PROVIDER } from "./embeddings";

function isGreeting(query) {
  const greetingPatterns = [
    /^hi\s*$/i,
    /^hello\s*$/i,
    /^hey\s*$/i,
    /^greetings\s*$/i,
    /^good\s+(morning|afternoon|evening)\s*$/i,
  ];

  const normalizedQuery = query.trim().toLowerCase();
  return greetingPatterns.some((pattern) => pattern.test(normalizedQuery));
}

export async function generateRAGResponse(query, options = {}) {
  const {
    provider = "openai",
    limit = 5,
    threshold = 0.3,
    metadataFilter = {},
    embeddingProvider = EMBEDDING_PROVIDER,
  } = options;

  if (isGreeting(query)) {
    return {
      answer:
        "Hi! How may I help you today? I can answer questions about your products and services based on the information you've provided.",
      chunks: [],
      provider,
    };
  }

  console.log(`[RAG] Searching for: "${query}" with threshold: ${threshold}`);

  const retrievedChunks = await similaritySearch(query, {
    limit,
    threshold,
    metadataFilter,
    embeddingProvider,
  });

  console.log(`[RAG] Retrieved ${retrievedChunks.length} chunks`);

  if (retrievedChunks.length === 0) {
    return {
      answer:
        "I'm here to help! However, I couldn't find specific information about that in the provided content. Could you please rephrase your question or provide more details? If you're looking for something specific, try asking about features, functionality, or processes that might be documented in the system.",
      chunks: [],
      provider,
    };
  }

  const answer = await generateResponse(provider, retrievedChunks, query);

  return {
    answer,
    chunks: retrievedChunks.map((chunk) => ({
      content: chunk.content.substring(0, 200) + "...",
      similarity: chunk.similarity,
      metadata: chunk.metadata,
    })),
    provider,
  };
}
