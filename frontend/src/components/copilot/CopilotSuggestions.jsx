import React from "react";
import { motion } from "framer-motion";

const CHIPS = [
  "Overall summary",
  "This month",
  "Food spending",
  "Compare this month and last month",
  "Top category",
];

export const CopilotSuggestions = ({ onPick, disabled }) => (
  <div className="flex flex-wrap gap-2 px-4 pb-2">
    {CHIPS.map((label) => (
      <motion.button
        key={label}
        type="button"
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => onPick(label)}
        className="rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1.5 text-[11px] font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-100/90 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/20"
      >
        {label}
      </motion.button>
    ))}
  </div>
);
