export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-4">Product Knowledge Chatbot</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Click the chat button in the bottom right corner to get started
          </p>
          <div className="space-y-4 text-left">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Features</h2>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Ask questions about your products</li>
                <li>• Switch between OpenAI and Ollama</li>
                <li>• Answers based strictly on your content</li>
              </ul>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Get Started</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add content via the{" "}
                <a href="/admin" className="text-blue-500 hover:underline">
                  admin interface
                </a>{" "}
                to enable the chatbot
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
