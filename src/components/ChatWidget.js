"use client";

import { useEffect } from "react";
import { useWidgetSetup } from "@/hooks/useWidgetSetup";
import { useChatWidget } from "@/hooks/useChatWidget";
import { useChatWidgetContext } from "@/contexts/ChatWidgetContext";
import WidgetToggle from "./ChatWidget/WidgetToggle";
import WidgetHeader from "./ChatWidget/WidgetHeader";
import WidgetMessages from "./ChatWidget/WidgetMessages";
import WidgetInput from "./ChatWidget/WidgetInput";

export default function ChatWidget() {
  const { isOpen, setIsOpen } = useChatWidgetContext();
  const { isSetupComplete, checkingSetup, userId, customization } =
    useWidgetSetup();
  const {
    messages,
    input,
    loading,
    messagesEndRef,
    inputRef,
    setInput,
    handleSubmit,
    getFormattedTimestamp,
  } = useChatWidget(userId, isSetupComplete);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, inputRef]);

  return (
    <>
      {!isOpen && <WidgetToggle onOpen={() => setIsOpen(true)} />}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
          <WidgetHeader
            customization={customization}
            onClose={() => setIsOpen(false)}
          />
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            <WidgetMessages
              checkingSetup={checkingSetup}
              isSetupComplete={isSetupComplete}
              messages={messages}
              customization={customization}
              greetingMessage={customization.greeting_message}
              getFormattedTimestamp={getFormattedTimestamp}
              loading={loading}
              messagesEndRef={messagesEndRef}
            />
          </div>
          <WidgetInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            loading={loading}
            isSetupComplete={isSetupComplete}
            customization={customization}
            inputRef={inputRef}
          />
        </div>
      )}
    </>
  );
}
