"use client";

export default function EmbedTab({ user, setMessage }) {
  const handleCopy = async () => {
    const embedCode = user
      ? `<script src="${window.location.origin}/embed.js" data-user-id="${user.id}" data-base-url="${window.location.origin}"></script>`
      : "";
    try {
      await navigator.clipboard.writeText(embedCode);
      setMessage({
        type: "success",
        text: "Embed code copied to clipboard!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to copy. Please select and copy manually.",
      });
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Embed Chat Widget</h2>
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            How to Embed
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>Copy the embed code below</li>
            <li>
              Paste it before the closing &lt;/body&gt; tag on your website
            </li>
            <li>
              The chat widget will appear on your website with your configured
              settings
            </li>
          </ol>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Embed Code</label>
            <a
              href="/test-embed.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            >
              Test Embed Page →
            </a>
          </div>
          <div className="relative">
            <textarea
              readOnly
              value={
                user
                  ? `<script src="${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : ""
                    }/embed.js" data-user-id="${user.id}" data-base-url="${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : ""
                    }"></script>`
                  : "Loading..."
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 font-mono text-sm"
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Example HTML</h3>
          <pre className="text-xs bg-gray-900 dark:bg-black text-gray-100 p-3 rounded overflow-x-auto">
            {`<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome to my website</h1>
  
  <!-- Your website content -->
  
  <!-- Chatbot Embed Code -->
  <script src="${
    typeof window !== "undefined" ? window.location.origin : "YOUR_BASE_URL"
  }/embed.js" data-user-id="${user?.id || "YOUR_USER_ID"}" data-base-url="${
              typeof window !== "undefined"
                ? window.location.origin
                : "YOUR_BASE_URL"
            }"></script>
</body>
</html>`}
          </pre>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            Important Notes
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
            <li>
              Make sure your chatbot is fully configured in the LLM Settings tab
            </li>
            <li>
              The widget will use your customized colors, messages, and branding
            </li>
            <li>The embed script works on any website, not just Next.js</li>
            <li>
              Replace YOUR_BASE_URL with your actual domain when deploying
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
