import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export const CopilotInput = ({ value, onChange, onSend, disabled, placeholder }) => (
  <div className="border-t border-gray-200/80 p-4 dark:border-white/10">
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/95 px-2 py-1.5 shadow-inner focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-white/10 dark:bg-card-900/90">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[13px] text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
        aria-label="Ask Financer"
      />
      <motion.button
        type="button"
        disabled={disabled || !String(value || "").trim()}
        whileTap={{ scale: 0.95 }}
        onClick={onSend}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        aria-label="Send"
      >
        <Send className="h-4 w-4" />
      </motion.button>
    </div>
  </div>
);
