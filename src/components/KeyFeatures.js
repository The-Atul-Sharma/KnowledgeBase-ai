const features = [
  {
    title: "Embeddable Widget",
    description:
      "Easy-to-embed chatbot widget with full customization options for colors, messages, and branding",
  },
  {
    title: "Website Content Scraper",
    description:
      "Automatically scrape websites with configurable depth, clean text extraction, and selective page ingestion",
  },
  {
    title: "Multiple LLM Support",
    description:
      "Works with OpenAI GPT models, Google Gemini models, or local Ollama models (Llama 3.1, Qwen 3, etc.)",
  },
  {
    title: "Flexible Embedding Options",
    description:
      "Use OpenAI embeddings, Google Gemini embeddings, or local Ollama nomic-embed-text for on-premise processing",
  },
  {
    title: "Vector Search",
    description:
      "Semantic search powered by embeddings for highly accurate content retrieval.",
  },
  {
    title: "Secure User Authentication",
    description: "Built-in login and registration using Supabase Auth",
  },
];

export default function KeyFeatures() {
  return (
    <section id="features" className="bg-gray-900">
      <div className="items-center max-w-screen-xl px-4 py-8 mx-auto lg:grid lg:grid-cols-4 lg:gap-16 xl:gap-24 lg:py-24 lg:px-6">
        <div className="col-span-2 mb-8">
          <p className="text-lg font-medium text-purple-500">Key Features</p>
          <h2 className="mt-3 mb-4 text-3xl font-extrabold tracking-tight text-white md:text-3xl">
            Powerful features for intelligent chatbots
          </h2>
          <p className="font-light text-gray-400 sm:text-xl">
            Build sophisticated AI chatbots with vector search, multiple LLM
            support, website scraping, embeddable widgets, and flexible
            configuration options.
          </p>
        </div>
        <div className="col-span-2 space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
          {features.map((feature, index) => (
            <div key={index}>
              <svg
                className="w-10 h-10 mb-2 text-purple-500 md:w-12 md:h-12"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="mb-2 text-2xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="font-light text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
