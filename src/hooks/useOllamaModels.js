"use client";

import { useState, useCallback } from "react";

export function useOllamaModels(settings) {
  const [ollamaModels, setOllamaModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  const loadOllamaModels = useCallback(async (url = null) => {
    setLoadingModels(true);
    try {
      const ollamaUrl =
        url || settings.ollama_api_url || "http://127.0.0.1:11434";
      const response = await fetch(
        `/api/ollama-models?url=${encodeURIComponent(ollamaUrl)}`
      );
      const data = await response.json();
      if (data.success) {
        setOllamaModels(data.models || []);
      }
    } catch (error) {
      console.error("Failed to load Ollama models:", error);
    } finally {
      setLoadingModels(false);
    }
  }, [settings.ollama_api_url]);

  return {
    ollamaModels,
    loadingModels,
    loadOllamaModels,
  };
}
