"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/Modal";
import Pagination from "./Pagination";

export default function ChunksModal({ isOpen, onClose, source, userId }) {
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalChunks, setTotalChunks] = useState(0);

  const fetchChunks = useCallback(
    async (page = 1) => {
      if (!source) return;
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/chunks?source=${encodeURIComponent(
            source
          )}&page=${page}&itemsPerPage=5&userId=${userId || ""}`
        );
        const data = await response.json();
        if (data.success) {
          setChunks(data.chunks || []);
          setTotalPages(data.totalPages || 1);
          setTotalChunks(data.totalChunks || 0);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Error fetching chunks:", error);
      } finally {
        setLoading(false);
      }
    },
    [source, userId]
  );

  useEffect(() => {
    if (isOpen && source) {
      setCurrentPage(1);
      fetchChunks(1);
    }
  }, [isOpen, source, fetchChunks]);

  const handlePageChange = (page) => {
    fetchChunks(page);
  };

  const handleClose = () => {
    setChunks([]);
    setCurrentPage(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={source ? `Chunks for: ${source}` : "Chunks"}
      maxWidth="max-w-4xl"
      footer={
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={5}
          totalItems={totalChunks}
          itemLabel="chunks"
          disabled={loading}
        />
      }
    >
      <div className="space-y-4 h-full flex flex-col">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading chunks...
          </div>
        ) : chunks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No chunks found</div>
        ) : (
          <>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Total: {totalChunks} chunks
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto">
              {chunks.map((chunk, index) => {
                const chunkNumber = (currentPage - 1) * 5 + index + 1;
                return (
                  <div
                    key={chunk.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Chunk {chunkNumber}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {chunk.content}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Created: {new Date(chunk.createdAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
