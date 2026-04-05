import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
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

const messageToneClass = (status) => {
  switch (status) {
    case "over":
      return "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    case "near":
      return "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
    default:
      return "text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800";
  }
};

export const BudgetProgressCard = ({ transactions = [] }) => {
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
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
            Budget progress
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Based on your income in the selected time range
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.08 }} className="shrink-0">
          <Target size={18} className="text-teal-600 dark:text-teal-400 opacity-80" />
        </motion.div>
      </div>

      {/* Human-like message */}
      <div className={`mb-3 p-3 rounded-lg border text-sm ${messageToneClass(summary.status)}`}>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {summary.message}
        </p>
      </div>

      {/* Supporting numbers */}
      <div className="mb-3 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Income
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
            {formatMoney(summary.totalIncome)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Spent
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
            {formatMoney(summary.actualSpend)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {summary.actualSpend > summary.plannedSpend ? 'Over' : 'Left'}
          </p>
          <p className={`text-sm font-bold mt-0.5 ${summary.actualSpend > summary.plannedSpend ? 'text-red-600 dark:text-red-400' : 'text-teal-600 dark:text-teal-400'}`}>
            {formatMoney(summary.actualSpend > summary.plannedSpend ? summary.overBy : summary.remaining)}
          </p>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 text-center">
        Budgets: Rent 40%, Food 15%, Transport 10%, Other 35%
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden ring-1 ring-gray-300/50 dark:ring-white/10">
          <motion.div
            className={`h-full rounded-full ${barToneClass(summary.status)} shadow-sm`}
            initial={{ width: 0 }}
            animate={{ width: `${mainBarPct}%` }}
            transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Insight message */}
      <p className="text-xs font-medium text-gray-800 dark:text-gray-100 mb-2 py-2 px-2.5 rounded-lg bg-teal-50/80 dark:bg-teal-500/10 border border-teal-200/60 dark:border-teal-500/25">
        {insight}
      </p>

      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
        Breakdown
      </p>
      <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {rows.map((item, idx) => {
          const rowBarPct = Math.min(100, item.budget > 0 ? (item.spent / item.budget) * 100 : 0);
          return (
            <motion.li
              key={item.category}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.08 * idx }}
              className="space-y-1"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{item.category}</span>
                <span className={`text-[11px] ${item.isOver ? 'text-red-600 dark:text-red-400' : 'text-teal-700 dark:text-teal-300'}`}>
                  {formatMoney(item.spent)} / {formatMoney(item.budget)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barToneClass(item.status)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${rowBarPct}%` }}
                  transition={{ duration: 0.55, delay: 0.12 + idx * 0.04 }}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
};
