import React from "react";
import { motion } from "framer-motion";
import { formatCurrency, formatCurrencyNoSign } from "../../utils/formatCurrency.js";
import { getMonthlyTotals } from "../../utils/getMonthlyTotals.js";
import { Badge } from "../shared/Badge.jsx";

export const MonthlyComparison = ({ transactions }) => {
  const monthly = React.useMemo(() => getMonthlyTotals(transactions, 3), [transactions]);

  return (
    <motion.div
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft dark:border-gray-700 dark:bg-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Monthly Comparison (Last 3 Months)
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">Income vs Expenses</div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
              <th className="py-3 px-2">Month</th>
              <th className="py-3 px-2">Income</th>
              <th className="py-3 px-2">Expenses</th>
              <th className="py-3 px-2">Net</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((m) => {
              const isPositive = m.net >= 0;
              return (
                <tr key={m.key} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-2 text-sm text-gray-700 dark:text-gray-200">{m.monthLabel}</td>
                  <td className="py-3 px-2 text-sm text-emerald-700 dark:text-emerald-300 font-semibold amount-mono">
                    {formatCurrencyNoSign(m.income)}
                  </td>
                  <td className="py-3 px-2 text-sm text-rose-700 dark:text-rose-300 font-semibold amount-mono">
                    {formatCurrencyNoSign(m.expenses)}
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={isPositive ? "income" : "expense"}>
                      Net: {formatCurrency(m.net)}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            {monthly.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-5 px-2 text-center text-sm text-gray-500 dark:text-gray-400">
                  No data available.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

