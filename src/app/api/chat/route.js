import { generateRAGResponse } from "@/lib/rag";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      query,
      provider = "openai",
      limit = 5,
      threshold = 0.3,
      metadataFilter = {},
    } = body;

    if (!query || typeof query !== "string") {
      return Response.json(
        { success: false, error: "Query text is required" },
        { status: 400 }
      );
    }

    if (provider !== "openai" && provider !== "ollama") {
      return Response.json(
        { success: false, error: "Provider must be 'openai' or 'ollama'" },
        { status: 400 }
      );
    }

    const result = await generateRAGResponse(query, {
      provider,
      limit: Math.min(limit, 10),
      threshold,
      metadataFilter,
    });

    return Response.json({
      success: true,
      query,
      answer: result.answer,
      provider: result.provider,
      chunksUsed: result.chunks.length,
      chunks: result.chunks,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to generate response",
      },
      { status: 500 }
    );
  }
}
