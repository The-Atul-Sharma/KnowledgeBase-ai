import { ingestContent, deleteChunksByMetadata } from "@/lib/vectorStore";
import { EMBEDDING_PROVIDER } from "@/lib/embeddings";

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, metadata = {}, replace = false, embeddingProvider = EMBEDDING_PROVIDER } = body;

    if (!text || typeof text !== "string") {
      return Response.json(
        { success: false, error: "Text content is required" },
        { status: 400 }
      );
    }

    if (replace && metadata.source) {
      await deleteChunksByMetadata({ source: metadata.source });
    }

    const result = await ingestContent(
      text,
      {
        ...metadata,
        ingestedAt: new Date().toISOString(),
      },
      embeddingProvider
    );

    return Response.json({
      success: true,
      message: `Successfully ingested ${result.length} chunks`,
      chunksCount: result.length,
      chunks: result.map((chunk) => ({
        id: chunk.id,
        content: chunk.content.substring(0, 100) + "...",
        metadata: chunk.metadata,
      })),
    });
  } catch (error) {
    console.error("Ingestion error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to ingest content",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");

    if (!source) {
      return Response.json(
        { success: false, error: "Source parameter is required" },
        { status: 400 }
      );
    }

    const result = await deleteChunksByMetadata({ source });

    return Response.json({
      success: true,
      message: `Deleted ${result.length} chunks`,
      deletedCount: result.length,
    });
  } catch (error) {
    console.error("Deletion error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to delete content",
      },
      { status: 500 }
    );
  }
}

