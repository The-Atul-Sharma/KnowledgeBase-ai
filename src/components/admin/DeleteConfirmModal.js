"use client";

import Modal from "@/components/Modal";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  source,
  onConfirm,
  loading,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            type="button"
            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-600 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            type="button"
            className="text-white bg-red-500 border border-transparent hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </>
      }
    >
      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
        Are you sure you want to delete all chunks with source &quot;
        {source}&quot;? This action cannot be undone.
      </p>
    </Modal>
  );
}
