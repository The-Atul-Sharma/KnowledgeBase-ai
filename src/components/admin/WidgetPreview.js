"use client";

import { useState } from "react";
import Image from "next/image";
import { DEFAULT_SETTINGS } from "@/constants";

export default function WidgetPreview({ settings }) {
  const [iconError, setIconError] = useState(false);
  const customization = {
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

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <div
        className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-800"
        style={{
          backgroundColor: customization.header_color,
          color: customization.header_text_color,
        }}
      >
        <div className="flex items-center gap-1.5">
          {customization.icon_url && !iconError ? (
            <div
              className="w-4 h-4 rounded flex items-center justify-center overflow-hidden relative"
              style={{
                backgroundColor: customization.chatbot_icon_bg_color,
              }}
            >
              <Image
                key={customization.icon_url}
                src={customization.icon_url}
                alt={customization.chatbot_name}
                width={16}
                height={16}
                className="object-contain rounded"
                unoptimized
                onError={() => setIconError(true)}
                onLoad={() => setIconError(false)}
              />
            </div>
          ) : (
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          )}
          <h3 className="font-semibold text-xs">
            {customization.header_title}
          </h3>
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

      <div className="p-2 space-y-2 bg-gray-50 dark:bg-gray-800 min-h-[200px] max-h-[200px] overflow-y-auto">
        <div className="flex justify-start">
          <div
            className="max-w-[75%] rounded-lg p-2 text-xs border border-gray-200 dark:border-gray-600"
            style={{
              backgroundColor: customization.response_card_color,
              color: customization.response_text_color,
            }}
          >
            <div className="whitespace-pre-wrap break-words">
              {customization.greeting_message}
            </div>
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
          </div>
        </div>

        <div className="flex justify-end">
          <div
            className="max-w-[75%] rounded-lg p-2 text-xs"
            style={{
              backgroundColor: customization.user_card_color,
              color: customization.user_text_color,
            }}
          >
            <div className="whitespace-pre-wrap break-words">
              Sample user message
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <div
            className="max-w-[75%] rounded-lg p-2 text-xs border border-gray-200 dark:border-gray-600"
            style={{
              backgroundColor: customization.response_card_color,
              color: customization.response_text_color,
            }}
          >
            <div className="whitespace-pre-wrap break-words">
              This is a sample response from the chatbot
            </div>
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
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="relative">
          <textarea
            value=""
            placeholder={customization.input_placeholder}
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
              color: customization.send_icon_color,
            }}
            aria-label="Send message"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
