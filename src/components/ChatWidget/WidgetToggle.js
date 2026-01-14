"use client";

import { useState } from "react";
import Image from "next/image";
import { DEFAULT_SETTINGS } from "@/constants";

export default function WidgetToggle({ onOpen, customization }) {
  const [iconError, setIconError] = useState(false);
  const iconBgColor =
    customization?.chatbot_icon_bg_color ||
    DEFAULT_SETTINGS.chatbot_icon_bg_color;

  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:brightness-110 z-50 cursor-pointer"
      style={{
        backgroundColor: iconBgColor,
      }}
      aria-label="Open chat"
    >
      {customization?.icon_url && !iconError ? (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden relative"
          style={{
            backgroundColor: iconBgColor,
          }}
        >
          <Image
            key={customization.icon_url}
            src={customization.icon_url}
            alt={customization.chatbot_name || "Chatbot"}
            width={40}
            height={40}
            className="object-contain rounded-full"
            unoptimized
            onError={() => setIconError(true)}
            onLoad={() => setIconError(false)}
          />
        </div>
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      )}
    </button>
  );
}
