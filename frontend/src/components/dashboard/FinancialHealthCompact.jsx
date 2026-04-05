import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export const FinancialHealthCompact = ({ transactions = [] }) => {
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
      <div className="flex items-center gap-3 mb-4">
        <motion.div whileHover={{ scale: 1.08 }}>
          <StatusIcon size={18} style={{ color: config.color, opacity: 0.8 }} />
        </motion.div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
            Financial Health
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {config.label}
          </p>
        </div>
      </div>

      {/* Score */}
      <div className="mb-4">
        <div className="text-3xl font-bold mb-1" style={{ color: config.color }}>
          {health.score}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">out of 100</div>
      </div>

      {/* Savings Rate */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          {health.savingsRate}% savings rate
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          of your income saved
        </div>
      </div>

      {/* Quick breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Income</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{(health.breakdown.totalIncome || 0).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Expenses</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{(health.breakdown.totalExpense || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};