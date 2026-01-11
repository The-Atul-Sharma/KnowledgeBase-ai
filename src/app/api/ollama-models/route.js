export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ollamaUrl = searchParams.get("url") || "http://127.0.0.1:11434";

    const normalizedUrl = ollamaUrl.startsWith("http")
      ? ollamaUrl
      : `http://${ollamaUrl}`;

    const response = await fetch(`${normalizedUrl}/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    const models = (data.models || []).map((model) => ({
      name: model.name,
      modified_at: model.modified_at,
      size: model.size,
    }));

    return Response.json({
      success: true,
      models,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to fetch Ollama models",
      },
      { status: 500 }
    );
  }
}

