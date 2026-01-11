"use client";

import Link from "next/link";

export default function Header({
  showAuth = false,
  user = null,
  loading = false,
  onLogout,
}) {
  return (
    <header className="bg-gray-900 shadow-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {showAuth ? (
              <h1 className="text-2xl font-bold text-white">
                KnowledgeBase AI
              </h1>
            ) : (
              <Link href="/" className="text-2xl font-bold text-white">
                KnowledgeBase AI
              </Link>
            )}
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              GitHub
            </a>
            {showAuth && (
              <>
                {loading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : user ? (
                  <>
                    <Link
                      href="/admin"
                      className="text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      Admin
                    </Link>
                    <button
                      onClick={onLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
