"use client";

import { DEFAULT_SETTINGS } from "@/constants";

export default function WidgetHeader({ customization, onClose }) {
  return (
    <div
      className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 rounded-t-lg"
      style={{
        backgroundColor:
          customization.header_color || DEFAULT_SETTINGS.header_color,
        color:
          customization.header_text_color || DEFAULT_SETTINGS.header_text_color,
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <h2 className="font-semibold">{customization.header_title}</h2>
      </div>
      <button
        onClick={onClose}
        className="w-6 h-6 flex items-center justify-center rounded transition-colors opacity-80 hover:opacity-100 cursor-pointer"
        style={{
          backgroundColor:
            customization.close_icon_bg_color ||
            DEFAULT_SETTINGS.close_icon_bg_color,
        }}
        aria-label="Close chat"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          style={{
            stroke:
              customization.close_icon_color ||
              DEFAULT_SETTINGS.close_icon_color,
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
