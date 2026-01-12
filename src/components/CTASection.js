"use client";

import { useChatWidgetContext } from "@/contexts/ChatWidgetContext";

export default function CTASection({ loading, user }) {
  const { openChatWidget } = useChatWidgetContext();

  const handleGetStarted = (e) => {
    e.preventDefault();
    openChatWidget();
  };

  return (
    <section className="bg-gray-800">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-sm mx-auto text-center">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white">
            Get started today
          </h2>
          <p className="mb-6 font-light text-gray-400 md:text-lg">
            Try KnowledgeBase AI for free.
          </p>
          {loading ? (
            <div className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none inline-block">
              Loading...
            </div>
          ) : (
            <button
              onClick={handleGetStarted}
              className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none inline-block"
            >
              Get started
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
