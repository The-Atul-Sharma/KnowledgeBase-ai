"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./Chat/ChatHeader";
import MessageBubble from "./Chat/MessageBubble";
import ChatInput from "./Chat/ChatInput";
import LoadingIndicator from "./Chat/LoadingIndicator";

export default function Chat() {
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState("openai");
  const { messages, loading, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (query) => {
    setInput("");
    sendMessage(query, provider);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-black">
      <ChatHeader
        provider={provider}
        onProviderChange={setProvider}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {loading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
