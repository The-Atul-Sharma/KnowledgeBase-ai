import { supabaseAdmin, supabase } from "./supabase";
import {
  generateEmbeddings,
  generateEmbedding,
  EMBEDDING_PROVIDER,
} from "./embeddings";
import { chunkText } from "./textProcessing";

const client = supabaseAdmin || supabase;

export async function storeChunks(chunks, embeddingProvider = null) {
  if (!chunks || chunks.length === 0) {
    throw new Error("No chunks provided");
  }

  const contents = chunks.map((chunk) => chunk.content);
  const embeddings = await generateEmbeddings(contents, embeddingProvider);

  const records = chunks.map((chunk, index) => ({
    content: chunk.content,
    metadata: chunk.metadata || {},
    embedding: embeddings[index],
  }));

  const { data, error } = await client
    .from("document_chunks")
    .insert(records)
    .select();

  if (error) {
    console.error("Error storing chunks:", error);
    throw new Error(`Failed to store chunks: ${error.message}`);
  }

  return data;
}

export async function ingestContent(
  text,
  metadata = {},
  embeddingProvider = null
) {
  const chunks = await chunkText(text, { metadata });

  if (chunks.length === 0) {
    throw new Error("No chunks generated from text");
  }

  return await storeChunks(chunks, embeddingProvider);
}

export async function deleteChunksByMetadata(metadataFilter) {
  let query = client.from("document_chunks").delete();

  for (const [key, value] of Object.entries(metadataFilter)) {
    query = query.eq(`metadata->>${key}`, String(value));
  }

  const { data, error } = await query.select();

  if (error) {
    console.error("Error deleting chunks:", error);
    console.error("Metadata filter used:", metadataFilter);
    throw new Error(`Failed to delete chunks: ${error.message}`);
  }

  return data;
}

export async function similaritySearch(query, options = {}) {
  const {
    limit = 5,
    threshold = 0.3,
    metadataFilter = {},
    matchThreshold = 0.3,
    embeddingProvider = null,
  } = options;

  if (!query || typeof query !== "string") {
    throw new Error("Query text is required");
  }

  const queryEmbedding = await generateEmbedding(query, embeddingProvider);

  let queryBuilder = client.rpc("match_document_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: limit,
  });

  if (Object.keys(metadataFilter).length > 0) {
    for (const [key, value] of Object.entries(metadataFilter)) {
      queryBuilder = queryBuilder.eq(`metadata->${key}`, value);
    }
  }

  const { data, error } = await queryBuilder;

  if (error) {
    if (
      error.message.includes("function") ||
      error.message.includes("match_document_chunks")
    ) {
      return await fallbackSimilaritySearch(
        queryEmbedding,
        limit,
        threshold,
        metadataFilter
      );
    }
    console.error("Error in similarity search:", error);
    throw new Error(`Failed to search: ${error.message}`);
  }

  if (data && data.length > 0) {
    console.log(
      `[SimilaritySearch] Top similarity scores:`,
      data.slice(0, 3).map((item) => item.similarity?.toFixed(3))
    );
  }

  const filtered =
    data
      ?.filter((item) => item.similarity >= threshold)
      .slice(0, limit)
      .map((item) => ({
        content: item.content,
        metadata: item.metadata || {},
        similarity: item.similarity,
        id: item.id,
      })) || [];

  console.log(
    `[SimilaritySearch] After filtering (threshold ${threshold}): ${filtered.length} chunks`
  );

  if (filtered.length === 0 && data && data.length > 0) {
    const maxSimilarity = Math.max(...data.map((d) => d.similarity || 0));
    console.log(
      `[SimilaritySearch] No chunks passed threshold. Highest similarity: ${maxSimilarity.toFixed(
        3
      )}`
    );
  }

  return filtered;
}

async function fallbackSimilaritySearch(
  queryEmbedding,
  limit,
  threshold,
  metadataFilter
) {
  let query = client
    .from("document_chunks")
    .select("id, content, metadata, embedding")
    .not("embedding", "is", null)
    .limit(limit * 10);

  if (Object.keys(metadataFilter).length > 0) {
    for (const [key, value] of Object.entries(metadataFilter)) {
      query = query.eq(`metadata->${key}`, value);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error in fallback search:", error);
    throw new Error(`Failed to search: ${error.message}`);
  }

  const results = data
    .map((item) => {
      const similarity = cosineSimilarity(queryEmbedding, item.embedding);
      return {
        id: item.id,
        content: item.content,
        metadata: item.metadata || {},
        similarity,
      };
    })
    .filter((item) => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return results;
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
