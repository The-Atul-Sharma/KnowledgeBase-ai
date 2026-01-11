"use client";

import { DEFAULT_SETTINGS } from "@/constants";

export default function WidgetInput({
  input,
  setInput,
  onSubmit,
  loading,
  isSetupComplete,
  customization,
  inputRef,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading && isSetupComplete) {
        onSubmit(e);
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
    >
      <div className="relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isSetupComplete
              ? customization.input_placeholder || DEFAULT_SETTINGS.input_placeholder
              : "Setup required..."
          }
          rows={1}
          className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 resize-none"
          style={{
            minHeight: "2.5rem",
            maxHeight: "7.5rem",
          }}
          disabled={loading || !isSetupComplete}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 bottom-2 p-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          style={{
            color: customization.send_icon_color || DEFAULT_SETTINGS.send_icon_color,
          }}
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
