"use client";

import { DEFAULT_SETTINGS } from "@/constants";

export default function WidgetMessages({
  checkingSetup,
  isSetupComplete,
  messages,
  customization,
  greetingMessage,
  getFormattedTimestamp,
  loading,
  messagesEndRef,
}) {
  if (checkingSetup) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
        <p className="text-sm">Checking setup...</p>
      </div>
    );
  }

  if (!isSetupComplete) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
        <p className="text-sm mb-4">Chatbot setup is required.</p>
        <p className="text-xs mb-4">
          Please configure your LLM and embedding providers in the admin
          settings.
        </p>
        <a
          href="/admin"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          Go to Settings
        </a>
      </div>
    );
  }

  return (
    <>
      {messages.length === 0 && (
        <div className="flex justify-start">
          <div
            className="max-w-[80%] rounded-lg p-3 text-sm border border-gray-200 dark:border-gray-600"
            style={{
              backgroundColor: customization.response_card_color || DEFAULT_SETTINGS.response_card_color,
              color: customization.response_text_color || DEFAULT_SETTINGS.response_text_color,
            }}
          >
            <div className="whitespace-pre-wrap break-words">
              {greetingMessage}
            </div>
            <div
              className="text-xs mt-2 flex items-center gap-1"
              style={{
                color: customization.response_metadata_color || DEFAULT_SETTINGS.response_metadata_color,
              }}
            >
              <span>{customization.chatbot_name}</span>
              <span>•</span>
              <span>AI Agent</span>
              <span>•</span>
              <span>Just now</span>
            </div>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 text-sm ${
              message.isError
                ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                : message.role === "user"
                ? ""
                : "border border-gray-200 dark:border-gray-600"
            }`}
            style={
              message.role === "user"
                ? {
                    backgroundColor: customization.user_card_color || DEFAULT_SETTINGS.user_card_color,
                    color: customization.user_text_color || DEFAULT_SETTINGS.user_text_color,
                  }
                : message.isError
                ? {}
                : {
                    backgroundColor:
                      customization.response_card_color || DEFAULT_SETTINGS.response_card_color,
                    color: customization.response_text_color || DEFAULT_SETTINGS.response_text_color,
                  }
            }
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
            {message.role === "assistant" && (
              <div
                className="text-xs mt-2 flex items-center gap-1"
                style={{
                  color: customization.response_metadata_color || DEFAULT_SETTINGS.response_metadata_color,
                }}
              >
                <span>{customization.chatbot_name}</span>
                <span>•</span>
                <span>AI Agent</span>
                {message.timestamp && (
                  <>
                    <span>•</span>
                    <span>{getFormattedTimestamp(message.timestamp)}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  );
}
