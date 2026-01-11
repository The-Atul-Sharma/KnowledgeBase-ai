"use client";

export default function ChatHeader({ provider, onProviderChange, loading }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-2xl font-bold">Product Knowledge Chatbot</h1>
    </div>
  );
}
