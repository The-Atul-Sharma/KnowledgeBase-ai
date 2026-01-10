"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("add");
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [deleteSource, setDeleteSource] = useState("");
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);

  useEffect(() => {
    if (activeTab === "delete") {
      loadSources();
    }
  }, [activeTab]);

  const loadSources = async () => {
    setLoadingSources(true);
    try {
      const response = await fetch("/api/admin/list");
      const data = await response.json();

      if (data.success) {
        setSources(data.sources || []);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to load sources" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoadingSources(false);
    }
  };

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setMessage({ type: "error", text: "Text content is required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          metadata: {
            source: source.trim() || "manual-upload",
            category: category.trim() || "general",
            screen: source.trim() || "Manual Upload",
          },
          replace: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Successfully ingested ${data.chunksCount} chunks!`,
        });
        setText("");
        setSource("");
        setCategory("");
        if (activeTab === "delete") {
          loadSources();
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to ingest" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sourceToDelete) => {
    if (!sourceToDelete) {
      setMessage({ type: "error", text: "Source is required for deletion" });
      return;
    }

    if (!confirm(`Delete all chunks with source "${sourceToDelete}"?`)) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/ingest?source=${encodeURIComponent(sourceToDelete)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Deleted ${data.deletedCount} chunks!`,
        });
        setDeleteSource("");
        loadSources();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Content Management</h1>
            <a
              href="/"
              className="text-blue-500 hover:text-blue-600 underline text-sm"
            >
              ← Back to Chat
            </a>
          </div>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("add")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "add"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Add Content
              </button>
              <button
                onClick={() => setActiveTab("delete")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "delete"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Delete Content
              </button>
            </nav>
          </div>

          {activeTab === "add" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Add Content</h2>
              <form onSubmit={handleIngest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Source/Screen Name
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g., product-overview, screen-1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., wearables, products, general"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content Text
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your product content here..."
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Processing..." : "Ingest Content"}
                </button>
              </form>
            </section>
          )}

          {activeTab === "delete" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Delete Content</h2>

              {loadingSources ? (
                <div className="text-center py-8 text-gray-500">
                  Loading content...
                </div>
              ) : sources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No content found. Add content using the "Add Content" tab.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Total: {sources.reduce((sum, s) => sum + s.totalChunks, 0)} chunks across {sources.length} source(s)
                  </div>

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
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
