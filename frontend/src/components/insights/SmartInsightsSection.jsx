import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { buildSmartInsightCards } from "../../utils/insightsSmartCards.js";

const toneStyles = {
  indigo: "border-indigo-200/80 bg-indigo-50/50 dark:border-indigo-500/25 dark:bg-indigo-500/10",
  emerald: "border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-500/25 dark:bg-emerald-500/10",
  rose: "border-rose-200/80 bg-rose-50/50 dark:border-rose-500/25 dark:bg-rose-500/10",
};

const accentBar = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
};

export const SmartInsightsSection = ({ transactions }) => {
  const expenseTxs = useMemo(
    () => (Array.isArray(transactions) ? transactions.filter((t) => t.type === "expense") : []),
    [transactions]
  );

  const { cards, periodLabel } = useMemo(() => buildSmartInsightCards(expenseTxs), [expenseTxs]);

  return (
    <motion.section
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      aria-labelledby="smart-insights-heading"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden />
          <h2
            id="smart-insights-heading"
            className="text-sm font-semibold text-text-primary dark:text-text-100"
          >
            Smart Insights
          </h2>
        </div>
        {periodLabel ? (
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {periodLabel}
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <motion.article
            key={`${card.kind}_${idx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: idx * 0.06 }}
            className={[
              "relative overflow-hidden rounded-lg border px-4 py-3.5",
              toneStyles[card.tone] || toneStyles.indigo,
            ].join(" ")}
          >
            <div
              className={["absolute left-0 top-0 h-full w-1 rounded-l", accentBar[card.tone] || accentBar.indigo].join(
                " "
              )}
              aria-hidden
            />
            <h3 className="pl-2 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-50">
              {card.title}
            </h3>
            <p className="mt-1.5 pl-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {card.subtitle}
            </p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
};
