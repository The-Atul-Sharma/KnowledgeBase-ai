"use client";

export default function MessageBubble({ message }) {
  const getMessageStyles = () => {
    if (message.role === "user") {
      return "bg-blue-500 text-white";
    }
    if (message.isError) {
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
    }
    return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100";
  };

  const getProviderName = (provider) => {
    return provider === "openai" ? "OpenAI" : "Ollama";
  };

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`max-w-[80%] rounded-lg p-4 ${getMessageStyles()}`}>
        <div className="whitespace-pre-wrap">{message.content}</div>
        {message.provider && (
          <div className="text-xs mt-2 opacity-70">
            Using {getProviderName(message.provider)} • {message.chunksUsed}{" "}
            chunks
          </div>
        )}
      </div>
    </div>
  );
}

