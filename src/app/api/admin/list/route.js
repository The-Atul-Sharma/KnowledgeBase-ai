import { supabase } from "@/lib/supabase";

function groupChunksBySource(chunks) {
  const grouped = {};

  chunks?.forEach((chunk) => {
    const source = chunk.metadata?.source || "unknown";
    if (!grouped[source]) {
      grouped[source] = {
        source,
        totalChunks: 0,
        createdAt: chunk.created_at,
      };
    }
    grouped[source].totalChunks++;
  });

  return Object.values(grouped);
}

function filterSources(sources, searchQuery) {
  if (!searchQuery) {
    return sources;
  }

  const lowerQuery = searchQuery.toLowerCase();
  return sources.filter((sourceItem) => {
    return sourceItem.source.toLowerCase().includes(lowerQuery);
  });
}

function paginate(items, page, itemsPerPage) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalPages,
    currentPage: page,
    totalItems: items.length,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "5", 10);
    const userId = searchParams.get("userId");

    let dbQuery = supabase
      .from("document_chunks")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (userId) {
      dbQuery = dbQuery.eq("user_id", userId);
    }

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

    const sources = groupChunksBySource(data);
    const filteredSources = filterSources(sources, searchQuery);
    const pagination = paginate(filteredSources, page, itemsPerPage);

    return Response.json({
      success: true,
      totalChunks: count || 0,
      sources: pagination.items,
      totalSources: pagination.totalItems,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
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
