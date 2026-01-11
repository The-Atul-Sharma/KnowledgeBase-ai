import { similaritySearch } from "./vectorStore.js";
import { generateResponse } from "./llm.js";

function isGreeting(text) {
  return /^(hi|hello|hey|good morning|good evening)$/i.test(text.trim());
}

export async function generateRAGResponse(query, options = {}) {
  const {
    provider = "ollama",
    settings = {},
    metadataFilter = { module: "sales-history-review" },
    userId = null,
  } = options;

  if (isGreeting(query)) {
    const greetingMessage =
      settings.greeting_message || "Hi there 👋. How can I help?";
    return {
      answer: greetingMessage,
      chunks: [],
    };
  }

  let retrieved = await similaritySearch(query, {
    limit: 10,
    threshold: 0.1,
    metadataFilter,
    settings,
    userId,
  });

  if (retrieved.length === 0) {
    retrieved = await similaritySearch(query, {
      limit: 10,
      threshold: 0.1,
      metadataFilter: {},
      settings,
      userId,
    });
  }

  if (retrieved.length === 0) {
    retrieved = await similaritySearch(query, {
      limit: 15,
      threshold: 0.05,
      metadataFilter: {},
      settings,
      userId,
    });
  }

  const answer = await generateResponse(provider, retrieved, query, settings);

  return {
    answer,
    chunks: retrieved.map((c) => ({
      similarity: c.similarity,
      metadata: c.metadata,
    })),
  };
}
