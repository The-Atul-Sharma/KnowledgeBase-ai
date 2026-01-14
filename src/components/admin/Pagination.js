"use client";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  itemLabel = "items",
  disabled = false,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} {itemLabel}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const prevPage = Math.max(1, currentPage - 1);
            if (prevPage !== currentPage) {
              onPageChange(prevPage);
            }
          }}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                if (page !== currentPage) {
                  onPageChange(page);
                }
              }}
              disabled={disabled}
              className={`px-3 py-1 rounded-lg text-sm transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            const nextPage = Math.min(totalPages, currentPage + 1);
            if (nextPage !== currentPage) {
              onPageChange(nextPage);
            }
          }}
          disabled={currentPage === totalPages || disabled}
          className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
