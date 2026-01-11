import Link from "next/link";

export default function HeroSection({ loading, user }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">
        AI-Powered Knowledge Base Assistant
      </h2>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto">
        Build intelligent chatbots that deliver accurate, contextual answers
        directly from your product documentation using Retrieval-Augmented
        Generation (RAG).
      </p>
      <div className="mt-8">
        {loading ? (
          <div className="inline-block px-8 py-3 bg-gray-600 text-white rounded-lg text-lg font-semibold">
            Loading...
          </div>
        ) : user ? (
          <Link
            href="/admin"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Go to Admin
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
}

