import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { getMonthlyTotals } from "../../utils/getMonthlyTotals.js";
import { formatCurrencyNoSign } from "../../utils/formatCurrency.js";

const tooltipStyle = {
  background: "rgba(10,15,30,0.92)",
  border: "1px solid rgba(99,102,241,0.25)",
  borderRadius: "10px",
  color: "#e2e8f0",
  fontSize: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
};

const TooltipContent = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const income = payload.find((p) => p.dataKey === "income")?.value || 0;
  const expenses = payload.find((p) => p.dataKey === "expenses")?.value || 0;
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 700, opacity: 0.9 }}>{label}</div>
      <div className="mt-2 flex items-center justify-between gap-4 text-sm">
        <div style={{ opacity: 0.75 }}>Income</div>
        <div style={{ fontWeight: 800, color: "#10b981" }}>
          {formatCurrencyNoSign(income)}
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between gap-4 text-sm">
        <div style={{ opacity: 0.75 }}>Expenses</div>
        <div style={{ fontWeight: 800, color: "#ef4444" }}>
          {formatCurrencyNoSign(expenses)}
        </div>
      </div>
    </div>
  );
};

export const BalanceTrendChart = ({ transactions }) => {
  const monthly = React.useMemo(() => getMonthlyTotals(transactions, 6), [transactions]);

  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between gap-3 shrink-0 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Balance Trend
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">Last 6 months</div>
      </div>

      <motion.div 
        className="flex-1 min-h-0 w-full max-w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height="100%" maxHeight="100%">
          <LineChart data={monthly} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(99,102,241,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="monthLabel"
              tick={{ fill: "currentColor", fontSize: 11 }}
              interval={0}
              angle={0}
              height={50}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              style={{ color: "rgb(148 163 184)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickFormatter={(v) => {
                const nf = new Intl.NumberFormat("en-IN", {
                  maximumFractionDigits: 0,
                });
                return `₹ ${nf.format(v)}`;
              }}
              style={{ color: "rgb(148 163 184)" }}
              width={60}
            />
            <Tooltip
              content={<TooltipContent />}
              contentStyle={{
                ...tooltipStyle,
                maxWidth: "220px",
                fontSize: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#059669"
              strokeWidth={2}
              dot={{ r: 4, fill: "#fff", strokeWidth: 2, stroke: "#10b981" }}
              activeDot={{ r: 6, fill: "#fff", strokeWidth: 2, stroke: "#10b981" }}
              isAnimationActive
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#e11d48"
              strokeWidth={2}
              dot={{ r: 4, fill: "#fff", strokeWidth: 2, stroke: "#ef4444" }}
              activeDot={{ r: 6, fill: "#fff", strokeWidth: 2, stroke: "#ef4444" }}
              isAnimationActive
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

