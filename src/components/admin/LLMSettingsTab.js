"use client";

export default function LLMSettingsTab({
  settings,
  setSettings,
  ollamaModels,
  loadingModels,
  loadingSettings,
  loading,
  loadOllamaModels,
  handleSaveSettings,
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">LLM Settings</h2>
      {loadingSettings ? (
        <div className="text-center py-8 text-gray-500">Loading settings...</div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              LLM Provider
            </label>
            <select
              value={settings.llm_provider}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  llm_provider: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            >
              <option value="openai">OpenAI</option>
              <option value="ollama">Ollama</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Embedding Provider
            </label>
            <select
              value={settings.embedding_provider}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  embedding_provider: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            >
              <option value="openai">OpenAI</option>
              <option value="ollama">Ollama</option>
            </select>
          </div>

          {settings.llm_provider === "openai" ||
          settings.embedding_provider === "openai" ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={settings.openai_api_key}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    openai_api_key: e.target.value,
                  })
                }
                placeholder="sk-..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
          ) : null}

          {settings.llm_provider === "ollama" ||
          settings.embedding_provider === "ollama" ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ollama API URL
                </label>
                <input
                  type="text"
                  value={settings.ollama_api_url}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ollama_api_url: e.target.value,
                    })
                  }
                  placeholder="http://127.0.0.1:11434"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>

              {settings.llm_provider === "ollama" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ollama LLM Model
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={settings.ollama_model}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ollama_model: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    >
                      {ollamaModels.length > 0 ? (
                        ollamaModels
                          .filter((model) => !model.name.includes("embed"))
                          .map((model) => (
                            <option key={model.name} value={model.name}>
                              {model.name}
                            </option>
                          ))
                      ) : (
                        <option value={settings.ollama_model}>
                          {settings.ollama_model}
                        </option>
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={loadOllamaModels}
                      disabled={loadingModels}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                    >
                      {loadingModels ? "Loading..." : "Refresh"}
                    </button>
                  </div>
                </div>
              )}

              {settings.embedding_provider === "ollama" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ollama Embedding Model
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={settings.ollama_embedding_model}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ollama_embedding_model: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    >
                      {(() => {
                        const embeddingModels = ollamaModels.filter((model) =>
                          model.name.includes("embed")
                        );
                        if (embeddingModels.length > 0) {
                          return embeddingModels.map((model) => (
                            <option key={model.name} value={model.name}>
                              {model.name}
                            </option>
                          ));
                        } else if (settings.ollama_embedding_model) {
                          return (
                            <option value={settings.ollama_embedding_model}>
                              {settings.ollama_embedding_model}
                            </option>
                          );
                        } else {
                          return (
                            <option value="nomic-embed-text">
                              nomic-embed-text
                            </option>
                          );
                        }
                      })()}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        loadOllamaModels(settings.ollama_api_url)
                      }
                      disabled={loadingModels}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                    >
                      {loadingModels ? "Loading..." : "Refresh"}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      )}
    </section>
  );
}

