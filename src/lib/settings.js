import { supabaseAdmin, supabase } from "./supabase";
import { DEFAULT_SETTINGS } from "@/constants";

const client = supabaseAdmin || supabase;

export async function getSettings(userId) {
  if (!userId) {
    return getDefaultSettings();
  }

  try {
    const { data, error } = await client
      .from("app_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching settings:", error);
      return getDefaultSettings();
    }

    if (!data) {
      return getDefaultSettings();
    }

    const defaults = getDefaultSettings();
    return {
      llm_provider: data.llm_provider || defaults.llm_provider,
      embedding_provider:
        data.embedding_provider || defaults.embedding_provider,
      ollama_api_url: data.ollama_api_url || defaults.ollama_api_url,
      ollama_model: data.ollama_model || defaults.ollama_model,
      ollama_embedding_model:
        data.ollama_embedding_model || defaults.ollama_embedding_model,
      openai_api_key: data.openai_api_key || defaults.openai_api_key,
      gemini_api_key: data.gemini_api_key || defaults.gemini_api_key,
      gemini_model: data.gemini_model || defaults.gemini_model,
      gemini_embedding_model:
        data.gemini_embedding_model || defaults.gemini_embedding_model,
      chatbot_name: data.chatbot_name || defaults.chatbot_name,
      header_title: data.header_title || defaults.header_title,
      icon_url: data.icon_url || defaults.icon_url,
      greeting_message: data.greeting_message || defaults.greeting_message,
      custom_prompt: data.custom_prompt || defaults.custom_prompt,
      no_response_text: data.no_response_text || defaults.no_response_text,
      input_placeholder: data.input_placeholder || defaults.input_placeholder,
      header_color: data.header_color || defaults.header_color,
      header_text_color: data.header_text_color || defaults.header_text_color,
      response_card_color:
        data.response_card_color || defaults.response_card_color,
      response_text_color:
        data.response_text_color || defaults.response_text_color,
      response_metadata_color:
        data.response_metadata_color || defaults.response_metadata_color,
      user_card_color: data.user_card_color || defaults.user_card_color,
      user_text_color: data.user_text_color || defaults.user_text_color,
      close_icon_color: data.close_icon_color || defaults.close_icon_color,
      close_icon_bg_color:
        data.close_icon_bg_color || defaults.close_icon_bg_color,
      chatbot_icon_bg_color:
        data.chatbot_icon_bg_color || defaults.chatbot_icon_bg_color,
      send_icon_color: data.send_icon_color || defaults.send_icon_color,
    };
  } catch (error) {
    console.error("Error in getSettings:", error);
    return getDefaultSettings();
  }
}

function getDefaultSettings() {
  return { ...DEFAULT_SETTINGS };
}

export async function checkSetup(userId) {
  const settings = await getSettings(userId);

  if (settings.llm_provider === "openai" && !settings.openai_api_key) {
    return false;
  }

  if (settings.llm_provider === "ollama" && !settings.ollama_api_url) {
    return false;
  }

  if (settings.llm_provider === "gemini" && !settings.gemini_api_key) {
    return false;
  }

  return true;
}
