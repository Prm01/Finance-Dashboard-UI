import React from "react";
import { Sparkles, X } from "lucide-react";

export const CopilotHeader = ({ onClose }) => (
  <div className="flex items-start justify-between gap-3 border-b border-gray-200/80 px-4 py-3 dark:border-white/10">
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
        <Sparkles className="h-5 w-5" strokeWidth={2} aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-sm font-bold tracking-tight text-gray-900 dark:text-white">Financer</h2>
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Live
          </span>
        </div>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Answers from your dashboard data only</p>
        <p className="mt-1 text-[11px] font-medium text-indigo-600/90 dark:text-indigo-300/90">
          Grounded in current dashboard data
        </p>
      </div>
    </div>
    <button
      type="button"
      onClick={onClose}
      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
      aria-label="Close Financer"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
);
