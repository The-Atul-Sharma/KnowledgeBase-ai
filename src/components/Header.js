"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header({
  showAuth = false,
  user = null,
  loading = false,
  onLogout,
  hideFeatures = false,
  hideHome = false,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-50">
      <nav className="bg-gray-900 border-gray-700 py-2.5">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              KnowledgeBase AI
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            {showAuth && (
              <>
                {loading ? (
                  <div className="text-gray-400 mr-4">Loading...</div>
                ) : user ? (
                  <>
                    <Link
                      href="/admin"
                      className="text-white hover:bg-gray-700 focus:ring-4 focus:ring-gray-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 focus:outline-none"
                    >
                      Admin
                    </Link>
                    <button
                      onClick={onLogout}
                      className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-400 rounded-lg lg:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${
              mobileMenuOpen ? "" : "hidden"
            }`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {!hideHome && (
                <li>
                  <Link
                    href="/"
                    className="block py-2 pl-3 pr-4 text-white bg-purple-600 rounded lg:bg-transparent lg:text-purple-500 lg:p-0"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
              )}
              {!hideFeatures && (
                <li>
                  <a
                    href="#features"
                    className="block py-2 pl-3 pr-4 text-gray-400 border-b border-gray-700 hover:bg-gray-700 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-500 lg:p-0"
                  >
                    Features
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
