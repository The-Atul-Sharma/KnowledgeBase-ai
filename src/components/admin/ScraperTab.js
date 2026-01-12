"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function ScraperTab() {
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const [pagesScraped, setPagesScraped] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [ingestLoading, setIngestLoading] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [ingestTitle, setIngestTitle] = useState("");
  const [toast, setToast] = useState(null);
  const scrapedPagesRef = useRef(null);
  const selectAllCheckboxRef = useRef(null);
  const { user } = useAuth();

  const handleScrape = async (e) => {
    e.preventDefault();

    const trimmedUrl = url?.trim();
    if (!trimmedUrl || trimmedUrl === undefined || trimmedUrl === "") {
      setError("Please enter a valid URL");
      return;
    }

    if (trimmedUrl.toLowerCase().includes("undefined")) {
      setError("URL contains 'undefined' and cannot be scraped");
      return;
    }

    setLoading(true);
    setError("");
    setPages([]);
    setPagesScraped(0);
    setCurrentPage(1);
    setSelectedPages(new Set());

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: trimmedUrl,
          depth: parseInt(depth) || 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPages(data.pages || []);
        setPagesScraped(data.pagesScraped || 1);
      } else {
        setError(data.error || "Failed to scrape website");
      }
    } catch (err) {
      setError(err.message || "An error occurred while scraping");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    scrapedPagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSelectPage = (index) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPages(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIndices = new Set(pages.map((_, index) => index));
      setSelectedPages(allIndices);
    } else {
      setSelectedPages(new Set());
    }
  };

  const handleIngestClick = () => {
    if (selectedPages.size === 0) {
      setError("Please select at least one page to ingest");
      return;
    }
    setShowTitleModal(true);
    setIngestTitle("");
  };

  const handleIngest = async () => {
    if (!ingestTitle.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!user) {
      setError("You must be logged in to ingest content");
      return;
    }

    setIngestLoading(true);
    setError("");

    try {
      const selectedPagesArray = Array.from(selectedPages);
      const selectedContent = selectedPagesArray
        .map((index) => pages[index])
        .map((page) => `URL: ${page.url}\n\n${page.content}`)
        .join("\n\n---\n\n");

      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: selectedContent,
          metadata: {
            source: ingestTitle.trim(),
            screen: ingestTitle.trim(),
          },
          replace: false,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setError("");
        setShowTitleModal(false);
        setSelectedPages(new Set());
        setIngestTitle("");
        setToast({
          type: "success",
          message: `Successfully ingested ${data.chunksCount} chunks!`,
        });
      } else {
        setError(data.error || "Failed to ingest content");
        setToast({
          type: "error",
          message: data.error || "Failed to ingest content",
        });
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while ingesting";
      setError(errorMessage);
      setToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIngestLoading(false);
    }
  };

  const allSelected = pages.length > 0 && selectedPages.size === pages.length;
  const someSelected =
    selectedPages.size > 0 && selectedPages.size < pages.length;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <section>
      {toast && (
        <div
          className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
          style={{
            transform: "translateX(-50%)",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-80 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Website Scraper</h2>
      <form onSubmit={handleScrape} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Scraping Depth (0 = current page only, 1-3 = follow links)
          </label>
          <select
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          >
            <option value={0}>0 - Current page only</option>
            <option value={1}>1 - Follow links 1 level deep</option>
            <option value={2}>2 - Follow links 2 levels deep</option>
            <option value={3}>3 - Follow links 3 levels deep</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Higher depth will scrape more pages but may take longer
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? "Scraping..." : "Scrape Website"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {pages && pages.length > 0 && (
        <div ref={scrapedPagesRef} className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Scraped Pages</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  ref={selectAllCheckboxRef}
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Select All
                </span>
              </label>
            </div>
            <div className="flex items-center gap-4">
              {pagesScraped > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {pagesScraped} page{pagesScraped !== 1 ? "s" : ""} scraped
                </span>
              )}
              {selectedPages.size > 0 && (
                <button
                  onClick={handleIngestClick}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Ingest Selected ({selectedPages.size})
                </button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {pages
              .slice((currentPage - 1) * 5, currentPage * 5)
              .map((page, index) => {
                const actualIndex = (currentPage - 1) * 5 + index;
                return (
                  <div
                    key={actualIndex}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700 flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPages.has(actualIndex)}
                        onChange={() => handleSelectPage(actualIndex)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline break-all flex-1"
                      >
                        {page.url}
                      </a>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                        {page.content}
                      </pre>
                    </div>
                  </div>
                );
              })}
          </div>
          {Math.ceil(pages.length / 5) > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {Math.ceil(pages.length / 5)}
              </span>
              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(Math.ceil(pages.length / 5), currentPage + 1)
                  )
                }
                disabled={currentPage >= Math.ceil(pages.length / 5)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {showTitleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Enter Title for Ingest
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={ingestTitle}
                  onChange={(e) => setIngestTitle(e.target.value)}
                  placeholder="e.g., product-overview, documentation"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowTitleModal(false);
                    setIngestTitle("");
                  }}
                  disabled={ingestLoading}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIngest}
                  disabled={ingestLoading || !ingestTitle.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {ingestLoading ? "Ingesting..." : "Ingest"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
