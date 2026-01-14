"use client";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-2xl",
}) {
  if (!isOpen) return null;

  return (
    <div
      tabIndex={-1}
      aria-hidden={!isOpen}
      role="dialog"
      className={`fixed inset-0 z-50 overflow-y-auto overflow-x-hidden transition-all ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity pointer-events-none"></div>
      <div className="relative flex min-h-full items-center justify-center p-3 pointer-events-none">
        <div
          className={`${maxWidth} w-full m-3 sm:mx-auto relative z-10 pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`flex flex-col max-h-[90vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl pointer-events-auto 
            `}
          >
            {title && (
              <div className="flex-shrink-0 flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
                <h3
                  id="modal-title"
                  className="font-bold text-gray-800 dark:text-white"
                >
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">{children}</div>

            {footer && (
              <div className="flex-shrink-0 flex justify-between items-center py-3 px-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
