import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { groupByCategory } from "../../utils/groupByCategory.js";
import { formatCurrencyNoSign } from "../../utils/formatCurrency.js";
import { EXPENSE_CATEGORIES } from "../../constants/index.js";

const tooltipStyle = {
  background: "rgba(10,15,30,0.92)",
  border: "1px solid rgba(99,102,241,0.25)",
  borderRadius: "10px",
  color: "#e2e8f0",
  fontSize: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
};

const categoryColors = {
  Food: "#f59e0b",
  Rent: "#ef4444",
  Transport: "#3b82f6",
  Shopping: "#ec4899",
  Health: "#10b981",
  Utilities: "#64748b",
  Entertainment: "#8b5cf6",
  Education: "#14b8a6",
};

const TooltipContent = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 800, opacity: 0.9 }}>{p.name}</div>
      <div className="mt-2" style={{ fontWeight: 800, color: "#e2e8f0" }}>
        {formatCurrencyNoSign(p.value)}
      </div>
    </div>
  );
};

export const SpendingPieChart = ({ transactions }) => {
  const expenseTxs = React.useMemo(
    () => (Array.isArray(transactions) ? transactions.filter((t) => t.type === "expense") : []),
    [transactions]
  );

  const pieData = React.useMemo(() => {
    const totals = groupByCategory(expenseTxs);
    const categories = EXPENSE_CATEGORIES;
    return categories
      .map((cat) => ({
        name: cat,
        value: Number(totals[cat] || 0),
        color: categoryColors[cat] || "#6b7280",
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenseTxs]);

  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  // Responsive outer radius based on screen size
  const getOuterRadius = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return "70%"; // Mobile
      if (width < 1024) return "75%"; // Tablet
      return "80%"; // Desktop
    }
    return "75%"; // Default
  };

  const [outerRadius, setOuterRadius] = React.useState(getOuterRadius());

  React.useEffect(() => {
    const handleResize = () => setOuterRadius(getOuterRadius());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between gap-3 shrink-0 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Spending Breakdown
        </h2>
      </div>

      <motion.div 
        className="flex-1 min-h-0 w-full flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <div className="flex-1 min-h-0 max-w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%" maxHeight="100%">
            <PieChart>
              <Tooltip
                content={<TooltipContent />}
                contentStyle={{
                  ...tooltipStyle,
                  maxWidth: "180px",
                  fontSize: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                innerRadius="55%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                isAnimationActive
                animationBegin={200}
                animationDuration={900}
                activeShape={(props) => {
                  const {
                    cx,
                    cy,
                    innerRadius,
                    outerRadius,
                    startAngle,
                    endAngle,
                    fill,
                  } = props;

                  return (
                    <Sector
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={parseInt(outerRadius) + 8}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      fill={fill}
                      stroke="rgba(99,102,241,0.45)"
                      strokeWidth={2}
                    />
                  );
                }}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="pt-4">
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {pieData.length === 0 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                No expense data
              </div>
            ) : (
              pieData.slice(0, 5).map((d) => (
                <motion.div 
                  key={d.name} 
                  className="flex items-center justify-between gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="truncate text-sm text-gray-700 dark:text-gray-200">
                      {d.name}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 amount-mono">
                    {formatCurrencyNoSign(d.value)}
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <div className="mt-auto pt-4 text-xs text-gray-500 dark:text-gray-400">
            Total expenses:{" "}
            <span className="font-semibold amount-mono text-gray-900 dark:text-gray-100">
              {formatCurrencyNoSign(total)}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

