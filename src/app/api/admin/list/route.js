import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error, count } = await supabase
      .from("document_chunks")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    const groupedBySource = {};
    const totalChunks = count || 0;

    data?.forEach((chunk) => {
      const source = chunk.metadata?.source || "unknown";
      if (!groupedBySource[source]) {
        groupedBySource[source] = {
          source,
          chunks: [],
          totalChunks: 0,
          category: chunk.metadata?.category || "N/A",
          screen: chunk.metadata?.screen || "N/A",
          createdAt: chunk.created_at,
        };
      }
      groupedBySource[source].chunks.push({
        id: chunk.id,
        content: chunk.content.substring(0, 150) + "...",
        similarity: null,
      });
      groupedBySource[source].totalChunks++;
    });

    const sources = Object.values(groupedBySource);

    return Response.json({
      success: true,
      totalChunks,
      sources,
      chunks: data?.map((chunk) => ({
        id: chunk.id,
        content: chunk.content.substring(0, 200) + "...",
        metadata: chunk.metadata,
        createdAt: chunk.created_at,
      })) || [],
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

