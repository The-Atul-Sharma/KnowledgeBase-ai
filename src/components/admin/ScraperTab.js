"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "@/components/Modal";

const ITEMS_PER_PAGE = 5;
const DEPTH_OPTIONS = [
  { value: 0, label: "0 - Current page only" },
  { value: 1, label: "1 - Follow links 1 level deep" },
  { value: 2, label: "2 - Follow links 2 levels deep" },
  { value: 3, label: "3 - Follow links 3 levels deep" },
];

function ScrapeForm({
  url,
  depth,
  loading,
  onUrlChange,
  onDepthChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Website URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
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
          onChange={(e) => onDepthChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
        >
          {DEPTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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
  );
}

function ScrapedPageItem({ page, index, isSelected, onSelect }) {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700 flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(index)}
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
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}

function ScrapedPagesList({
  pages,
  currentPage,
  selectedPages,
  pagesScraped,
  onPageChange,
  onSelectPage,
  onSelectAll,
  onIngestClick,
  selectAllCheckboxRef,
  scrapedPagesRef,
}) {
  const totalPages = Math.ceil(pages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedPages = pages.slice(startIndex, endIndex);

  const allSelected = pages.length > 0 && selectedPages.size === pages.length;
  const someSelected =
    selectedPages.size > 0 && selectedPages.size < pages.length;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected, selectAllCheckboxRef]);

  if (!pages || pages.length === 0) return null;

  return (
    <div ref={scrapedPagesRef} className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Scraped Pages</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              ref={selectAllCheckboxRef}
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
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
              onClick={onIngestClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Ingest Selected ({selectedPages.size})
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {displayedPages.map((page, index) => {
          const actualIndex = startIndex + index;
          return (
            <ScrapedPageItem
              key={actualIndex}
              page={page}
              index={actualIndex}
              isSelected={selectedPages.has(actualIndex)}
              onSelect={onSelectPage}
            />
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function IngestModal({
  isOpen,
  ingestTitle,
  ingestLoading,
  onClose,
  onTitleChange,
  onIngest,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Title for Ingest"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={ingestLoading}
            type="button"
            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-600 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onIngest}
            disabled={ingestLoading || !ingestTitle.trim()}
            type="button"
            className="text-white bg-blue-500 border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {ingestLoading ? "Ingesting..." : "Ingest"}
          </button>
        </>
      }
    >
      <div className="px-2">
        <input
          type="text"
          value={ingestTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g., product-overview, documentation"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
          autoFocus
        />
      </div>
    </Modal>
  );
}

function useScraper() {
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [pagesScraped, setPagesScraped] = useState(0);
  const [error, setError] = useState("");

  const validateUrl = useCallback((urlToValidate) => {
    const trimmed = urlToValidate?.trim();
    if (!trimmed || trimmed === "") {
      return "Please enter a valid URL";
    }
    if (trimmed.toLowerCase().includes("undefined")) {
      return "URL contains 'undefined' and cannot be scraped";
    }
    return null;
  }, []);

  const scrape = useCallback(
    async (urlToScrape, depthValue) => {
      const validationError = validateUrl(urlToScrape);
      if (validationError) {
        setError(validationError);
        return false;
      }

      setLoading(true);
      setError("");
      setPages([]);
      setPagesScraped(0);

      try {
        const response = await fetch("/api/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: urlToScrape.trim(),
            depth: parseInt(depthValue) || 0,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setPages(data.pages || []);
          setPagesScraped(data.pagesScraped || 1);
          return true;
        } else {
          setError(data.error || "Failed to scrape website");
          return false;
        }
      } catch (err) {
        setError(err.message || "An error occurred while scraping");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [validateUrl]
  );

  const reset = useCallback(() => {
    setPages([]);
    setPagesScraped(0);
    setError("");
  }, []);

  return {
    url,
    depth,
    loading,
    pages,
    pagesScraped,
    error,
    setUrl,
    setDepth,
    scrape,
    reset,
    setError,
  };
}

function useSelection(pages) {
  const [selectedPages, setSelectedPages] = useState(new Set());

  const selectPage = useCallback((index) => {
    setSelectedPages((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      return newSelected;
    });
  }, []);

  const selectAll = useCallback(
    (checked) => {
      if (checked) {
        const allIndices = new Set(pages.map((_, index) => index));
        setSelectedPages(allIndices);
      } else {
        setSelectedPages(new Set());
      }
    },
    [pages]
  );

  const clearSelection = useCallback(() => {
    setSelectedPages(new Set());
  }, []);

  return {
    selectedPages,
    selectPage,
    selectAll,
    clearSelection,
  };
}

function useIngest(user) {
  const [ingestLoading, setIngestLoading] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [ingestTitle, setIngestTitle] = useState("");

  const prepareContent = useCallback((selectedPages, pages) => {
    const selectedPagesArray = Array.from(selectedPages);
    return selectedPagesArray
      .map((index) => pages[index])
      .map((page) => `URL: ${page.url}\n\n${page.content}`)
      .join("\n\n---\n\n");
  }, []);

  const ingest = useCallback(
    async (selectedPages, pages, title) => {
      if (!title.trim()) {
        return { success: false, error: "Please enter a title" };
      }

      if (!user) {
        return {
          success: false,
          error: "You must be logged in to ingest content",
        };
      }

      setIngestLoading(true);

      try {
        const selectedContent = prepareContent(selectedPages, pages);

        const response = await fetch("/api/ingest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: selectedContent,
            metadata: {
              source: title.trim(),
              screen: title.trim(),
            },
            replace: false,
            userId: user.id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setShowTitleModal(false);
          setIngestTitle("");
          return {
            success: true,
            message: `Successfully ingested ${data.chunksCount} chunks!`,
          };
        } else {
          return {
            success: false,
            error: data.error || "Failed to ingest content",
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err.message || "An error occurred while ingesting",
        };
      } finally {
        setIngestLoading(false);
      }
    },
    [user, prepareContent]
  );

  const openModal = useCallback(() => {
    setShowTitleModal(true);
    setIngestTitle("");
  }, []);

  const closeModal = useCallback(() => {
    setShowTitleModal(false);
    setIngestTitle("");
  }, []);

  return {
    ingestLoading,
    showTitleModal,
    ingestTitle,
    setIngestTitle,
    ingest,
    openModal,
    closeModal,
  };
}

function usePagination(totalItems, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    goToPage,
    reset,
  };
}

export default function ScraperTab({ user, setMessage }) {
  const scrapedPagesRef = useRef(null);
  const selectAllCheckboxRef = useRef(null);

  const scraper = useScraper();
  const selection = useSelection(scraper.pages);
  const ingest = useIngest(user);
  const pagination = usePagination(scraper.pages.length, ITEMS_PER_PAGE);

  const handleScrape = async (e) => {
    e.preventDefault();
    const success = await scraper.scrape(scraper.url, scraper.depth);
    if (success) {
      selection.clearSelection();
      pagination.reset();
    }
  };

  const handlePageChange = (newPage) => {
    pagination.goToPage(newPage);
    scrapedPagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleIngestClick = () => {
    if (selection.selectedPages.size === 0) {
      scraper.setError("Please select at least one page to ingest");
      return;
    }
    ingest.openModal();
  };

  const handleIngest = async () => {
    const result = await ingest.ingest(
      selection.selectedPages,
      scraper.pages,
      ingest.ingestTitle
    );

    if (result.success) {
      scraper.setError("");
      selection.clearSelection();
      setMessage({ type: "success", text: result.message });
    } else {
      scraper.setError(result.error);
      setMessage({ type: "error", text: result.error });
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Website Scraper</h2>
      <ScrapeForm
        url={scraper.url}
        depth={scraper.depth}
        loading={scraper.loading}
        onUrlChange={scraper.setUrl}
        onDepthChange={scraper.setDepth}
        onSubmit={handleScrape}
      />
      {scraper.error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          {scraper.error}
        </div>
      )}
      <ScrapedPagesList
        pages={scraper.pages}
        currentPage={pagination.currentPage}
        selectedPages={selection.selectedPages}
        pagesScraped={scraper.pagesScraped}
        onPageChange={handlePageChange}
        onSelectPage={selection.selectPage}
        onSelectAll={selection.selectAll}
        onIngestClick={handleIngestClick}
        selectAllCheckboxRef={selectAllCheckboxRef}
        scrapedPagesRef={scrapedPagesRef}
      />
      <IngestModal
        isOpen={ingest.showTitleModal}
        ingestTitle={ingest.ingestTitle}
        ingestLoading={ingest.ingestLoading}
        onClose={ingest.closeModal}
        onTitleChange={ingest.setIngestTitle}
        onIngest={handleIngest}
      />
    </section>
  );
}
