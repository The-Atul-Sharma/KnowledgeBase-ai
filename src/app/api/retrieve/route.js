import { similaritySearch } from "@/lib/vectorStore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, limit = 5, threshold = 0.7, metadataFilter = {}, userId } = body;

    if (!query || typeof query !== "string") {
      return Response.json(
        { success: false, error: "Query text is required" },
        { status: 400 }
      );
    }

    const results = await similaritySearch(query, {
      limit: Math.min(limit, 20),
      threshold,
      metadataFilter,
      userId: userId || null,
    });

    return Response.json({
      success: true,
      query,
      resultsCount: results.length,
      results: results.map((result) => ({
        content: result.content,
        metadata: result.metadata,
        similarity: result.similarity,
      })),
    });
  } catch (error) {
    console.error("Retrieval error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to retrieve content",
      },
      { status: 500 }
    );
  }
}

