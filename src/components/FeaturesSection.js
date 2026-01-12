const CHECK_ICON = (
  <svg
    className="flex-shrink-0 w-5 h-5 text-purple-400"
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
);

const features = [
  {
    title: "RAG-Powered Accuracy",
    description:
      "KnowledgeBase AI uses Retrieval-Augmented Generation to ensure responses are grounded in your actual documentation—no hallucinations, no generic answers. Get accurate, contextual responses every time.",
    features: [
      "Vector search powered by embeddings",
      "Multiple LLM support (OpenAI & Ollama)",
      "Effortless content management",
    ],
    footer:
      "Upload, organize, and manage your product documentation through a clean admin interface with fast and accurate vector search.",
    imageText: "Feature Image 1",
    imagePosition: "right",
  },
  {
    title: "Flexible AI Providers",
    description:
      "Choose between OpenAI or local Ollama models for both LLMs and embeddings. Keep full control over your AI stack, costs, and data with complete flexibility.",
    features: [
      "Secure user authentication",
      "Per-user configuration",
      "Customizable widget embedding",
      "Fast vector search with Supabase",
      "Clean admin interface",
    ],
    footer:
      "Each user can customize their own LLM and embedding providers independently for complete flexibility.",
    imageText: "Feature Image 2",
    imagePosition: "left",
  },
  {
    title: "Easy Widget Embedding",
    description:
      "Embed your chatbot widget seamlessly into any website with just a few lines of code. Fully customizable appearance, colors, and behavior to match your brand identity.",
    features: [
      "Simple script tag integration",
      "Fully customizable colors and styling",
      "Works on any website or platform",
    ],
    footer:
      "Copy and paste the embed code from your admin panel to add the chatbot to any website instantly. No complex setup required.",
    imageText: "Embed Widget",
    imagePosition: "right",
  },
  {
    title: "Website Content Scraper",
    description:
      "Automatically scrape and extract content from websites with configurable depth. Clean text extraction removes all HTML tags, scripts, and navigation elements for clean content ingestion.",
    features: [
      "Configurable scraping depth",
      "Clean text extraction (no HTML tags)",
      "Preview all scraped pages individually",
    ],
    footer:
      "Easily import website content into your knowledge base by scraping pages and following links up to the configured depth. Perfect for documentation sites and knowledge bases.",
    imageText: "Website Scraper",
    imagePosition: "left",
  },
];

function FeatureItem({ feature }) {
  return (
    <li className="flex space-x-3">
      {CHECK_ICON}
      <span className="text-base font-medium leading-tight text-white">
        {feature}
      </span>
    </li>
  );
}

function FeatureBlock({ feature }) {
  const isImageLeft = feature.imagePosition === "left";

  return (
    <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
      {isImageLeft && (
        <div className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex">
          <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">{feature.imageText}</span>
          </div>
        </div>
      )}
      <div className="text-gray-400 sm:text-lg">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white">
          {feature.title}
        </h2>
        <p className="mb-8 font-light lg:text-xl text-gray-400">
          {feature.description}
        </p>
        <ul
          role="list"
          className="pt-8 space-y-5 border-t border-gray-700 my-7"
        >
          {feature.features.map((item, index) => (
            <FeatureItem key={index} feature={item} />
          ))}
        </ul>
        <p
          className={`font-light lg:text-xl text-gray-400 ${
            isImageLeft ? "" : "mb-8"
          }`}
        >
          {feature.footer}
        </p>
      </div>
      {!isImageLeft && (
        <div className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex">
          <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">{feature.imageText}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="bg-gray-800">
      <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
        {features.map((feature, index) => (
          <FeatureBlock key={index} feature={feature} />
        ))}
      </div>
    </section>
  );
}
