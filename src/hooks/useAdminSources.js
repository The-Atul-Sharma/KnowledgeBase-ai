"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const ITEMS_PER_PAGE = 5;

export function useAdminSources(user, activeTab) {
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSources, setTotalSources] = useState(0);
  const searchDebounceRef = useRef(null);
  const isInitialLoadRef = useRef(false);

  const loadSources = useCallback(
    async (search = "", page = 1) => {
      setLoadingSources(true);
      try {
        const params = new URLSearchParams();
        if (search) {
          params.append("search", search);
        }
        params.append("page", page.toString());
        params.append("itemsPerPage", ITEMS_PER_PAGE.toString());
        if (user?.id) {
          params.append("userId", user.id);
        }

        const response = await fetch(`/api/admin/list?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setSources(data.sources || []);
          setTotalPages(data.totalPages || 1);
          setTotalSources(data.totalSources || 0);
          setCurrentPage(data.currentPage || 1);
        }
      } catch (error) {
        console.error("Failed to load sources:", error);
      } finally {
        setLoadingSources(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (activeTab === "delete") {
      isInitialLoadRef.current = true;
      loadSources("", 1);
      setSearchQuery("");
      setCurrentPage(1);
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 0);
    }
  }, [activeTab, loadSources]);

  useEffect(() => {
    if (activeTab === "delete" && !isInitialLoadRef.current) {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      searchDebounceRef.current = setTimeout(() => {
        loadSources(searchQuery, 1);
        searchDebounceRef.current = null;
      }, 500);
      return () => {
        if (searchDebounceRef.current) {
          clearTimeout(searchDebounceRef.current);
          searchDebounceRef.current = null;
        }
      };
    }
  }, [searchQuery, activeTab, loadSources]);

  useEffect(() => {
    if (
      activeTab === "delete" &&
      !searchDebounceRef.current &&
      !isInitialLoadRef.current
    ) {
      loadSources(searchQuery, currentPage);
    }
  }, [currentPage, activeTab, searchQuery, loadSources]);

  return {
    sources,
    loadingSources,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    totalSources,
    itemsPerPage: ITEMS_PER_PAGE,
    loadSources,
  };
}
