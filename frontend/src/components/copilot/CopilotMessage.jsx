import React from "react";
import { motion } from "framer-motion";

export const CopilotMessage = ({ role, text }) => {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "max-w-[95%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
        isUser
          ? "ml-auto bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-md shadow-teal-900/20"
          : "mr-auto border border-gray-200/90 bg-white/95 text-gray-800 shadow-sm dark:border-white/10 dark:bg-gray-900/95 dark:text-gray-100",
      ].join(" ")}
    >
      <div
        className={[
          "mb-1 text-[10px] font-bold uppercase tracking-wider",
          isUser ? "text-teal-100/90" : "text-gray-400 dark:text-gray-500",
        ].join(" ")}
      >
        {isUser ? "You" : "Financer"}
      </div>
      <div className="whitespace-pre-wrap font-medium">{text}</div>
    </motion.div>
  );
};
