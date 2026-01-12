"use client";

const INPUT_CLASSES =
  "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800";

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={INPUT_CLASSES}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, children, className = "" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className={`${INPUT_CLASSES} ${className}`}
      >
        {children}
      </select>
    </div>
  );
}

function SelectWithRefresh({
  label,
  value,
  onChange,
  onRefresh,
  loading,
  children,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={onChange}
          className={`${INPUT_CLASSES} flex-1`}
        >
          {children}
        </select>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}

function ProviderSelect({ label, value, onChange }) {
  return (
    <SelectField label={label} value={value} onChange={onChange}>
      <option value="openai">OpenAI</option>
      <option value="ollama">Ollama</option>
      <option value="gemini">Gemini</option>
    </SelectField>
  );
}

function OpenAIFields({ settings, setSettings }) {
  const needsOpenAI =
    settings.llm_provider === "openai" ||
    settings.embedding_provider === "openai";

  if (!needsOpenAI) return null;

  return (
    <InputField
      label="OpenAI API Key"
      type="password"
      value={settings.openai_api_key}
      onChange={(e) =>
        setSettings({ ...settings, openai_api_key: e.target.value })
      }
      placeholder="sk-..."
    />
  );
}

function GeminiLLMFields({ settings, setSettings }) {
  if (settings.llm_provider !== "gemini") return null;

  return (
    <>
      <InputField
        label="Gemini API Key"
        type="password"
        value={settings.gemini_api_key}
        onChange={(e) =>
          setSettings({ ...settings, gemini_api_key: e.target.value })
        }
        placeholder="AIza..."
      />
      <SelectField
        label="Gemini LLM Model"
        value={settings.gemini_model}
        onChange={(e) =>
          setSettings({ ...settings, gemini_model: e.target.value })
        }
      >
        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
      </SelectField>
    </>
  );
}

function GeminiEmbeddingFields({ settings, setSettings }) {
  if (settings.embedding_provider !== "gemini") return null;

  return (
    <>
      <SelectField
        label="Gemini Embedding Model"
        value={settings.gemini_embedding_model}
        onChange={(e) =>
          setSettings({
            ...settings,
            gemini_embedding_model: e.target.value,
          })
        }
      >
        <option value="text-embedding-004">text-embedding-004</option>
        <option value="embedding-001">embedding-001</option>
      </SelectField>
      {settings.llm_provider !== "gemini" && (
        <InputField
          label="Gemini API Key"
          type="password"
          value={settings.gemini_api_key}
          onChange={(e) =>
            setSettings({ ...settings, gemini_api_key: e.target.value })
          }
          placeholder="AIza..."
        />
      )}
    </>
  );
}

function OllamaFields({
  settings,
  setSettings,
  ollamaModels,
  loadingModels,
  loadOllamaModels,
}) {
  const needsOllama =
    settings.llm_provider === "ollama" ||
    settings.embedding_provider === "ollama";

  if (!needsOllama) return null;

  const llmModels = ollamaModels.filter(
    (model) => !model.name.includes("embed")
  );
  const embeddingModels = ollamaModels.filter((model) =>
    model.name.includes("embed")
  );

  return (
    <>
      <InputField
        label="Ollama API URL"
        value={settings.ollama_api_url}
        onChange={(e) =>
          setSettings({ ...settings, ollama_api_url: e.target.value })
        }
        placeholder="http://127.0.0.1:11434"
      />

      {settings.llm_provider === "ollama" && (
        <SelectWithRefresh
          label="Ollama LLM Model"
          value={settings.ollama_model}
          onChange={(e) =>
            setSettings({ ...settings, ollama_model: e.target.value })
          }
          onRefresh={loadOllamaModels}
          loading={loadingModels}
        >
          {llmModels.length > 0 ? (
            llmModels.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))
          ) : (
            <option value={settings.ollama_model}>
              {settings.ollama_model}
            </option>
          )}
        </SelectWithRefresh>
      )}

      {settings.embedding_provider === "ollama" && (
        <SelectWithRefresh
          label="Ollama Embedding Model"
          value={settings.ollama_embedding_model}
          onChange={(e) =>
            setSettings({
              ...settings,
              ollama_embedding_model: e.target.value,
            })
          }
          onRefresh={() => loadOllamaModels(settings.ollama_api_url)}
          loading={loadingModels}
        >
          {embeddingModels.length > 0 ? (
            embeddingModels.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))
          ) : settings.ollama_embedding_model ? (
            <option value={settings.ollama_embedding_model}>
              {settings.ollama_embedding_model}
            </option>
          ) : (
            <option value="nomic-embed-text">nomic-embed-text</option>
          )}
        </SelectWithRefresh>
      )}
    </>
  );
}

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
  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">LLM Settings</h2>
      {loadingSettings ? (
        <div className="text-center py-8 text-gray-500">
          Loading settings...
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <ProviderSelect
            label="LLM Provider"
            value={settings.llm_provider}
            onChange={(e) => updateSetting("llm_provider", e.target.value)}
          />

          <ProviderSelect
            label="Embedding Provider"
            value={settings.embedding_provider}
            onChange={(e) =>
              updateSetting("embedding_provider", e.target.value)
            }
          />

          <OpenAIFields settings={settings} setSettings={setSettings} />
          <GeminiLLMFields settings={settings} setSettings={setSettings} />
          <GeminiEmbeddingFields
            settings={settings}
            setSettings={setSettings}
          />
          <OllamaFields
            settings={settings}
            setSettings={setSettings}
            ollamaModels={ollamaModels}
            loadingModels={loadingModels}
            loadOllamaModels={loadOllamaModels}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      )}
    </section>
  );
}
