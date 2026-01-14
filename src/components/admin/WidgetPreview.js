"use client";

import { useState } from "react";
import Image from "next/image";
import { DEFAULT_SETTINGS } from "@/constants";

const DEFAULT_ICON_BG = "#3B82F6";

function useCustomization(settings) {
  return {
    chatbot_name: settings.chatbot_name || DEFAULT_SETTINGS.chatbot_name,
    header_title: settings.header_title || DEFAULT_SETTINGS.header_title,
    icon_url: settings.icon_url || "",
    greeting_message:
      settings.greeting_message || DEFAULT_SETTINGS.greeting_message,
    input_placeholder:
      settings.input_placeholder || DEFAULT_SETTINGS.input_placeholder,
    header_color: settings.header_color || DEFAULT_SETTINGS.header_color,
    header_text_color:
      settings.header_text_color || DEFAULT_SETTINGS.header_text_color,
    chatbot_icon_bg_color:
      settings.chatbot_icon_bg_color || DEFAULT_SETTINGS.chatbot_icon_bg_color,
    close_icon_color:
      settings.close_icon_color || DEFAULT_SETTINGS.close_icon_color,
    close_icon_bg_color:
      settings.close_icon_bg_color || DEFAULT_SETTINGS.close_icon_bg_color,
    response_card_color:
      settings.response_card_color || DEFAULT_SETTINGS.response_card_color,
    response_text_color:
      settings.response_text_color || DEFAULT_SETTINGS.response_text_color,
    response_metadata_color:
      settings.response_metadata_color ||
      DEFAULT_SETTINGS.response_metadata_color,
    user_card_color:
      settings.user_card_color || DEFAULT_SETTINGS.user_card_color,
    user_text_color:
      settings.user_text_color || DEFAULT_SETTINGS.user_text_color,
    send_icon_color:
      settings.send_icon_color || DEFAULT_SETTINGS.send_icon_color,
  };
}

function ChatIcon({
  iconUrl,
  iconError,
  onIconError,
  onIconLoad,
  chatbotName,
  bgColor,
  size = "large",
}) {
  const isLarge = size === "large";
  const containerSize = isLarge ? "w-10 h-10" : "w-4 h-4";
  const imageSize = isLarge ? 40 : 16;
  const roundedClass = isLarge ? "rounded-full" : "rounded";

  if (iconUrl && !iconError) {
    return (
      <div
        className={`${containerSize} ${roundedClass} flex items-center justify-center overflow-hidden relative`}
        style={{ backgroundColor: bgColor || DEFAULT_ICON_BG }}
      >
        <Image
          key={iconUrl}
          src={iconUrl}
          alt={chatbotName}
          width={imageSize}
          height={imageSize}
          className={`object-contain ${roundedClass}`}
          unoptimized
          onError={onIconError}
          onLoad={onIconLoad}
        />
      </div>
    );
  }

  if (isLarge) {
    return (
      <svg
        className="w-6 h-6 text-white"
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
    );
  }

  return <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>;
}

function WidgetHeader({ customization, iconError, onIconError, onIconLoad }) {
  return (
    <div
      className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-800"
      style={{
        backgroundColor: customization.header_color,
        color: customization.header_text_color,
      }}
    >
      <div className="flex items-center gap-1.5">
        <ChatIcon
          iconUrl={customization.icon_url}
          iconError={iconError}
          onIconError={onIconError}
          onIconLoad={onIconLoad}
          chatbotName={customization.chatbot_name}
          bgColor={customization.chatbot_icon_bg_color}
          size="small"
        />
        <h3 className="font-semibold text-xs">{customization.header_title}</h3>
      </div>
      <button
        className="w-4 h-4 flex items-center justify-center rounded transition-colors opacity-80"
        style={{
          backgroundColor: customization.close_icon_bg_color,
        }}
        aria-label="Close chat"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          style={{
            stroke: customization.close_icon_color,
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

function MessageBubble({
  message,
  isUser = false,
  showMetadata = false,
  customization,
}) {
  const cardColor = isUser
    ? customization.user_card_color
    : customization.response_card_color;
  const textColor = isUser
    ? customization.user_text_color
    : customization.response_text_color;
  const borderClass = isUser
    ? ""
    : "border border-gray-200 dark:border-gray-600";

  return (
    <div
      className={`max-w-[75%] rounded-lg p-2 text-xs ${borderClass}`}
      style={{
        backgroundColor: cardColor,
        color: textColor,
      }}
    >
      <div className="whitespace-pre-wrap break-words">{message}</div>
      {showMetadata && (
        <div
          className="text-[10px] mt-1 flex items-center gap-1"
          style={{
            color: customization.response_metadata_color,
          }}
        >
          <span>{customization.chatbot_name}</span>
          <span>•</span>
          <span>AI Agent</span>
        </div>
      )}
    </div>
  );
}

function ChatInput({ placeholder, sendIconColor }) {
  return (
    <div className="p-2 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="relative">
        <textarea
          value=""
          placeholder={placeholder}
          rows={1}
          className="w-full px-2 py-1.5 pr-8 text-xs border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 resize-none"
          style={{
            minHeight: "1.75rem",
            maxHeight: "5rem",
          }}
          readOnly
        />
        <button
          type="button"
          className="absolute right-1.5 bottom-1.5 p-1 transition-colors"
          style={{
            color: sendIconColor,
          }}
          aria-label="Send message"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function WidgetPreview({ settings }) {
  const [iconError, setIconError] = useState(false);
  const customization = useCustomization(settings);

  const handleIconError = () => setIconError(true);
  const handleIconLoad = () => setIconError(false);

  return (
    <div className="flex items-end gap-4 max-w-md">
      <div className="flex-shrink-0">
        <button
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 cursor-pointer"
          style={{
            backgroundColor:
              customization.chatbot_icon_bg_color || DEFAULT_ICON_BG,
          }}
          aria-label="Open chat"
        >
          <ChatIcon
            iconUrl={customization.icon_url}
            iconError={iconError}
            onIconError={handleIconError}
            onIconLoad={handleIconLoad}
            chatbotName={customization.chatbot_name}
            bgColor={customization.chatbot_icon_bg_color}
            size="large"
          />
        </button>
      </div>
      <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <WidgetHeader
          customization={customization}
          iconError={iconError}
          onIconError={handleIconError}
          onIconLoad={handleIconLoad}
        />

        <div className="p-2 space-y-2 bg-gray-50 dark:bg-gray-800 min-h-[200px] max-h-[200px] overflow-y-auto">
          <div className="flex justify-start">
            <MessageBubble
              message={customization.greeting_message}
              showMetadata
              customization={customization}
            />
          </div>

          <div className="flex justify-end">
            <MessageBubble
              message="Sample user message"
              isUser
              customization={customization}
            />
          </div>

          <div className="flex justify-start">
            <MessageBubble
              message="This is a sample response from the chatbot"
              showMetadata
              customization={customization}
            />
          </div>
        </div>

        <ChatInput
          placeholder={customization.input_placeholder}
          sendIconColor={customization.send_icon_color}
        />
      </div>
    </div>
  );
}
