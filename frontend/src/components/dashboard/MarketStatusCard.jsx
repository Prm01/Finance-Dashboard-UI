import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { getMarketStatus } from "../../utils/indianMarketStatus.js";

export const MarketStatusCard = () => {
  const [status, setStatus] = useState(() => getMarketStatus());

  useEffect(() => {
    const tick = () => setStatus(getMarketStatus());
    tick();
    const id = setInterval(tick, 60000); // Update every minute
    return () => clearInterval(id);
  }, []);

  const isOpen = status.tone === "open";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className={`rounded-2xl border p-5 transition-colors ${
        isOpen
          ? "border-emerald-200/50 bg-emerald-50/80 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          : "border-slate-200/50 bg-slate-50/80 dark:border-slate-700/50 dark:bg-slate-900/30"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              isOpen
                ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/40"
                : "bg-slate-400 dark:bg-slate-500"
            }`}
            aria-hidden="true"
          />
          <span
            className={`text-sm font-bold uppercase tracking-wider ${
              isOpen
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Market {status.label}
          </span>
        </div>
        <motion.div
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${
            isOpen
              ? "bg-emerald-100 dark:bg-emerald-500/20"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {isOpen ? (
            <TrendingUp
              size={18}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <Activity
              size={18}
              className="text-slate-600 dark:text-slate-400"
            />
          )}
        </motion.div>
      </div>

      <p
        className={`text-sm font-medium mb-4 ${
          isOpen
            ? "text-emerald-800 dark:text-emerald-200"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {status.message}
      </p>

      <p
        className={`text-xs font-semibold tracking-[0.1em] uppercase ${
          isOpen
            ? "text-emerald-700/70 dark:text-emerald-300/60"
            : "text-slate-600/70 dark:text-slate-400/60"
        }`}
      >
        {status.timezone.replace("_", " ")} • NSE • BSE
      </p>
    </motion.div>
  );
};
