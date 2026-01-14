"use client";

import { useState } from "react";
import Pagination from "./Pagination";
import ChunksModal from "./ChunksModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

function SourceListItem({ sourceItem, onViewChunks, onDelete, loading }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{sourceItem.source}</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
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
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onViewChunks(sourceItem)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm cursor-pointer"
          >
            View Chunks
          </button>
          <button
            onClick={() => onDelete(sourceItem)}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

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
  user,
}) {
  const [showChunksModal, setShowChunksModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  const handleViewChunks = (sourceItem) => {
    setSelectedSource(sourceItem);
    setShowChunksModal(true);
  };

  const handleDeleteClick = (sourceItem) => {
    setSelectedSource(sourceItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedSource) {
      handleDelete(selectedSource.source);
      setShowDeleteModal(false);
      setSelectedSource(null);
    }
  };

  const totalChunks = sources.reduce((sum, s) => sum + s.totalChunks, 0);

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
              Total: {totalChunks} chunks across {totalSources} source(s)
            </div>
            <div className="flex-1 max-w-md ml-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title"
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
                <SourceListItem
                  key={sourceItem.source}
                  sourceItem={sourceItem}
                  onViewChunks={handleViewChunks}
                  onDelete={handleDeleteClick}
                  loading={loading}
                />
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={totalSources}
                itemLabel="sources"
              />
            </>
          )}
        </div>
      )}

      <ChunksModal
        isOpen={showChunksModal}
        onClose={() => {
          setShowChunksModal(false);
          setSelectedSource(null);
        }}
        source={selectedSource?.source}
        userId={user?.id}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedSource(null);
        }}
        source={selectedSource?.source}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </section>
  );
}
