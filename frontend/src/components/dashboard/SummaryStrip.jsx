import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Hash, CreditCard } from "lucide-react";
import { formatCurrency, formatCurrencyNoSign } from "../../utils/formatCurrency.js";
import {
  getTimeRangeStats,
  formatPercentChange,
  getSparklineMicroLabel,
} from "../../utils/dashboardRangeStats.js";

const useCountUp = (target, duration = 1200) => {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!target && target !== 0) {
      setCurrent(0);
      return;
    }

    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (Number(target) - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return current;
};

const Sparkline = ({ values, color }) => {
  const w = 80;
  const h = 20;
  const paddingX = 2;
  const paddingY = 2;
  let safe = Array.isArray(values) ? values.filter((n) => Number.isFinite(n)) : [];
  if (safe.length === 0) safe = [0];
  if (safe.length === 1) safe = [safe[0], safe[0]];
  const min = Math.min(...safe, 0);
  const max = Math.max(...safe, 1);
  const range = max - min || 1;

  const points = safe.map((v, i) => {
    const x = paddingX + (i * (w - paddingX * 2)) / Math.max(1, safe.length - 1);
    const y = paddingY + (h - paddingY * 2) * (1 - (v - min) / range);
    return { x, y };
  });

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="select-none" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
};

/**
 * @param {object} props
 * @param {Array} props.transactions — rows in the selected time range (main KPIs)
 * @param {Array} props.allTransactions — full list for period-over-period + sparklines
 * @param {string} props.selectedRange — dateFilterUtils preset (incl. overall)
 */
export const SummaryStrip = ({ transactions = [], allTransactions = [], selectedRange = "1y" }) => {
  const all = allTransactions?.length ? allTransactions : transactions;

  const stats = React.useMemo(
    () => getTimeRangeStats(transactions, all, selectedRange, new Date()),
    [transactions, all, selectedRange]
  );

  const { current, comparison, comparisonLabel } = stats;

  const balancePositive = current.totalBalance >= 0;

  const balanceAnimated = useCountUp(current.totalBalance, 1200);
  const incomeAnimated = useCountUp(current.totalIncome, 1200);
  const expensesAnimated = useCountUp(current.totalExpenses, 1200);
  const countAnimated = useCountUp(current.transactionCount, 800);

  const cardConfigs = [
    {
      key: "totalBalance",
      label: "Balance",
      icon: Wallet,
      textColor: balancePositive ? "#14b8a6" : "#ef4444",
    },
    {
      key: "totalIncome",
      label: "Income",
      icon: TrendingUp,
      textColor: "#22c55e",
    },
    {
      key: "totalExpenses",
      label: "Expenses",
      icon: CreditCard,
      textColor: "#ef4444",
    },
    {
      key: "transactionCount",
      label: "Transactions",
      icon: Hash,
      textColor: "#14b8a6",
    },
  ];

  const animatedValues = {
    totalBalance: formatCurrency(balanceAnimated),
    totalIncome: formatCurrency(incomeAnimated),
    totalExpenses: formatCurrencyNoSign(expensesAnimated),
    transactionCount: String(countAnimated),
  };

  const changes = {
    totalBalance: comparison.totalBalance,
    totalIncome: comparison.totalIncome,
    totalExpenses: comparison.totalExpenses,
    transactionCount: comparison.transactionCount,
  };

  const isOverall = selectedRange === "overall";

  return (
    <motion.div
      className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200/60 dark:border-white/10 p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header with insight */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Financial Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isOverall ? "All-time performance" : `${comparisonLabel} summary`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Health Score</div>
          <div className="text-lg font-bold text-teal-600 dark:text-teal-400">87%</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfigs.map((cfg, index) => {
          const AnimatedValue = animatedValues[cfg.key];
          const changeVal = changes[cfg.key];
          const series = stats.sparklines[cfg.key] || [0];
          const countMetric = cfg.key === "transactionCount";

          return (
            <motion.div
              key={cfg.key}
              className="flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 380, damping: 14 }}
                >
                  <cfg.icon size={16} style={{ color: cfg.textColor, opacity: 0.9 }} />
                </motion.div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {cfg.label}
                </div>
              </div>

              <motion.div
                className="font-mono font-bold text-xl leading-tight mb-1"
                style={{ color: cfg.textColor }}
                initial={{ scale: 0.92 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.55, delay: index * 0.1 + 0.15, ease: "easeOut" }}
              >
                {AnimatedValue}
              </motion.div>

              {!isOverall && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-lime-600 dark:text-lime-400/80">
                    {formatPercentChange(changeVal)}
                  </span>
                  <div className="flex-1 opacity-60">
                    <Sparkline values={series} color={cfg.textColor} />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};