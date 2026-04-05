import React from "react";
import { motion } from "framer-motion";

export const EmptyState = ({
  title = "Nothing to show",
  description = "Try adjusting your filters.",
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-dashed dark:border-gray-600 border-gray-300 dark:bg-gray-800/30 bg-gray-50/50 p-8 sm:p-12 text-center backdrop-blur-sm"
    >
      {/* Icon Placeholder */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full dark:bg-gray-700/50 bg-gray-200/50 flex items-center justify-center">
          <svg className="w-8 h-8 dark:text-gray-500 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <h3 className="text-base font-semibold dark:text-gray-200 text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm dark:text-gray-400 text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          {action}
        </motion.div>
      ) : null}
    </motion.div>
  );
};

