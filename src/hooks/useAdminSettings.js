"use client";

import { useState, useCallback } from "react";
import { DEFAULT_SETTINGS } from "@/constants";
import { validateAllColors } from "@/utils/colorValidation";

export function useAdminSettings(user) {
  const [settings, setSettings] = useState({
    ...DEFAULT_SETTINGS,
    openai_api_key: "",
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [colorErrors, setColorErrors] = useState({});

  const loadSettings = useCallback(async () => {
    if (!user) return;
    setLoadingSettings(true);
    try {
      const response = await fetch(`/api/settings?userId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoadingSettings(false);
    }
  }, [user]);

  const saveSettings = async (setLoading, setMessage, settingsToSave = null) => {
    if (!user) return;

    const settingsToValidate = settingsToSave || settings;
    const errors = validateAllColors(settingsToValidate);
    if (Object.keys(errors).length > 0) {
      setColorErrors(errors);
      setMessage({
        type: "error",
        text: "Please fix invalid hex color codes before saving.",
      });
      return false;
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
          ...settingsToValidate,
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
        return true;
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to save settings",
        });
        return false;
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    setSettings,
    loadingSettings,
    colorErrors,
    setColorErrors,
    loadSettings,
    saveSettings,
  };
}
