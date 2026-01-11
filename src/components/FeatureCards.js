import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
    title: "RAG-Powered Accuracy",
    description:
      "ProductMind AI uses Retrieval-Augmented Generation to ensure responses are grounded in your actual documentation—no hallucinations, no generic answers.",
    iconBg: "bg-blue-900",
    iconColor: "text-blue-400",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    ),
    title: "Flexible AI Providers",
    description:
      "Choose between OpenAI or local Ollama models for both LLMs and embeddings. Keep full control over your AI stack, costs, and data.",
    iconBg: "bg-green-900",
    iconColor: "text-green-400",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
    title: "Effortless Content Management",
    description:
      "Upload, organize, and manage your product documentation through a clean admin interface. Fast and accurate vector search powered by Supabase.",
    iconBg: "bg-purple-900",
    iconColor: "text-purple-400",
  },
];

export default function FeatureCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}

