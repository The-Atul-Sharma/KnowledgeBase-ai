const features = [
  {
    title: "Vector Search:",
    description:
      "Semantic search powered by embeddings for highly accurate content retrieval.",
  },
  {
    title: "Multiple LLM Support:",
    description:
      "Works with OpenAI GPT models or local Ollama models (Llama 3.1, Qwen 3, etc.).",
  },
  {
    title: "Flexible Embedding Options:",
    description:
      "Use OpenAI embeddings or local Ollama nomic-embed-text for on-premise processing.",
  },
  {
    title: "Secure User Authentication:",
    description: "Built-in login and registration using Supabase Auth.",
  },
  {
    title: "Per-User Configuration:",
    description:
      "Each user can customize their own LLM and embedding providers independently.",
  },
];

const CheckIcon = () => (
  <path
    fillRule="evenodd"
    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
    clipRule="evenodd"
  />
);

export default function KeyFeatures() {
  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
      <h3 className="text-2xl font-semibold text-white mb-4">Key Features</h3>
      <ul className="space-y-3 text-gray-400">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <CheckIcon />
            </svg>
            <span>
              <strong>{feature.title}</strong> {feature.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
