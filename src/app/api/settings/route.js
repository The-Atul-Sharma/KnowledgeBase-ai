import { supabaseAdmin, supabase } from "@/lib/supabase";
import { DEFAULT_SETTINGS } from "@/constants";

const client = supabaseAdmin || supabase;

const SETTINGS_FIELDS = Object.keys(DEFAULT_SETTINGS);

function mergeWithDefaults(data, defaults) {
  const merged = {};
  for (const key of SETTINGS_FIELDS) {
    merged[key] = data[key] ?? defaults[key];
  }
  return merged;
}

function maskSensitiveFields(settings) {
  return {
    ...settings,
    openai_api_key: settings.openai_api_key ? "***" : null,
    gemini_api_key: settings.gemini_api_key ? "***" : null,
  };
}

function buildSettingsData(userId, body, defaults, existingData = null) {
  const settingsData = {
    user_id: userId,
    updated_at: new Date().toISOString(),
  };

  for (const key of SETTINGS_FIELDS) {
    if (key === "openai_api_key" || key === "gemini_api_key") {
      if (body[key] !== undefined) {
        if (body[key] === "***" || body[key] === "") {
          if (existingData && existingData[key]) {
            settingsData[key] = existingData[key];
          } else {
            settingsData[key] = null;
          }
        } else {
          settingsData[key] = body[key] || null;
        }
      } else if (existingData && existingData[key]) {
        settingsData[key] = existingData[key];
      }
    } else if (body[key] !== undefined) {
      settingsData[key] = body[key] ?? defaults[key];
    }
  }

  return settingsData;
}

function formatSettingsResponse(data, defaults) {
  const merged = mergeWithDefaults(data, defaults);
  return maskSensitiveFields(merged);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await client
      .from("app_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const defaultSettings = { ...DEFAULT_SETTINGS };

    if (!data) {
      return Response.json({
        success: true,
        settings: maskSensitiveFields(defaultSettings),
      });
    }

    return Response.json({
      success: true,
      settings: formatSettingsResponse(data, defaultSettings),
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, ...settingsFields } = body;

    if (!userId) {
      return Response.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: existingData } = await client
      .from("app_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    const settingsData = buildSettingsData(
      userId,
      settingsFields,
      DEFAULT_SETTINGS,
      existingData
    );

    const { data, error } = await client
      .from("app_settings")
      .upsert(settingsData, {
        onConflict: "user_id",
      })
      .select()
      .single();

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      settings: formatSettingsResponse(data, DEFAULT_SETTINGS),
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
