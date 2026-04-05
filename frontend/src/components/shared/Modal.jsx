import React, { useEffect } from "react";

export const Modal = ({
  open,
  title,
  children,
  onClose,
  widthClassName = "max-w-lg",
}) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-full items-center px-4 py-6">
        <div className={`w-full ${widthClassName}`}>
          <div className="rounded-xl border border-gray-200 bg-white shadow-soft dark:border-gray-700 dark:bg-gray-800">
            {title ? (
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
            ) : null}
            <div className="px-5 py-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

