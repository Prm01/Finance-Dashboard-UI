import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const typeStyles = {
  success: {
    container: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  error: {
    container: "bg-rose-50 text-rose-800 border-rose-200",
    dot: "bg-rose-500",
  },
  info: {
    container: "bg-indigo-50 text-indigo-800 border-indigo-200",
    dot: "bg-indigo-500",
  },
  warning: {
    container: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
};

export const Toast = ({ toasts, onDismiss }) => {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[320px] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => {
          const s = typeStyles[t.type] || typeStyles.info;
          return (
            <motion.div
              key={t.id}
              className={[
                "pointer-events-auto rounded-xl border p-4 shadow-soft transition-all duration-200",
                s.container,
              ].join(" ")}
              initial={{ opacity: 0, x: 400, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 400, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 1
              }}
            >
              <div className="flex items-start gap-3">
                <motion.span 
                  className={["mt-1 h-2.5 w-2.5 rounded-full", s.dot].join(" ")}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{t.title}</div>
                  {t.message ? (
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {t.message}
                    </div>
                  ) : null}
                </div>
                <motion.button
                  type="button"
                  aria-label="Dismiss toast"
                  className="ml-auto rounded-lg px-2 py-1 text-gray-500 transition-all duration-200 hover:bg-white/60 hover:text-gray-900"
                  onClick={() => onDismiss?.(t.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

