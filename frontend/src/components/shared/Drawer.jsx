import React, { useEffect } from "react";

export const Drawer = ({ open, title, onClose, children, width = "w-[420px]" }) => {
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
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={[
          "absolute right-0 top-0 h-full max-w-full overflow-y-auto rounded-l-2xl border border-indigo-500/15 bg-white/80 shadow-soft backdrop-blur-xl dark:bg-[#0d1424]/80 dark:border-indigo-500/20",
          width,
          "drawer-in",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3 border-b border-indigo-500/10 px-5 py-4">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title || "Details"}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-white/70 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>
      </aside>
    </div>
  );
};

