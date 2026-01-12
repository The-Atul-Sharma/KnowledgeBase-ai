export const validateHexColor = (color) => {
  if (!color) return false;
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
};

export const validateAllColors = (settings) => {
  const errors = {};
  const colorFields = [
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

  colorFields.forEach((field) => {
    if (!validateHexColor(settings[field])) {
      errors[field] = "Invalid hex code. Format: #RRGGBB or #RGB";
    }
  });

  return errors;
};
