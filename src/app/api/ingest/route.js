import { ingestContent, deleteChunksByMetadata } from "@/lib/vectorStore";
import { getSettings } from "@/lib/settings";

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, metadata = {}, replace = false, userId } = body;
    
    const settings = await getSettings(userId);

    if (!text || typeof text !== "string") {
      return Response.json(
        { success: false, error: "Text content is required" },
        { status: 400 }
      );
    }

    if (replace && metadata.source) {
      await deleteChunksByMetadata({ source: metadata.source }, userId);
    }

    const result = await ingestContent(
      text,
      {
        ...metadata,
        ingestedAt: new Date().toISOString(),
      },
      settings,
      userId
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
    const userId = searchParams.get("userId");

    if (!source) {
      return Response.json(
        { success: false, error: "Source parameter is required" },
        { status: 400 }
      );
    }

    const result = await deleteChunksByMetadata({ source }, userId || null);

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

