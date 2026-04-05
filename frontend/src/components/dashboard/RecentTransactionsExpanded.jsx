import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { getRecentTransactions } from "../../utils/dashboardRangeStats.js";

const formatDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(d);
};

const CATEGORY_COLORS = {
  Food: "#f59e0b",
  Rent: "#ef4444",
  Transport: "#3b82f6",
  Shopping: "#ec4899",
  Health: "#10b981",
  Utilities: "#64748b",
  Entertainment: "#8b5cf6",
  Education: "#14b8a6",
  Salary: "#6366f1",
  Freelance: "#10b981",
  Investment: "#3b82f6",
};

export const RecentTransactionsExpanded = ({ transactions = [] }) => {
  const navigate = useNavigate();

  const list = React.useMemo(() => getRecentTransactions(transactions, 5), [transactions]);

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Latest 5 entries</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
        >
          <TrendingDown size={18} style={{ color: "#14b8a6", opacity: 0.6 }} />
        </motion.div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-5">
        {list.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center">
            <div className="text-xs opacity-60 text-gray-600 dark:text-gray-400">
              No transactions yet
            </div>
          </div>
        ) : (
          list.map((t, idx) => {
            const isIncome = t.type === "income";
            const categoryColor = CATEGORY_COLORS[t.category] || "#6366f1";

            return (
              <motion.div
                key={t._id || t.id}
                className="flex items-center justify-between gap-3 p-3 rounded-3xl border border-gray-200/60 bg-white/95 dark:border-white/10 dark:bg-card-900/90 transition-colors hover:shadow-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + idx * 0.04 }}
              >
                {/* Left: Category & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Category Badge */}
                  <motion.div
                    className="flex items-center justify-center shrink-0 w-9 h-9 rounded-lg"
                    style={{
                      background: `${categoryColor}20`,
                      border: `1px solid ${categoryColor}40`,
                    }}
                    whileHover={{ scale: 1.08 }}
                  >
                    {isIncome ? (
                      <TrendingUp size={16} style={{ color: categoryColor }} />
                    ) : (
                      <TrendingDown size={16} style={{ color: categoryColor }} />
                    )}
                  </motion.div>

                  {/* Text */}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {t.category}
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-400 truncate">
                      {formatDate(t.date)} • {t.description || "—"}
                    </div>
                  </div>
                </div>

                {/* Right: Amount */}
                <div className="flex items-center gap-1 shrink-0">
                  <div
                    className="text-sm font-bold text-right tabular-nums"
                    style={{
                      color: isIncome ? "#10b981" : "#ef4444",
                    }}
                  >
                    {formatCurrency(isIncome ? Math.abs(Number(t.amount || 0)) : -Math.abs(Number(t.amount || 0)))}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Divider */}
      <div className="mb-4 mt-auto pt-4" />

      {/* View All CTA */}
      <motion.button
        onClick={() => navigate("/transactions")}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5"
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{ scale: 0.98 }}
      >
        View All Transactions
        <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );
};
