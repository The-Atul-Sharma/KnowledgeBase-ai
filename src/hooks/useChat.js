"use client";

import { useState } from "react";

const DEFAULT_LIMIT = 5;
const DEFAULT_THRESHOLD = 0.3;

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (query, provider) => {
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
          provider,
          limit: DEFAULT_LIMIT,
          threshold: DEFAULT_THRESHOLD,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            provider: data.provider,
            chunksUsed: data.chunksUsed,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${data.error || "Failed to get response"}`,
            isError: true,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage, setMessages };
}

