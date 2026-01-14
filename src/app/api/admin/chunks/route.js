import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "5", 10);
    const userId = searchParams.get("userId");

    if (!source) {
      return Response.json(
        {
          success: false,
          error: "Source parameter is required",
        },
        { status: 400 }
      );
    }

    let dbQuery = supabase
      .from("document_chunks")
      .select("*", { count: "exact" })
      .eq("metadata->>source", source)
      .order("created_at", { ascending: false });

    if (userId) {
      dbQuery = dbQuery.eq("user_id", userId);
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage - 1;
    dbQuery = dbQuery.range(startIndex, endIndex);

    const { data, error, count } = await dbQuery;

    if (error) {
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    const totalChunks = count || 0;
    const totalPages = Math.ceil(totalChunks / itemsPerPage);

    return Response.json({
      success: true,
      chunks: (data || []).map((chunk) => ({
        id: chunk.id,
        content: chunk.content,
        metadata: chunk.metadata,
        createdAt: chunk.created_at,
      })),
      totalChunks,
      currentPage: page,
      totalPages,
      itemsPerPage,
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
