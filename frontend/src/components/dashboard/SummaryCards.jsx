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
  const w = 120;
  const h = 28;
  const paddingX = 2;
  const paddingY = 4;
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
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
};

/**
 * @param {object} props
 * @param {Array} props.transactions — rows in the selected time range (main KPIs)
 * @param {Array} props.allTransactions — full list for period-over-period + sparklines
 * @param {string} props.selectedRange — dateFilterUtils preset (incl. overall)
 */
export const SummaryCards = ({ transactions = [], allTransactions = [], selectedRange = "1y" }) => {
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
      label: "Total Balance",
      icon: Wallet,
      textColor: balancePositive ? "#14b8a6" : "#ef4444",
    },
    {
      key: "totalIncome",
      label: "Total Income",
      icon: TrendingUp,
      textColor: "#22c55e",
    },
    {
      key: "totalExpenses",
      label: "Total Expenses",
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cardConfigs.map((cfg, index) => {
        const AnimatedValue = animatedValues[cfg.key];
        const changeVal = changes[cfg.key];
        const series = stats.sparklines[cfg.key] || [0];
        const countMetric = cfg.key === "transactionCount";

        return (
          <motion.div
            key={cfg.key}
            className="card p-5 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between mb-4 sm:mb-6 gap-4">
              <div className="min-w-0">
                <div className="text-xs font-semibold tracking-wider uppercase text-text-muted dark:text-text-secondary mb-1">
                  {cfg.label}
                </div>
                {isOverall ? (
                  <div className="text-xs text-text-secondary dark:text-text-muted">
                    All-time totals — no period comparison
                  </div>
                ) : (
                  <div className="text-xs text-text-secondary dark:text-text-muted">
                    <span className="font-medium text-lime-600 dark:text-lime-400/80">
                      {formatPercentChange(changeVal)}
                    </span>
                    {comparisonLabel ? ` ${comparisonLabel}` : ""}
                  </div>
                )}
              </div>

              <motion.div
                className="flex items-center justify-center shrink-0 rounded-2xl bg-white/80 dark:bg-white/10 p-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 380, damping: 14 }}
              >
                <cfg.icon size={20} style={{ color: cfg.textColor, opacity: 0.9 }} />
              </motion.div>
            </div>

            <motion.div
              className="font-mono font-bold text-2xl sm:text-3xl leading-tight mb-3"
              style={{ color: cfg.textColor }}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.55, delay: index * 0.1 + 0.15, ease: "easeOut" }}
            >
              {AnimatedValue}
            </motion.div>

            <motion.div
              className="flex items-center justify-between gap-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.25 }}
            >
              <div className="text-xs text-text-secondary dark:text-text-muted font-medium truncate pr-2">
                {getSparklineMicroLabel(selectedRange, countMetric)}
              </div>
              <div className="shrink-0 opacity-80">
                <Sparkline values={series} color={cfg.textColor} />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
