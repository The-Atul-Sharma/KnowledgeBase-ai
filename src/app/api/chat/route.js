import { generateRAGResponse } from "@/lib/rag";
import { getSettings } from "@/lib/settings";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      query,
      userId,
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

    const settings = await getSettings(userId);
    const provider = settings.llm_provider || "ollama";

    if (provider === "openai" && !settings.openai_api_key) {
      return Response.json(
        {
          success: false,
          error: "OpenAI API key not configured. Please configure it in admin settings.",
        },
        { status: 400 }
      );
    }

    const result = await generateRAGResponse(query, {
      provider,
      settings,
      limit: Math.min(limit, 10),
      threshold,
      metadataFilter,
      userId: userId || null,
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
