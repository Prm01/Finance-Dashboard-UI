import React from "react";
import { motion } from "framer-motion";
import { TIME_RANGE_OPTIONS } from "../../utils/dateFilterUtils.js";

export const TimeRangeFilter = ({ selectedRange = "1y", onRangeChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
        Time range:
      </span>
      <div className="flex flex-wrap gap-2">
        {TIME_RANGE_OPTIONS.map(({ value, label }) => (
          <motion.button
            key={value}
            type="button"
            onClick={() => onRangeChange(value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedRange === value
                ? "bg-blue-500 text-white shadow-sm shadow-blue-500/30"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15"
            }`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
