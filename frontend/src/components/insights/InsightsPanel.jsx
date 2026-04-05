import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getMonthlyTotals } from "../../utils/getMonthlyTotals.js";
import { groupByCategory } from "../../utils/groupByCategory.js";
import { formatCurrency, formatCurrencyNoSign } from "../../utils/formatCurrency.js";
import { EXPENSE_CATEGORIES } from "../../constants/index.js";
import { MonthlyComparison } from "./MonthlyComparison.jsx";
import { SmartInsightsSection } from "./SmartInsightsSection.jsx";

const monthKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const IconWrap = ({ children, className }) => (
  <div
    className={[
      "rounded-xl border border-gray-200 bg-white p-3 shadow-soft dark:border-gray-700 dark:bg-gray-800",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

export const InsightsPanel = ({ transactions }) => {
  const txs = Array.isArray(transactions) ? transactions : [];

  const expenseTxs = txs.filter((t) => t.type === "expense");
  const incomeTotal = txs.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = expenseTxs.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const financialHealth = React.useMemo(() => {
    const income = Number(incomeTotal || 0);
    const expenses = Number(totalExpenses || 0);

    // Savings ratio: how much of income remains after expenses (0..1).
    const savingsRatio = income > 0 ? Math.max(0, Math.min(1, (income - expenses) / income)) : 0;

    // Spending balance: income coverage vs expenses (0..1), where >=1 means fully covered.
    const spendingBalance = expenses > 0 ? Math.max(0, Math.min(1, income / expenses)) : 1;

    const score = Math.round((savingsRatio * 0.6 + spendingBalance * 0.4) * 100);
    return { score, savingsRatio, spendingBalance, net: income - expenses };
  }, [incomeTotal, totalExpenses]);

  const ringColor = financialHealth.score >= 70 ? "#10b981" : financialHealth.score >= 45 ? "#f59e0b" : "#ef4444";
  const scorePct = financialHealth.score / 100;

  const expenseTotals = React.useMemo(() => {
    const totals = groupByCategory(expenseTxs);
    const list = EXPENSE_CATEGORIES.map((cat) => ({
      category: cat,
      value: Number(totals[cat] || 0),
    })).filter((x) => x.value > 0);
    list.sort((a, b) => b.value - a.value);
    return list;
  }, [expenseTxs]);

  const topExpense = expenseTotals[0] || { category: "—", value: 0 };

  const monthly3 = React.useMemo(() => getMonthlyTotals(txs, 3), [txs]);
  const monthly2 = React.useMemo(() => getMonthlyTotals(txs, 2), [txs]);
  const currMonth = monthly2[1] || null;
  const prevMonth = monthly2[0] || null;

  const transportAboveAverage = React.useMemo(() => {
    const transportTxs = expenseTxs.filter((t) => t.category === "Transport");
    if (transportTxs.length === 0) return { above: false, avg: 0 };

    const months = monthly3.map((m) => m.key);
    const totals = months.map((key) => {
      const monthTotal = transportTxs.reduce((sum, t) => {
        const d = t.date ? new Date(t.date) : null;
        if (!d || Number.isNaN(d.getTime())) return sum;
        return monthKey(d) === key ? sum + Number(t.amount || 0) : sum;
      }, 0);
      return monthTotal;
    });
    const avg = totals.reduce((a, b) => a + b, 0) / Math.max(1, totals.length);
    const lastMonthTransport = (() => {
      const lastKey = monthly3[monthly3.length - 1]?.key;
      if (!lastKey) return 0;
      return transportTxs.reduce((sum, t) => {
        const d = t.date ? new Date(t.date) : null;
        if (!d || Number.isNaN(d.getTime())) return sum;
        return monthKey(d) === lastKey ? sum + Number(t.amount || 0) : sum;
      }, 0);
    })();
    return { above: lastMonthTransport > avg && avg > 0, avg, lastMonthTransport };
  }, [expenseTxs, monthly3]);

  const observations = React.useMemo(() => {
    const items = [];

    if (currMonth) {
      const currKey = currMonth.key;
      const monthExpenseTxs = expenseTxs.filter((t) => {
        const d = t.date ? new Date(t.date) : null;
        if (!d || Number.isNaN(d.getTime())) return false;
        return monthKey(d) === currKey;
      });

      const currCategoryTotals = groupByCategory(monthExpenseTxs);
      const highest = EXPENSE_CATEGORIES.map((cat) => ({
        category: cat,
        value: Number(currCategoryTotals[cat] || 0),
      }))
        .filter((x) => x.value > 0)
        .sort((a, b) => b.value - a.value)[0];

      if (highest) {
        items.push({
          title: `Your highest expense this month is ${highest.category}`,
          value: formatCurrencyNoSign(highest.value),
          hint: "Based on the latest month in your data",
          icon: <ArrowDownRight size={16} className="text-rose-600" />,
        });
      }

      if (prevMonth) {
        const growth = prevMonth.expenses
          ? ((currMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100
          : null;
        if (growth !== null) {
          const dir = growth >= 0 ? "increased" : "decreased";
          items.push({
            title: `Expenses ${dir} by ${Math.abs(growth).toFixed(0)}% compared to last month`,
            value: `${formatCurrencyNoSign(currMonth.expenses)}`,
            hint: "Net effect from your transactions",
            icon: growth >= 0 ? <ArrowDownRight size={16} className="text-rose-600" /> : <ArrowUpRight size={16} className="text-emerald-600" />,
          });
        }
      }

      const net = currMonth.net;
      if (net > 0) {
        items.push({
          title: `You saved ${formatCurrencyNoSign(net)} this month`,
          value: formatCurrencyNoSign(net),
          hint: "Income minus expenses",
          icon: <Wallet size={16} className="text-emerald-600" />,
        });
      } else if (net < 0) {
        items.push({
          title: `You're overspending by ${formatCurrencyNoSign(Math.abs(net))} this month`,
          value: formatCurrencyNoSign(Math.abs(net)),
          hint: "Consider reviewing your largest expenses",
          icon: <TrendingUp size={16} className="text-rose-600" />,
        });
      }
    }

    if (transportAboveAverage.above) {
      items.push({
        title: `Transport spending is above your 3-month average`,
        value: formatCurrencyNoSign(transportAboveAverage.lastMonthTransport),
        hint: "Average vs latest month",
        icon: <ArrowDownRight size={16} className="text-rose-600" />,
      });
    }

    // Ensure 3–4 cards by adding a fallback.
    if (items.length < 3) {
      items.push({
        title: `Top expense category drives your spending`,
        value: formatCurrencyNoSign(topExpense.value),
        hint: `${topExpense.category} is your highest category overall`,
        icon: <ArrowUpRight size={16} className="text-indigo-600" />,
      });
    }

    return items.slice(0, 4);
  }, [currMonth, prevMonth, expenseTxs, transportAboveAverage, topExpense.value, topExpense.category]);

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <SmartInsightsSection transactions={txs} />

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Insights Snapshot
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">Auto-generated observations</div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {observations.map((o, idx) => (
            <motion.div
              key={`${o.title}_${idx}`}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-700 dark:bg-gray-800/80"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: idx * 0.06, ease: "easeOut" }}
            >
              <div className="flex items-start justify-between gap-3">
                <IconWrap className="p-2 bg-white/70 dark:bg-gray-800/60">
                  {o.icon}
                </IconWrap>
                <div className="text-right text-[11px] text-gray-500 dark:text-gray-400">Latest month</div>
              </div>
              <div className="mt-2 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100">{o.title}</div>
              <div className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 amount-mono">{o.value}</div>
              {o.hint ? <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{o.hint}</div> : null}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Financial Health Score</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Based on savings ratio + spending balance
              <span
                className="ml-2 cursor-help"
                title="Savings ratio = (Income - Expenses) / Income. Spending balance = Income / Expenses (capped)."
                aria-label="Why this score?"
              >
                Why?
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Out of 100</div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div style={{ width: 94, height: 94, position: "relative" }}>
              <svg viewBox="0 0 100 100" width="94" height="94" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="40" stroke="rgba(99,102,241,0.10)" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={ringColor}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={(1 - scorePct) * 2 * Math.PI * 40}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  color: "rgba(15,23,42,0.95)",
                }}
                className="dark:text-gray-100"
              >
                <span className="amount-mono">{financialHealth.score}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Savings outlook</div>
              <div
                className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100"
                style={{ color: ringColor }}
              >
                {financialHealth.score >= 70 ? "Healthy" : financialHealth.score >= 45 ? "Balanced" : "At risk"}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 amount-mono">
                Net: {formatCurrency(financialHealth.net)}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Savings ratio</div>
              <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100 amount-mono">
                {(financialHealth.savingsRatio * 100).toFixed(0)}%
              </div>
            </div>
            <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Spending balance</div>
              <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100 amount-mono">
                {(financialHealth.spendingBalance * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <MonthlyComparison transactions={txs} />
    </motion.div>
  );
};

