"use client";

export default function DeleteContentTab({
  sources,
  loadingSources,
  totalSources,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
  currentPage,
  totalPages,
  itemsPerPage,
  loading,
  handleDelete,
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Delete Content</h2>

      {loadingSources ? (
        <div className="text-center py-8 text-gray-500">Loading content...</div>
      ) : sources.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No content found. Add content using the &quot;Add Content&quot; tab.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {sources.reduce((sum, s) => sum + s.totalChunks, 0)}{" "}
              chunks across {totalSources} source(s)
            </div>
            <div className="flex-1 max-w-md ml-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by source, category, or screen..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
          </div>

          {sources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? "No sources found matching your search."
                : 'No content found. Add content using the "Add Content" tab.'}
            </div>
          ) : (
            <>
              {sources.map((sourceItem) => (
                <div
                  key={sourceItem.source}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {sourceItem.source}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div>
                          <span className="font-medium">Category:</span>{" "}
                          {sourceItem.category}
                        </div>
                        <div>
                          <span className="font-medium">Screen:</span>{" "}
                          {sourceItem.screen}
                        </div>
                        <div>
                          <span className="font-medium">Chunks:</span>{" "}
                          {sourceItem.totalChunks}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(sourceItem.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(sourceItem.source)}
                      disabled={loading}
                      className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Sample content (first chunk):
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {sourceItem.chunks[0]?.content || "No content"}
                    </div>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalSources)} of{" "}
                    {totalSources} sources
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              currentPage === page
                                ? "bg-blue-500 text-white"
                                : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

