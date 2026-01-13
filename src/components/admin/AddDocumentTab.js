"use client";

import { useEffect } from "react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";

const FILE_ACCEPT = ".pdf,.docx,.txt";
const MAX_FILE_SIZE_MB = 10;

const ERROR_MESSAGES = {
  NO_FILE: "Please select a file",
  PREVIEW_LOADING: "Please wait for document preview to load",
};

const formatFileSize = (bytes) => {
  return (bytes / 1024).toFixed(2);
};

export default function AddDocumentTab({
  source,
  setSource,
  loading,
  handleDocumentUpload,
  message,
}) {
  const {
    file,
    preview,
    previewLoading,
    error,
    setError,
    handleFileChange,
    resetFileState,
  } = useDocumentUpload(source, setSource);

  useEffect(() => {
    if (
      message?.type === "success" &&
      !loading &&
      message?.text?.includes("ingested")
    ) {
      resetFileState();
      const fileInput = document.getElementById("file-upload");
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [message, loading, resetFileState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!source.trim()) {
      setError("Title is required");
      return;
    }

    if (!file) {
      setError(ERROR_MESSAGES.NO_FILE);
      return;
    }

    if (!preview) {
      setError(ERROR_MESSAGES.PREVIEW_LOADING);
      return;
    }

    await handleDocumentUpload(file, source);
  };

  const isDisabled = loading || previewLoading;
  const canSubmit = preview && file && !isDisabled;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Add Document</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g., product-docs, user-manual etc."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Document
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              accept={FILE_ACCEPT}
              onChange={handleFileChange}
              className="hidden"
              disabled={isDisabled}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PDF, DOCX, or TXT (Max {MAX_FILE_SIZE_MB}MB)
              </span>
            </label>
          </div>

          {previewLoading && (
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              Reading document...
            </div>
          )}

          {file && !previewLoading && (
            <div className="mt-2 flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  ({formatFileSize(file.size)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={resetFileState}
                className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          {error && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {preview && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Document Preview
              </label>
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                  {preview}
                </pre>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ✓ Document parsed successfully. Review the preview above, then
                click the button below to ingest.
              </p>
            </div>
          </div>
        )}

        {preview && (
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
          >
            {loading ? "Ingesting Document..." : "Ingest Document"}
          </button>
        )}
      </form>
    </section>
  );
}
