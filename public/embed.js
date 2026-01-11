(function () {
  "use strict";

  const EMBED_VERSION = "1.0.0";
  const BASE_URL = window.location.origin;

  const WIDGET_STYLES = `
    .chatbot-widget-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
    .chatbot-widget-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: transform 0.3s ease;
    }
    .chatbot-widget-button:hover {
      transform: scale(1.1);
    }
    .chatbot-widget-window {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 384px;
      height: 600px;
      max-width: calc(100vw - 48px);
      max-height: calc(100vh - 48px);
      background: white;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      z-index: 10000;
      border: 1px solid #e5e7eb;
      box-sizing: border-box;
    }
    .chatbot-widget-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      border-radius: 8px 8px 0 0;
    }
    .chatbot-widget-header-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .chatbot-widget-icon {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chatbot-widget-icon img {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }
    .chatbot-widget-title {
      font-weight: 600;
      color: white;
    }
    .chatbot-widget-close {
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
      transition: opacity 0.2s;
      border-radius: 4px;
    }
    .chatbot-widget-close:hover {
      opacity: 1;
    }
    .chatbot-widget-messages {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chatbot-widget-message {
      display: flex;
      max-width: 80%;
      width: 100%;
    }
    .chatbot-widget-message.user {
      justify-content: flex-end;
      margin-left: auto;
    }
    .chatbot-widget-message.assistant {
      justify-content: flex-start;
    }
    .chatbot-widget-message-content {
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      word-break: break-word;
      box-sizing: border-box;
      overflow-wrap: break-word;
    }
    .chatbot-widget-message.user .chatbot-widget-message-content {
      color: white;
    }
    .chatbot-widget-message.assistant .chatbot-widget-message-content {
      border: 1px solid #e5e7eb;
    }
    .chatbot-widget-message-metadata {
      font-size: 12px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }
    .chatbot-widget-input-container {
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      background: white;
      box-sizing: border-box;
    }
    .chatbot-widget-input-wrapper {
      position: relative;
      width: 100%;
      box-sizing: border-box;
    }
    .chatbot-widget-input {
      width: 100%;
      padding: 10px 45px 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      resize: none;
      min-height: 44px;
      max-height: 120px;
      font-family: inherit;
      box-sizing: border-box;
      line-height: 1.5;
    }
    .chatbot-widget-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    .chatbot-widget-send {
      position: absolute;
      right: 8px;
      bottom: 8px;
      width: 28px;
      height: 40px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
      transition: opacity 0.2s;
      padding: 0;
    }
    .chatbot-widget-send:hover:not(:disabled) {
      opacity: 1;
    }
    .chatbot-widget-send:not(:disabled) {
      opacity: 0.7;
    }
    .chatbot-widget-send:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
    .chatbot-widget-loading {
      display: flex;
      gap: 4px;
      padding: 12px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      max-width: 80px;
    }
    .chatbot-widget-loading-dot {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out;
    }
    .chatbot-widget-loading-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .chatbot-widget-loading-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    .chatbot-widget-error {
      background: #fee2e2;
      color: #991b1b;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
    }
    @media (max-width: 480px) {
      .chatbot-widget-window {
        width: 100%;
        height: 100%;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }
    }
  `;

  const DEFAULT_COLORS = {
    header: "#3b82f6",
    iconBg: "#3b82f6",
    closeIconBg: "#cccccc",
    closeIconColor: "#ffffff",
    sendIcon: "#3b82f6",
    responseCard: "#ffffff",
    responseText: "#111827",
    responseMetadata: "#6b7280",
    userCard: "#3b82f6",
    userText: "#ffffff",
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadStyles() {
    if (document.getElementById("chatbot-embed-styles")) return;

    const style = document.createElement("style");
    style.id = "chatbot-embed-styles";
    style.textContent = WIDGET_STYLES;
    document.head.appendChild(style);
  }

  function formatTimestamp(timestamp) {
    const now = new Date();
    const msgTime = new Date(timestamp);
    const diffSeconds = Math.floor((now - msgTime) / 1000);

    if (diffSeconds < 60) {
      return "Just now";
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return msgTime.toLocaleString();
    }
  }

  function createWidgetState(config) {
    return {
      userId: config.userId,
      baseUrl: config.baseUrl,
      isOpen: false,
      messages: [],
      loading: false,
      settings: null,
      setupComplete: false,
      currentTime: new Date(),
    };
  }

  function checkSetupComplete(settings) {
    return (
      (settings.llm_provider === "openai" && settings.openai_api_key) ||
      (settings.llm_provider === "ollama" && settings.ollama_api_url)
    );
  }

  function renderButton(state, container, onOpen) {
    const iconBg =
      state.settings?.chatbot_icon_bg_color || DEFAULT_COLORS.iconBg;
    container.innerHTML = `
      <button class="chatbot-widget-button" style="background-color: ${iconBg}">
        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    `;
    const button = container.querySelector(".chatbot-widget-button");
    button.addEventListener("click", onOpen);
  }

  function renderHeader(state) {
    const settings = state.settings;
    const headerColor = settings.header_color || DEFAULT_COLORS.header;
    const iconBg = settings.chatbot_icon_bg_color || DEFAULT_COLORS.iconBg;
    const closeIconBg =
      settings.close_icon_bg_color || DEFAULT_COLORS.closeIconBg;
    const closeIconColor =
      settings.close_icon_color || DEFAULT_COLORS.closeIconColor;

    const iconHtml = settings.icon_url
      ? `<div class="chatbot-widget-icon" style="background-color: ${iconBg};">
          <img src="${settings.icon_url}" alt="${settings.chatbot_name}" />
        </div>`
      : '<div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>';

    return `
      <div class="chatbot-widget-header" style="background-color: ${headerColor}; color: white;">
        <div class="chatbot-widget-header-content">
          ${iconHtml}
          <div class="chatbot-widget-title">${
            settings.header_title || "Knowledge Base Support"
          }</div>
        </div>
        <button class="chatbot-widget-close" style="background-color: ${closeIconBg};">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style="stroke: ${closeIconColor};">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `;
  }

  function renderSetupMessage() {
    return `
      <div style="text-align: center; color: #6b7280; padding: 32px 16px;">
        <p style="font-size: 14px; margin-bottom: 16px;">Chatbot setup is required.</p>
        <p style="font-size: 12px; margin-bottom: 16px;">Please configure your LLM and embedding providers in the admin settings.</p>
      </div>
    `;
  }

  function renderGreeting(state) {
    const settings = state.settings;
    const cardColor =
      settings.response_card_color || DEFAULT_COLORS.responseCard;
    const textColor =
      settings.response_text_color || DEFAULT_COLORS.responseText;
    const metadataColor =
      settings.response_metadata_color || DEFAULT_COLORS.responseMetadata;

    return `
      <div class="chatbot-widget-message assistant">
        <div class="chatbot-widget-message-content" style="background-color: ${cardColor}; color: ${textColor};">
          <div>${settings.greeting_message || "Hi there! How can I help?"}</div>
          <div class="chatbot-widget-message-metadata" style="color: ${metadataColor};">
            <span>${settings.chatbot_name}</span>
            <span>•</span>
            <span>AI Agent</span>
            <span>•</span>
            <span>Just now</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderUserMessage(msg, settings) {
    const cardColor = settings.user_card_color || DEFAULT_COLORS.userCard;
    const textColor = settings.user_text_color || DEFAULT_COLORS.userText;

    return `
      <div class="chatbot-widget-message user">
        <div class="chatbot-widget-message-content" style="background-color: ${cardColor}; color: ${textColor};">
          ${msg.content}
        </div>
      </div>
    `;
  }

  function renderAssistantMessage(msg, settings) {
    const isError = msg.isError;
    const cardColor = isError
      ? "#fee2e2"
      : settings.response_card_color || DEFAULT_COLORS.responseCard;
    const textColor = isError
      ? "#991b1b"
      : settings.response_text_color || DEFAULT_COLORS.responseText;
    const border = isError ? "none" : "1px solid #e5e7eb";
    const metadataColor =
      settings.response_metadata_color || DEFAULT_COLORS.responseMetadata;

    const metadataHtml = !isError
      ? `
        <div class="chatbot-widget-message-metadata" style="color: ${metadataColor};">
          <span>${settings.chatbot_name}</span>
          <span>•</span>
          <span>AI Agent</span>
          ${
            msg.timestamp
              ? `<span>•</span><span>${formatTimestamp(msg.timestamp)}</span>`
              : ""
          }
        </div>
      `
      : "";

    return `
      <div class="chatbot-widget-message assistant">
        <div class="chatbot-widget-message-content" style="background-color: ${cardColor}; color: ${textColor}; border: ${border};">
          <div>${msg.content}</div>
          ${metadataHtml}
        </div>
      </div>
    `;
  }

  function renderMessages(state) {
    if (!state.setupComplete) {
      return renderSetupMessage();
    }

    if (state.messages.length === 0) {
      return renderGreeting(state);
    }

    return state.messages
      .map((msg) => {
        if (msg.role === "user") {
          return renderUserMessage(msg, state.settings);
        } else {
          return renderAssistantMessage(msg, state.settings);
        }
      })
      .join("");
  }

  function renderLoadingIndicator() {
    return `
      <div class="chatbot-widget-message assistant">
        <div class="chatbot-widget-loading">
          <div class="chatbot-widget-loading-dot"></div>
          <div class="chatbot-widget-loading-dot"></div>
          <div class="chatbot-widget-loading-dot"></div>
        </div>
      </div>
    `;
  }

  function renderInput(state) {
    const settings = state.settings;
    const sendIconColor = settings.send_icon_color || DEFAULT_COLORS.sendIcon;
    const placeholder = state.setupComplete
      ? settings.input_placeholder || "Ask a question..."
      : "Setup required...";
    const disabled = state.loading || !state.setupComplete;

    return `
      <div class="chatbot-widget-input-container">
        <div class="chatbot-widget-input-wrapper">
          <textarea 
            class="chatbot-widget-input" 
            placeholder="${placeholder}"
            rows="1"
            ${disabled ? "disabled" : ""}
          ></textarea>
          <button 
            class="chatbot-widget-send" 
            style="color: ${sendIconColor};"
            ${state.loading ? "disabled" : ""}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  function updateSendButtonOpacity(sendBtn, textarea, state) {
    if (!sendBtn || !textarea) return;
    if (state.loading || !state.setupComplete) {
      sendBtn.style.opacity = "0.3";
      return;
    }
    const hasText = textarea.value.trim().length > 0;
    sendBtn.style.opacity = hasText ? "1" : "0.5";
  }

  function setupTextareaHandlers(textarea, state, sendMessage, sendBtn) {
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (textarea.value.trim() && !state.loading && state.setupComplete) {
          sendMessage(textarea.value);
          textarea.value = "";
          updateSendButtonOpacity(sendBtn, textarea, state);
        }
      }
    });

    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 24;
      const maxHeight = lineHeight * 3;
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
      updateSendButtonOpacity(sendBtn, textarea, state);
    });
  }

  function setupSendButton(sendBtn, textarea, state, sendMessage) {
    sendBtn.addEventListener("click", () => {
      if (
        textarea &&
        textarea.value.trim() &&
        !state.loading &&
        state.setupComplete
      ) {
        sendMessage(textarea.value);
        textarea.value = "";
        updateSendButtonOpacity(sendBtn, textarea, state);
      }
    });
  }

  function scrollToBottom(container) {
    const messagesEl = container.querySelector(".chatbot-widget-messages");
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function createWidget(config) {
    const state = createWidgetState(config);
    const container = document.createElement("div");
    container.className = "chatbot-widget-container";
    document.body.appendChild(container);

    setInterval(() => {
      state.currentTime = new Date();
    }, 10000);

    async function loadSettings() {
      try {
        const response = await fetch(
          `${state.baseUrl}/api/embed-settings?userId=${state.userId}`
        );
        const data = await response.json();
        if (data.success) {
          state.settings = data.settings;
          state.setupComplete = checkSetupComplete(state.settings);
          console.log("Chatbot embed: Setup complete:", state.setupComplete);
          render();
        } else {
          console.error("Chatbot embed: Failed to load settings:", data.error);
          state.setupComplete = false;
          render();
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        state.setupComplete = false;
        render();
      }
    }

    async function sendMessage(text) {
      if (!text.trim() || state.loading || !state.setupComplete) return;

      const userMessage = {
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      state.messages.push(userMessage);
      state.loading = true;
      render();

      try {
        const response = await fetch(`${state.baseUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: text.trim(),
            userId: state.userId,
            limit: 5,
            threshold: 0.3,
          }),
        });

        const data = await response.json();

        if (data.success) {
          state.messages.push({
            role: "assistant",
            content: data.answer,
            timestamp: new Date().toISOString(),
          });
        } else {
          state.messages.push({
            role: "assistant",
            content: `Error: ${data.error || "Failed to get response"}`,
            isError: true,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        state.messages.push({
          role: "assistant",
          content: `Error: ${error.message}`,
          isError: true,
          timestamp: new Date().toISOString(),
        });
      } finally {
        state.loading = false;
        render();
      }
    }

    function render() {
      if (!state.settings) {
        container.innerHTML = "";
        return;
      }

      if (!state.isOpen) {
        renderButton(state, container, () => {
          state.isOpen = true;
          render();
        });
        return;
      }

      container.innerHTML = `
        <div class="chatbot-widget-window">
          ${renderHeader(state)}
          <div class="chatbot-widget-messages">
            ${renderMessages(state)}
            ${state.loading ? renderLoadingIndicator() : ""}
          </div>
          ${renderInput(state)}
        </div>
      `;

      const closeBtn = container.querySelector(".chatbot-widget-close");
      closeBtn.addEventListener("click", () => {
        state.isOpen = false;
        render();
      });

      const textarea = container.querySelector(".chatbot-widget-input");
      const sendBtn = container.querySelector(".chatbot-widget-send");

      if (textarea && sendBtn) {
        updateSendButtonOpacity(sendBtn, textarea, state);
        setupTextareaHandlers(textarea, state, sendMessage, sendBtn);
      }

      if (sendBtn) {
        setupSendButton(sendBtn, textarea, state, sendMessage);
      }

      setTimeout(() => scrollToBottom(container), 100);
    }

    loadSettings();
  }

  function findScriptElement() {
    if (document.currentScript) {
      return document.currentScript;
    }

    const scripts = document.querySelectorAll("script[data-user-id]");
    if (scripts.length > 0) {
      return scripts[scripts.length - 1];
    }

    const allScripts = document.getElementsByTagName("script");
    for (let i = allScripts.length - 1; i >= 0; i--) {
      const s = allScripts[i];
      if (
        s.src &&
        s.src.includes("embed.js") &&
        s.hasAttribute("data-user-id")
      ) {
        return s;
      }
    }

    return null;
  }

  function init() {
    loadStyles();

    const script = findScriptElement();

    if (!script) {
      console.error(
        "Chatbot embed: Could not find script element with data-user-id attribute"
      );
      return;
    }

    const userId = script.getAttribute("data-user-id");
    const baseUrl =
      script.getAttribute("data-base-url") || window.location.origin;

    if (!userId || userId === "YOUR_USER_ID") {
      console.error(
        "Chatbot embed: data-user-id attribute is required or invalid"
      );
      return;
    }

    createWidget({ userId, baseUrl });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    if (document.body) {
      init();
    } else {
      window.addEventListener("load", init);
    }
  }
})();
