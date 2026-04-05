import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export const FinancialHealthCard = ({ transactions = [] }) => {
  const health = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return { score: 0, status: "no-data", breakdown: {} };
    }

    const expenses = transactions.filter((t) => t.type === "expense");
    const income = transactions.filter((t) => t.type === "income");

    const totalExpense = expenses.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalIncome = income.reduce((sum, t) => sum + (t.amount || 0), 0);

    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    // Health score: 0-100
    let score = 50;

    if (savingsRate > 30) {
      score = 85 + (savingsRate - 30) / 2; // Up to 95
    } else if (savingsRate > 20) {
      score = 75;
    } else if (savingsRate > 10) {
      score = 65;
    } else if (savingsRate > 0) {
      score = 55;
    } else if (savings < 0) {
      score = 35;
    }

    score = Math.min(100, Math.max(0, score));

    const status = score >= 80 ? "excellent" : score >= 60 ? "good" : score >= 40 ? "fair" : "needs-work";

    return {
      score: Math.round(score),
      status,
      savingsRate: savingsRate.toFixed(1),
      breakdown: {
        totalIncome,
        totalExpense,
        savings,
      },
    };
  }, [transactions]);

  const statusConfig = {
    excellent: { color: "#10b981", label: "Excellent", icon: CheckCircle },
    good: { color: "#3b82f6", label: "Good", icon: TrendingUp },
    fair: { color: "#f59e0b", label: "Fair", icon: AlertCircle },
    "needs-work": { color: "#ef4444", label: "Needs Work", icon: AlertCircle },
    "no-data": { color: "#6b7280", label: "No Data", icon: AlertCircle },
  };

  const config = statusConfig[health.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-semibold tracking-wider uppercase text-gray-600 dark:text-gray-400">
            Financial Health
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Overall Score</div>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
        >
          <StatusIcon size={20} style={{ color: config.color, opacity: 0.7 }} />
        </motion.div>
      </div>

      {/* Score Circle */}
      <div className="flex items-center justify-center mb-4">
        <motion.div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: `${config.color}15`,
            border: `2px solid ${config.color}40`,
          }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: config.color }}>
              {health.score}
            </div>
            <div className="text-xs opacity-60 font-semibold">/ 100</div>
          </div>
        </motion.div>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{
          background: `${config.color}20`,
          border: `1px solid ${config.color}40`,
        }}>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-xs font-semibold" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="rounded-lg p-4 mb-6 border border-gray-200 dark:border-white/5">
        <div className="text-xs font-semibold tracking-wider uppercase text-gray-600 dark:text-gray-400 mb-2">
          Savings Rate
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {health.savingsRate}%
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500">
          of your income saved
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="opacity-60 text-gray-700 dark:text-gray-300">Income:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            ₹{(health.breakdown.totalIncome || 0).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="opacity-60 text-gray-700 dark:text-gray-300">Expenses:</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            ₹{(health.breakdown.totalExpense || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
