import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { getBudgetProgressData } from "../../utils/budgetProgressUtils.js";

const barToneClass = (status) => {
  switch (status) {
    case "over":
      return "bg-red-500 dark:bg-red-500";
    case "near":
      return "bg-amber-500 dark:bg-amber-400";
    default:
      return "bg-teal-500 dark:bg-teal-400";
  }
};

export const BudgetProgressCompact = ({ transactions = [] }) => {
  const data = useMemo(() => getBudgetProgressData(transactions), [transactions]);

  const { summary, insight, rows, formatMoney } = data;

  const mainBarPct = Math.min(100, summary.plannedSpend > 0 ? (summary.actualSpend / summary.plannedSpend) * 100 : 0);

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div whileHover={{ scale: 1.08 }} className="shrink-0">
          <Target size={18} className="text-teal-600 dark:text-teal-400 opacity-80" />
        </motion.div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
            Budget Status
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {summary.actualSpend > summary.plannedSpend ? 'Over budget' : 'On track'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barToneClass(summary.status)} shadow-sm`}
            initial={{ width: 0 }}
            animate={{ width: `${mainBarPct}%` }}
            transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{formatMoney(summary.actualSpend)}</span>
          <span>{formatMoney(summary.plannedSpend)}</span>
        </div>
      </div>

      {/* Key metrics */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">Income</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatMoney(summary.totalIncome)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {summary.actualSpend > summary.plannedSpend ? 'Over by' : 'Remaining'}
          </span>
          <span className={`text-sm font-semibold ${
            summary.actualSpend > summary.plannedSpend
              ? 'text-red-600 dark:text-red-400'
              : 'text-teal-600 dark:text-teal-400'
          }`}>
            {formatMoney(summary.actualSpend > summary.plannedSpend ? summary.overBy : summary.remaining)}
          </span>
        </div>
      </div>

      {/* Insight */}
      <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
        {insight}
      </div>
    </motion.div>
  );
};