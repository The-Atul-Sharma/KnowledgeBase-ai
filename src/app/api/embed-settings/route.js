import { supabaseAdmin, supabase } from "@/lib/supabase";
import { DEFAULT_SETTINGS } from "@/constants";

const client = supabaseAdmin || supabase;

const EMBED_SETTINGS_FIELDS = [
  "chatbot_name",
  "header_title",
  "icon_url",
  "greeting_message",
  "no_response_text",
  "input_placeholder",
  "header_color",
  "header_text_color",
  "response_card_color",
  "response_text_color",
  "response_metadata_color",
  "user_card_color",
  "user_text_color",
  "close_icon_color",
  "close_icon_bg_color",
  "chatbot_icon_bg_color",
  "send_icon_color",
];

function trimValue(value) {
  return value && String(value).trim() ? String(value).trim() : null;
}

function formatEmbedSettings(data, defaults) {
  const settings = {
    llm_provider: trimValue(data.llm_provider) || defaults.llm_provider,
    embedding_provider:
      trimValue(data.embedding_provider) || defaults.embedding_provider,
    ollama_api_url: trimValue(data.ollama_api_url) || defaults.ollama_api_url,
    openai_api_key: data.openai_api_key ? "***" : null,
  };

  for (const key of EMBED_SETTINGS_FIELDS) {
    settings[key] = data[key] ?? defaults[key];
  }

  return settings;
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
        settings: {
          ...defaultSettings,
          openai_api_key: null,
        },
      });
    }

    return Response.json({
      success: true,
      settings: formatEmbedSettings(data, defaultSettings),
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
