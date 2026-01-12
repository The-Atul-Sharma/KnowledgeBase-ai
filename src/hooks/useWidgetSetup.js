import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DEFAULT_SETTINGS } from "@/constants";

export function useWidgetSetup() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [userId, setUserId] = useState(null);
  const [customization, setCustomization] = useState({
    chatbot_name: DEFAULT_SETTINGS.chatbot_name,
    header_title: DEFAULT_SETTINGS.header_title,
    icon_url: DEFAULT_SETTINGS.icon_url,
    greeting_message: DEFAULT_SETTINGS.greeting_message,
    no_response_text: DEFAULT_SETTINGS.no_response_text,
    input_placeholder: DEFAULT_SETTINGS.input_placeholder,
    header_color: DEFAULT_SETTINGS.header_color,
    header_text_color: DEFAULT_SETTINGS.header_text_color,
    response_card_color: DEFAULT_SETTINGS.response_card_color,
    response_text_color: DEFAULT_SETTINGS.response_text_color,
    response_metadata_color: DEFAULT_SETTINGS.response_metadata_color,
    user_card_color: DEFAULT_SETTINGS.user_card_color,
    user_text_color: DEFAULT_SETTINGS.user_text_color,
    close_icon_color: DEFAULT_SETTINGS.close_icon_color,
    close_icon_bg_color: DEFAULT_SETTINGS.close_icon_bg_color,
    chatbot_icon_bg_color: DEFAULT_SETTINGS.chatbot_icon_bg_color,
    send_icon_color: DEFAULT_SETTINGS.send_icon_color,
  });

  const checkSetup = async () => {
    setCheckingSetup(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsSetupComplete(false);
        setCheckingSetup(false);
        return;
      }

      setUserId(user.id);

      const response = await fetch(`/api/settings?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        const settings = data.settings;
        const setupComplete =
          (settings.llm_provider === "openai" && settings.openai_api_key) ||
          (settings.llm_provider === "ollama" && settings.ollama_api_url) ||
          (settings.llm_provider === "gemini" && settings.gemini_api_key);
        setIsSetupComplete(setupComplete);

        setCustomization({
          chatbot_name: settings.chatbot_name || DEFAULT_SETTINGS.chatbot_name,
          header_title: settings.header_title || DEFAULT_SETTINGS.header_title,
          icon_url: settings.icon_url || DEFAULT_SETTINGS.icon_url,
          greeting_message:
            settings.greeting_message || DEFAULT_SETTINGS.greeting_message,
          no_response_text:
            settings.no_response_text || DEFAULT_SETTINGS.no_response_text,
          input_placeholder:
            settings.input_placeholder || DEFAULT_SETTINGS.input_placeholder,
          header_color: settings.header_color || DEFAULT_SETTINGS.header_color,
          header_text_color:
            settings.header_text_color || DEFAULT_SETTINGS.header_text_color,
          response_card_color:
            settings.response_card_color ||
            DEFAULT_SETTINGS.response_card_color,
          response_text_color:
            settings.response_text_color ||
            DEFAULT_SETTINGS.response_text_color,
          response_metadata_color:
            settings.response_metadata_color ||
            DEFAULT_SETTINGS.response_metadata_color,
          user_card_color:
            settings.user_card_color || DEFAULT_SETTINGS.user_card_color,
          user_text_color:
            settings.user_text_color || DEFAULT_SETTINGS.user_text_color,
          close_icon_color:
            settings.close_icon_color || DEFAULT_SETTINGS.close_icon_color,
          close_icon_bg_color:
            settings.close_icon_bg_color ||
            DEFAULT_SETTINGS.close_icon_bg_color,
          chatbot_icon_bg_color:
            settings.chatbot_icon_bg_color ||
            DEFAULT_SETTINGS.chatbot_icon_bg_color,
          send_icon_color:
            settings.send_icon_color || DEFAULT_SETTINGS.send_icon_color,
        });
      }
    } catch (error) {
      console.error("Error checking setup:", error);
      setIsSetupComplete(false);
    } finally {
      setCheckingSetup(false);
    }
  };

  useEffect(() => {
    checkSetup();
  }, []);

  return {
    isSetupComplete,
    checkingSetup,
    userId,
    customization,
  };
}
