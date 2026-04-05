import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const CopilotTrigger = ({ open, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className={[
      "fixed z-[60] flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg md:h-12 md:w-12",
      "bg-gradient-to-br from-indigo-600 to-violet-600 shadow-indigo-600/35",
      "bottom-24 right-4 md:bottom-8 md:right-6",
      open ? "ring-2 ring-indigo-300/80 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950" : "",
    ].join(" ")}
    style={{ boxShadow: "0 8px 32px rgba(99, 102, 241, 0.35)" }}
    aria-expanded={open}
    aria-label={open ? "Close Financer" : "Open Financer"}
  >
    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white/30" aria-hidden />
    <Sparkles className="h-6 w-6 md:h-5 md:w-5" strokeWidth={2} />
  </motion.button>
);
