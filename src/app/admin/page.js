"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useAdminSources } from "@/hooks/useAdminSources";
import { useAdminContent } from "@/hooks/useAdminContent";
import { useOllamaModels } from "@/hooks/useOllamaModels";
import AddContentTab from "@/components/admin/AddContentTab";
import AddDocumentTab from "@/components/admin/AddDocumentTab";
import DeleteContentTab from "@/components/admin/DeleteContentTab";
import LLMSettingsTab from "@/components/admin/LLMSettingsTab";
import CustomizationTab from "@/components/admin/CustomizationTab";
import EmbedTab from "@/components/admin/EmbedTab";
import ScraperTab from "@/components/admin/ScraperTab";

const TABS = [
  { id: "add", label: "Add Content" },
  { id: "document", label: "Add Document" },
  { id: "scraper", label: "Scraper" },
  { id: "delete", label: "Delete Content" },
  { id: "settings", label: "LLM Settings" },
  { id: "customization", label: "Customization" },
  { id: "embed", label: "Embed" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("add");
  const [savingSettings, setSavingSettings] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const lastLoadedTabRef = useRef(null);

  const {
    settings,
    setSettings,
    loadingSettings,
    colorErrors,
    setColorErrors,
    loadSettings,
    saveSettings,
  } = useAdminSettings(user);

  const {
    sources,
    loadingSources,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    totalSources,
    itemsPerPage,
    loadSources,
  } = useAdminSources(user, activeTab);

  const {
    text,
    setText,
    source,
    setSource,
    documentSource,
    setDocumentSource,
    loading,
    message,
    setMessage,
    handleIngest,
    handleDocumentUpload,
    handleDelete: handleDeleteContent,
  } = useAdminContent(user, loadSources, searchQuery, currentPage);

  const { ollamaModels, loadingModels, loadOllamaModels } =
    useOllamaModels(settings);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (
      (activeTab === "settings" || activeTab === "customization") &&
      user &&
      lastLoadedTabRef.current !== activeTab
    ) {
      lastLoadedTabRef.current = activeTab;
      loadSettings();
      if (activeTab === "settings") {
        loadOllamaModels();
      }
    }
  }, [activeTab, user?.id, loadSettings, loadOllamaModels]);

  useEffect(() => {
    setSource("");
    setDocumentSource("");
  }, [activeTab, setSource, setDocumentSource]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await saveSettings(setSavingSettings, setMessage);
  };

  const handleDelete = async (sourceToDelete) => {
    await handleDeleteContent(sourceToDelete);
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-5xl mx-auto px-4">
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
                ← Back to Home
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
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 border-b-2 font-medium text-sm cursor-pointer ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
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

          {activeTab === "document" && (
            <AddDocumentTab
              source={documentSource}
              setSource={setDocumentSource}
              loading={loading}
              handleDocumentUpload={handleDocumentUpload}
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
              loading={savingSettings}
              loadOllamaModels={loadOllamaModels}
              handleSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === "customization" && (
            <CustomizationTab
              settings={settings}
              setSettings={setSettings}
              loadingSettings={loadingSettings}
              loading={savingSettings}
              colorErrors={colorErrors}
              setColorErrors={setColorErrors}
              handleSaveSettings={handleSaveSettings}
            />
          )}

          {activeTab === "embed" && (
            <EmbedTab user={user} setMessage={setMessage} />
          )}

          {activeTab === "scraper" && <ScraperTab user={user} />}
        </div>
      </div>
    </div>
  );
}
