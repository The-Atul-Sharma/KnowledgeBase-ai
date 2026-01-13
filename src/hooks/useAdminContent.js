"use client";

import { useState } from "react";

export function useAdminContent(user, loadSources, searchQuery, currentPage) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [documentSource, setDocumentSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!source.trim()) {
      setMessage({ type: "error", text: "Title is required" });
      return;
    }
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
            screen: source.trim() || "Manual Upload",
          },
          replace: false,
          userId: user?.id,
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
        if (loadSources) {
          loadSources(searchQuery, currentPage);
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

  const handleDocumentUpload = async (file, sourceTitle) => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("source", sourceTitle.trim() || "");
      formData.append("userId", user?.id || "");
      formData.append("replace", "false");

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Successfully ingested ${data.chunksCount} chunks from document!`,
        });
        setDocumentSource("");
        if (loadSources) {
          loadSources(searchQuery, currentPage);
        }
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to ingest document",
        });
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
        `/api/ingest?source=${encodeURIComponent(sourceToDelete)}&userId=${
          user?.id || ""
        }`,
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
        if (loadSources) {
          loadSources(searchQuery, currentPage);
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    text,
    setText,
    source,
    setSource,
    documentSource,
    setDocumentSource,
    loading,
    message,
    setMessage,
    handleIngest,
    handleDocumentUpload,
    handleDelete,
  };
}
