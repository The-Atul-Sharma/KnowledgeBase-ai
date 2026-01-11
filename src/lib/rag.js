import { similaritySearch } from "./vectorStore.js";
import { generateResponse } from "./llm.js";

function isGreeting(text) {
  return /^(hi|hello|hey|good morning|good evening)$/i.test(text.trim());
}

export async function generateRAGResponse(query, options = {}) {
  const {
    provider = "openai",
    embeddingProvider,
    metadataFilter = { module: "sales-history-review" },
  } = options;

  if (isGreeting(query)) {
    return {
      answer: "Hello. How can I help you with Sales History Review?",
      chunks: [],
    };
  }

  let retrieved = await similaritySearch(query, {
    limit: 10,
    threshold: 0.1,
    metadataFilter,
    embeddingProvider,
  });

  console.log(`[RAG] Query: "${query}", Retrieved chunks: ${retrieved.length}`);

  if (retrieved.length === 0) {
    console.log(`[RAG] No chunks found with metadata filter, trying without filter...`);
    retrieved = await similaritySearch(query, {
      limit: 10,
      threshold: 0.1,
      metadataFilter: {},
      embeddingProvider,
    });
    console.log(`[RAG] Retrieved ${retrieved.length} chunks without filter`);
  }

  if (retrieved.length === 0) {
    console.log(`[RAG] Still no chunks, trying with even lower threshold...`);
    retrieved = await similaritySearch(query, {
      limit: 15,
      threshold: 0.05,
      metadataFilter: {},
      embeddingProvider,
    });
    console.log(`[RAG] Retrieved ${retrieved.length} chunks with threshold 0.05`);
  }

  const answer = await generateResponse(provider, retrieved, query);

  return {
    answer,
    chunks: retrieved.map((c) => ({
      similarity: c.similarity,
      metadata: c.metadata,
    })),
  };
}
