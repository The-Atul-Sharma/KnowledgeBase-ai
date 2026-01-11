"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEFAULT_SETTINGS } from "@/constants";
import { validateAllColors } from "@/utils/colorValidation";
import AddContentTab from "@/components/admin/AddContentTab";
import DeleteContentTab from "@/components/admin/DeleteContentTab";
import LLMSettingsTab from "@/components/admin/LLMSettingsTab";
import CustomizationTab from "@/components/admin/CustomizationTab";
import EmbedTab from "@/components/admin/EmbedTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("add");
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSources, setTotalSources] = useState(0);
  const itemsPerPage = 5;
  const [settings, setSettings] = useState({
    ...DEFAULT_SETTINGS,
    openai_api_key: "",
  });
  const [ollamaModels, setOllamaModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [colorErrors, setColorErrors] = useState({});
  const router = useRouter();
  const searchDebounceRef = useRef(null);
  const isInitialLoadRef = useRef(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setUser(user);
    setCheckingAuth(false);
  };

  useEffect(() => {
    if (activeTab === "delete") {
      isInitialLoadRef.current = true;
      loadSources("", 1);
      setSearchQuery("");
      setCurrentPage(1);
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 0);
    } else if (
      (activeTab === "settings" || activeTab === "customization") &&
      user
    ) {
      loadSettings();
      if (activeTab === "settings") {
        loadOllamaModels();
      }
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === "delete" && !isInitialLoadRef.current) {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      searchDebounceRef.current = setTimeout(() => {
        loadSources(searchQuery, 1);
        searchDebounceRef.current = null;
      }, 500);
      return () => {
        if (searchDebounceRef.current) {
          clearTimeout(searchDebounceRef.current);
          searchDebounceRef.current = null;
        }
      };
    }
  }, [searchQuery, activeTab]);

  useEffect(() => {
    if (
      activeTab === "delete" &&
      !searchDebounceRef.current &&
      !isInitialLoadRef.current
    ) {
      loadSources(searchQuery, currentPage);
    }
  }, [currentPage, activeTab]);

  const loadSettings = async () => {
    if (!user) return;
    setLoadingSettings(true);
    try {
      const response = await fetch(`/api/settings?userId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoadingSettings(false);
    }
  };

  const loadOllamaModels = async (url = null) => {
    setLoadingModels(true);
    try {
      const ollamaUrl =
        url || settings.ollama_api_url || "http://127.0.0.1:11434";
      const response = await fetch(
        `/api/ollama-models?url=${encodeURIComponent(ollamaUrl)}`
      );
      const data = await response.json();
      if (data.success) {
        setOllamaModels(data.models || []);
      }
    } catch (error) {
      console.error("Failed to load Ollama models:", error);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!user) return;

    const errors = validateAllColors(settings);
    if (Object.keys(errors).length > 0) {
      setColorErrors(errors);
      setMessage({
        type: "error",
        text: "Please fix invalid hex color codes before saving.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...settings,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: "Settings saved successfully! Reloading page...",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to save settings",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const loadSources = async (search = "", page = 1) => {
    setLoadingSources(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }
      params.append("page", page.toString());
      params.append("itemsPerPage", itemsPerPage.toString());
      if (user?.id) {
        params.append("userId", user.id);
      }

      const response = await fetch(`/api/admin/list?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSources(data.sources || []);
        setTotalPages(data.totalPages || 1);
        setTotalSources(data.totalSources || 0);
        setCurrentPage(data.currentPage || 1);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to load sources",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoadingSources(false);
    }
  };

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setMessage({ type: "error", text: "Text content is required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          metadata: {
            source: source.trim() || "manual-upload",
            screen: source.trim() || "Manual Upload",
          },
          replace: false,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Successfully ingested ${data.chunksCount} chunks!`,
        });
        setText("");
        setSource("");
        if (activeTab === "delete") {
          loadSources(searchQuery, currentPage);
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to ingest" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sourceToDelete) => {
    if (!sourceToDelete) {
      setMessage({ type: "error", text: "Source is required for deletion" });
      return;
    }

    if (!confirm(`Delete all chunks with source "${sourceToDelete}"?`)) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/ingest?source=${encodeURIComponent(sourceToDelete)}&userId=${
          user?.id || ""
        }`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Deleted ${data.deletedCount} chunks!`,
        });
        loadSources(searchQuery, currentPage);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Content Management</h1>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </span>
              )}
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
              <Link
                href="/"
                className="text-blue-500 hover:text-blue-600 underline text-sm"
              >
                ← Back to Chat
              </Link>
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("add")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "add"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Add Content
              </button>
              <button
                onClick={() => setActiveTab("delete")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "delete"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Delete Content
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                LLM Settings
              </button>
              <button
                onClick={() => setActiveTab("customization")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "customization"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Customization
              </button>
              <button
                onClick={() => setActiveTab("embed")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "embed"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Embed
              </button>
            </nav>
          </div>

          {activeTab === "add" && (
            <AddContentTab
              text={text}
              setText={setText}
              source={source}
              setSource={setSource}
              loading={loading}
              handleIngest={handleIngest}
            />
          )}

          {activeTab === "delete" && (
            <DeleteContentTab
              sources={sources}
              loadingSources={loadingSources}
              totalSources={totalSources}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              loading={loading}
              handleDelete={handleDelete}
            />
          )}

          {activeTab === "settings" && (
            <LLMSettingsTab
              settings={settings}
              setSettings={setSettings}
              ollamaModels={ollamaModels}
              loadingModels={loadingModels}
              loadingSettings={loadingSettings}
              loading={loading}
              loadOllamaModels={loadOllamaModels}
              handleSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === "customization" && (
            <CustomizationTab
              settings={settings}
              setSettings={setSettings}
              loadingSettings={loadingSettings}
              loading={loading}
              colorErrors={colorErrors}
              setColorErrors={setColorErrors}
              handleSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === "embed" && (
            <EmbedTab user={user} setMessage={setMessage} />
          )}
        </div>
      </div>
    </div>
  );
}
