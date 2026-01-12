"use client";

import { createContext, useContext, useState } from "react";

const ChatWidgetContext = createContext();

export function ChatWidgetProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChatWidget = () => {
    setIsOpen(true);
  };

  const closeChatWidget = () => {
    setIsOpen(false);
  };

  return (
    <ChatWidgetContext.Provider value={{ isOpen, openChatWidget, closeChatWidget, setIsOpen }}>
      {children}
    </ChatWidgetContext.Provider>
  );
}

export function useChatWidgetContext() {
  const context = useContext(ChatWidgetContext);
  if (!context) {
    throw new Error("useChatWidgetContext must be used within ChatWidgetProvider");
  }
  return context;
}

