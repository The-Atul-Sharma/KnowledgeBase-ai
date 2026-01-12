"use client";

import { DEFAULT_SETTINGS } from "@/constants";
import ColorInput from "./ColorInput";

export default function CustomizationTab({
  settings,
  setSettings,
  loadingSettings,
  loading,
  colorErrors,
  setColorErrors,
  handleSaveSettings,
}) {
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
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

            <div className="grid grid-cols-2 gap-4">
              <ColorInput
                label="Chatbot icon background"
                value={settings.chatbot_icon_bg_color || "#3b82f6"}
                onChange={(value) =>
                  setSettings({ ...settings, chatbot_icon_bg_color: value })
                }
                error={colorErrors.chatbot_icon_bg_color}
                placeholder="#3b82f6"
                onColorChange={(error) =>
                  setColorErrors({
                    ...colorErrors,
                    chatbot_icon_bg_color: error,
                  })
                }
              />

              <ColorInput
                label="Header background"
                value={settings.header_color || "#3b82f6"}
                onChange={(value) =>
                  setSettings({ ...settings, header_color: value })
                }
                error={colorErrors.header_color}
                placeholder="#3b82f6"
                onColorChange={(error) =>
                  setColorErrors({ ...colorErrors, header_color: error })
                }
              />

              <ColorInput
                label="Header text"
                value={settings.header_text_color || "#ffffff"}
                onChange={(value) =>
                  setSettings({ ...settings, header_text_color: value })
                }
                error={colorErrors.header_text_color}
                placeholder="#ffffff"
                onColorChange={(error) =>
                  setColorErrors({ ...colorErrors, header_text_color: error })
                }
              />

              <ColorInput
                label="Close icon"
                value={settings.close_icon_color || "#ffffff"}
                onChange={(value) =>
                  setSettings({ ...settings, close_icon_color: value })
                }
                error={colorErrors.close_icon_color}
                placeholder="#ffffff"
                onColorChange={(error) =>
                  setColorErrors({ ...colorErrors, close_icon_color: error })
                }
              />

              <ColorInput
                label="Close icon background"
                value={settings.close_icon_bg_color || "#cccccc"}
                onChange={(value) =>
                  setSettings({ ...settings, close_icon_bg_color: value })
                }
                error={colorErrors.close_icon_bg_color}
                placeholder="#cccccc"
                onColorChange={(error) =>
                  setColorErrors({
                    ...colorErrors,
                    close_icon_bg_color: error,
                  })
                }
              />

              <ColorInput
                label="Agent chat card background"
                value={settings.response_card_color || "#ffffff"}
                onChange={(value) =>
                  setSettings({ ...settings, response_card_color: value })
                }
                error={colorErrors.response_card_color}
                placeholder="#ffffff"
                onColorChange={(error) =>
                  setColorErrors({ ...colorErrors, response_card_color: error })
                }
              />

              <ColorInput
                label="Agent chat card text"
                value={settings.response_text_color || "#111827"}
                onChange={(value) =>
                  setSettings({ ...settings, response_text_color: value })
                }
                error={colorErrors.response_text_color}
                placeholder="#111827"
                onColorChange={(error) =>
                  setColorErrors({ ...colorErrors, response_text_color: error })
                }
              />

              <ColorInput
                label="Response Metadata Color"
                value={settings.response_metadata_color || "#6b7280"}
                onChange={(value) =>
                  setSettings({ ...settings, response_metadata_color: value })
                }
                error={colorErrors.response_metadata_color}
                placeholder="#6b7280"
                onColorChange={(error) =>
                  setColorErrors({
                    ...colorErrors,
                    response_metadata_color: error,
                  })
                }
              />

              <ColorInput
                label="User query card background"
                value={settings.user_card_color || "#3b82f6"}
                onChange={(value) =>
                  setSettings({ ...settings, user_card_color: value })
                }
                error={colorErrors.user_card_color}
                placeholder="#3b82f6"
                onColorChange={(error) =>
                  setColorErrors({ ...colorErrors, user_card_color: error })
                }
              />

              <ColorInput
                label="User query card text"
                value={settings.user_text_color || "#ffffff"}
                onChange={(value) =>
                  setSettings({ ...settings, user_text_color: value })
                }
                error={colorErrors.user_text_color}
                placeholder="#ffffff"
                onColorChange={(error) =>
                  setColorErrors({ ...colorErrors, user_text_color: error })
                }
              />

              <ColorInput
                label="Send icon"
                value={settings.send_icon_color || "#3b82f6"}
                onChange={(value) =>
                  setSettings({ ...settings, send_icon_color: value })
                }
                error={colorErrors.send_icon_color}
                placeholder="#3b82f6"
                onColorChange={(error) =>
                  setColorErrors({ ...colorErrors, send_icon_color: error })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Saving..." : "Save Customization"}
          </button>
        </form>
      )}
    </section>
  );
}
