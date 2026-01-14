"use client";

import { useState } from "react";
import Image from "next/image";
import { DEFAULT_SETTINGS } from "@/constants";
import ColorInput from "./ColorInput";
import WidgetPreview from "./WidgetPreview";
import Modal from "../Modal";

function IconPreview({ iconUrl, backgroundColor }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-16 h-16 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      {iconUrl && !imageError ? (
        <div
          className="w-12 h-12 rounded flex items-center justify-center overflow-hidden relative"
          style={{ backgroundColor }}
        >
          <Image
            key={iconUrl}
            src={iconUrl}
            alt="Icon preview"
            width={48}
            height={48}
            className="object-contain rounded"
            unoptimized
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        </div>
      ) : (
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
      )}
    </div>
  );
}

const COLOR_INPUTS = [
  {
    key: "chatbot_icon_bg_color",
    label: "Chatbot icon background",
    defaultValue: DEFAULT_SETTINGS.chatbot_icon_bg_color,
  },
  {
    key: "header_color",
    label: "Header background",
    defaultValue: DEFAULT_SETTINGS.header_color,
  },
  {
    key: "header_text_color",
    label: "Header text",
    defaultValue: DEFAULT_SETTINGS.header_text_color,
  },
  {
    key: "close_icon_color",
    label: "Close icon",
    defaultValue: DEFAULT_SETTINGS.close_icon_color,
  },
  {
    key: "close_icon_bg_color",
    label: "Close icon background",
    defaultValue: DEFAULT_SETTINGS.close_icon_bg_color,
  },
  {
    key: "response_card_color",
    label: "Agent chat card background",
    defaultValue: DEFAULT_SETTINGS.response_card_color,
  },
  {
    key: "response_text_color",
    label: "Agent chat card text",
    defaultValue: DEFAULT_SETTINGS.response_text_color,
  },
  {
    key: "response_metadata_color",
    label: "Response Metadata Color",
    defaultValue: DEFAULT_SETTINGS.response_metadata_color,
  },
  {
    key: "user_card_color",
    label: "User query card background",
    defaultValue: DEFAULT_SETTINGS.user_card_color,
  },
  {
    key: "user_text_color",
    label: "User query card text",
    defaultValue: DEFAULT_SETTINGS.user_text_color,
  },
  {
    key: "send_icon_color",
    label: "Send icon",
    defaultValue: DEFAULT_SETTINGS.send_icon_color,
  },
];

function ResetModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset to Default Settings"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            Reset to Defaults
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This will reset all customization settings to their default values.
          This includes:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>Chatbot name and product name</li>
          <li>Icon URL</li>
          <li>Greeting message and input placeholder</li>
          <li>All color customizations</li>
          <li>Custom system prompt</li>
        </ul>
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
              Are you sure you want to reset all customization settings to
              defaults? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function CustomizationTab({
  settings,
  setSettings,
  loadingSettings,
  loading,
  colorErrors,
  setColorErrors,
  handleSaveSettings,
  saveSettings,
  setMessage,
}) {
  const [showResetModal, setShowResetModal] = useState(false);

  const handleResetToDefaults = () => {
    const resetSettings = {
      ...DEFAULT_SETTINGS,
      llm_provider: settings.llm_provider || DEFAULT_SETTINGS.llm_provider,
      embedding_provider:
        settings.embedding_provider || DEFAULT_SETTINGS.embedding_provider,
      ollama_api_url:
        settings.ollama_api_url || DEFAULT_SETTINGS.ollama_api_url,
      ollama_model: settings.ollama_model || DEFAULT_SETTINGS.ollama_model,
      ollama_embedding_model:
        settings.ollama_embedding_model ||
        DEFAULT_SETTINGS.ollama_embedding_model,
      openai_api_key:
        settings.openai_api_key || DEFAULT_SETTINGS.openai_api_key,
      gemini_api_key:
        settings.gemini_api_key || DEFAULT_SETTINGS.gemini_api_key,
      gemini_model: settings.gemini_model || DEFAULT_SETTINGS.gemini_model,
      gemini_embedding_model:
        settings.gemini_embedding_model ||
        DEFAULT_SETTINGS.gemini_embedding_model,
    };

    setSettings(resetSettings);
    setColorErrors({});
    setShowResetModal(false);

    if (saveSettings && setMessage) {
      saveSettings(() => {}, setMessage, resetSettings);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Chatbot Customization</h2>
      {loadingSettings ? (
        <div className="text-center py-8 text-gray-500">
          Loading settings...
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Chatbot Name
            </label>
            <input
              type="text"
              value={settings.chatbot_name || DEFAULT_SETTINGS.chatbot_name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  chatbot_name: e.target.value,
                })
              }
              placeholder={DEFAULT_SETTINGS.chatbot_name}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={settings.header_title || "Knowledge Base Support"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  header_title: e.target.value,
                })
              }
              placeholder="Product Support"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Icon URL (optional)
            </label>
            <div className="flex items-start gap-4">
              <input
                type="url"
                value={settings.icon_url || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    icon_url: e.target.value,
                  })
                }
                placeholder="https://example.com/icon.png"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
              <div className="flex-shrink-0">
                <IconPreview
                  iconUrl={settings.icon_url}
                  backgroundColor={
                    settings.chatbot_icon_bg_color ||
                    DEFAULT_SETTINGS.chatbot_icon_bg_color
                  }
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  Preview
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave empty to use default icon
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Greeting Message
            </label>
            <textarea
              value={
                settings.greeting_message || DEFAULT_SETTINGS.greeting_message
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  greeting_message: e.target.value,
                })
              }
              placeholder={DEFAULT_SETTINGS.greeting_message}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Custom System Prompt (optional)
            </label>
            <textarea
              value={settings.custom_prompt || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  custom_prompt: e.target.value,
                })
              }
              placeholder="Leave empty to use default prompt. This will override the system prompt for RAG responses."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Custom prompt for the LLM. Leave empty to use default.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              No Response Text
            </label>
            <textarea
              value={
                settings.no_response_text || DEFAULT_SETTINGS.no_response_text
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  no_response_text: e.target.value,
                })
              }
              placeholder={DEFAULT_SETTINGS.no_response_text}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Input Placeholder
            </label>
            <input
              type="text"
              value={settings.input_placeholder || "Ask a question..."}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  input_placeholder: e.target.value,
                })
              }
              placeholder="Ask a question..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Color Customization (Hex code)
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 max-w-md">
                Live Preview
              </label>
              <WidgetPreview settings={settings} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {COLOR_INPUTS.map((input) => (
                <ColorInput
                  key={input.key}
                  label={input.label}
                  value={settings[input.key] || input.defaultValue}
                  onChange={(value) =>
                    setSettings({ ...settings, [input.key]: value })
                  }
                  error={colorErrors[input.key]}
                  placeholder={input.defaultValue}
                  onColorChange={(error) =>
                    setColorErrors({
                      ...colorErrors,
                      [input.key]: error,
                    })
                  }
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? "Saving..." : "Save Customization"}
            </button>
          </div>
        </form>
      )}

      <ResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetToDefaults}
      />
    </section>
  );
}
