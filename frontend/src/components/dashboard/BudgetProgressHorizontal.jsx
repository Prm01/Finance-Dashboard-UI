import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, AlertCircle } from "lucide-react";
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

const statusIcon = (status) => {
  switch (status) {
    case "over":
      return AlertCircle;
    case "near":
      return AlertCircle;
    default:
      return TrendingUp;
  }
};

export const BudgetProgressHorizontal = ({ transactions = [] }) => {
  const data = useMemo(() => getBudgetProgressData(transactions), [transactions]);
  const { summary, formatMoney } = data;

  const mainBarPct = Math.min(
    100,
    summary.plannedSpend > 0 ? (summary.actualSpend / summary.plannedSpend) * 100 : 0
  );

  const StatusIcon = statusIcon(summary.status);

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <motion.div whileHover={{ scale: 1.1 }} className="shrink-0">
            <Target size={20} className="text-teal-600 dark:text-teal-400" />
          </motion.div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              Budget Status
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {summary.totalIncome > 0
                ? `${Math.round((summary.actualSpend / summary.totalIncome) * 100)}% of income`
                : "No income"}
            </p>
          </div>
        </div>

        <motion.div
          className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
          style={{
            background:
              summary.status === "over"
                ? "rgba(239, 68, 68, 0.1)"
                : summary.status === "near"
                  ? "rgba(245, 158, 11, 0.1)"
                  : "rgba(20, 184, 166, 0.1)",
          }}
          whileHover={{ scale: 1.05 }}
        >
          <StatusIcon
            size={20}
            style={{
              color:
                summary.status === "over"
                  ? "#ef4444"
                  : summary.status === "near"
                    ? "#f59e0b"
                    : "#14b8a6",
            }}
          />
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barToneClass(summary.status)} shadow-sm`}
            initial={{ width: 0 }}
            animate={{ width: `${mainBarPct}%` }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
          <span>{formatMoney(summary.actualSpend)}</span>
          <span>{formatMoney(summary.plannedSpend)}</span>
        </div>
      </div>

      {/* Stats Grid - 3 Columns */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-gray-50 dark:bg-white/5 p-3 text-center">
          <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Income
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {formatMoney(summary.totalIncome)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-white/5 p-3 text-center">
          <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Spent
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {formatMoney(summary.actualSpend)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-white/5 p-3 text-center">
          <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {summary.actualSpend > summary.plannedSpend ? "Over" : "Left"}
          </p>
          <p
            className={`text-sm font-bold mt-1 ${
              summary.actualSpend > summary.plannedSpend
                ? "text-red-600 dark:text-red-400"
                : "text-teal-600 dark:text-teal-400"
            }`}
          >
            {formatMoney(
              summary.actualSpend > summary.plannedSpend ? summary.overBy : summary.remaining
            )}
          </p>
        </div>
      </div>

      {/* Insight Message - Compact */}
      <div
        className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
          summary.status === "over"
            ? "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            : summary.status === "near"
              ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              : "text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800"
        }`}
      >
        {summary.message}
      </div>
    </motion.div>
  );
};
