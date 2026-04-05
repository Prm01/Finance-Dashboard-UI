import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

export const IncomeExpenseTrendChart = ({ transactions = [] }) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return [];
    }

    // Group by month
    const months = {};
    transactions.forEach((t) => {
      const date = t.date ? new Date(t.date) : null;
      if (!date || Number.isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months[monthKey]) {
        months[monthKey] = { income: 0, expense: 0, month: monthKey };
      }

      if (t.type === "income") {
        months[monthKey].income += t.amount || 0;
      } else {
        months[monthKey].expense += t.amount || 0;
      }
    });

    // Sort by month
    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((m) => ({
        month: new Date(`${m.month}-01`).toLocaleDateString("en-IN", { month: "short" }),
        Income: m.income,
        Expenses: m.expense,
      }));
  }, [transactions]);

  const getTextColor = () => {
    const root = document.documentElement;
    return root.classList.contains("dark") ? "#9ca3af" : "#6b7280";
  };

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0 }}
    >
      {/* Minimal header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Income vs Expenses</h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">6-month trend</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
        >
          <TrendingUp size={18} style={{ color: "#3b82f6", opacity: 0.6 }} />
        </motion.div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 max-w-full overflow-hidden">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-xs opacity-60 text-gray-600 dark:text-gray-400">
              Not enough data to display chart
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" maxHeight="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke={getTextColor()}
                style={{ fontSize: 12 }}
                interval="preserveStartEnd"
                angle={0}
                height={40}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke={getTextColor()}
                style={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                width={60}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "rgba(20, 24, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
                  border: `1px solid ${isDark ? "rgba(217, 119, 6, 0.3)" : "rgba(217, 119, 6, 0.2)"}`,
                  borderRadius: "12px",
                  fontSize: "12px",
                  maxWidth: "200px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
                formatter={(value) => `₹${(value || 0).toLocaleString('en-IN')}`}
                cursor={{ stroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)", strokeWidth: 1 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20, fontSize: "12px" }}
                iconType="line"
              />
              <Area
                type="monotone"
                dataKey="Income"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="Expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};
