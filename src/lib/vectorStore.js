import { supabaseAdmin, supabase } from "./supabase";
import { generateEmbeddings, generateEmbedding } from "./embeddings";

const client = supabaseAdmin || supabase;

export async function storeChunks(chunks, embeddingProvider = null) {
  if (!chunks?.length) throw new Error("No chunks provided");

  const contents = chunks.map((c) => c.content);
  const embeddings = await generateEmbeddings(contents, embeddingProvider);

  const records = chunks.map((chunk, i) => ({
    content: chunk.content,
    metadata: chunk.metadata || {},
    embedding: embeddings[i],
  }));

  const { error } = await client.from("document_chunks").insert(records);

  if (error) throw error;
}

export async function ingestContent(text, metadata = {}, embeddingProvider) {
  const { chunkText } = await import("./textProcessing.js");
  const chunks = await chunkText(text, { metadata });
  return storeChunks(chunks, embeddingProvider);
}

export async function deleteChunksByMetadata(metadataFilter) {
  let query = client.from("document_chunks").delete();

  for (const [k, v] of Object.entries(metadataFilter)) {
    query = query.eq(`metadata->>${k}`, String(v));
  }

  const { error } = await query;
  if (error) throw error;
}

export async function similaritySearch(query, options = {}) {
  const {
    limit = 7,
    threshold = 0.15,
    metadataFilter = {},
    embeddingProvider = null,
  } = options;

  const queryEmbedding = await generateEmbedding(query, embeddingProvider);

  let rpc = client.rpc("match_document_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
  });

  for (const [k, v] of Object.entries(metadataFilter)) {
    rpc = rpc.eq(`metadata->${k}`, v);
  }

  const { data, error } = await rpc;
  if (error) throw error;

  return (data || []).map((d) => ({
    id: d.id,
    content: d.content,
    metadata: d.metadata,
    similarity: d.similarity,
  }));
}
