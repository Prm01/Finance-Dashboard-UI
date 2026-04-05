/**
 * Dashboard summary-card stats: period comparisons, labels, and sparkline buckets
 * aligned with dateFilterUtils presets.
 */
import { getStartDate } from "./dateFilterUtils.js";

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function parseTxDate(t) {
  if (!t?.date) return null;
  const d = new Date(t.date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Income, expenses, net balance, and count for a transaction list */
export function computePeriodTotals(transactions = []) {
  let income = 0;
  let expenses = 0;
  let count = 0;
  for (const t of transactions) {
    if (!parseTxDate(t)) continue;
    count += 1;
    const amt = Number(t.amount || 0);
    if (t.type === "income") income += amt;
    else if (t.type === "expense") expenses += amt;
  }
  return {
    totalIncome: income,
    totalExpenses: expenses,
    totalBalance: income - expenses,
    transactionCount: count,
  };
}

/** Transactions with date in [start, end] inclusive */
export function filterTransactionsBetween(transactions = [], start, end) {
  if (!start || !end) return Array.isArray(transactions) ? [...transactions] : [];
  return (transactions || []).filter((t) => {
    const d = parseTxDate(t);
    if (!d) return false;
    return d >= start && d <= end;
  });
}

/**
 * Current dashboard period [start, end] (local), matching filterByDateRange.
 * overall → null bounds (caller uses full list as-is).
 */
export function getCurrentPeriodBounds(range, now = new Date()) {
  if (range === "overall") return { start: null, end: null };

  if (range === "today") {
    return { start: startOfDay(now), end: endOfDay(now) };
  }

  if (range === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    return { start, end: endOfDay(now) };
  }

  const start = getStartDate(range);
  return { start, end: endOfDay(now) };
}

/**
 * Previous period for comparison, same semantics as UI copy (vs yesterday, vs previous 7d, etc.).
 * Returns null when comparison should be hidden (overall).
 */
export function getPreviousPeriodBounds(range, now = new Date()) {
  if (range === "overall") return null;

  if (range === "today") {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return { start: startOfDay(y), end: endOfDay(y) };
  }

  if (range === "this_month") {
    const prevLast = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const prevFirst = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    return { start: prevFirst, end: prevLast };
  }

  const { start: curStart, end: curEnd } = getCurrentPeriodBounds(range, now);
  if (!curStart) return null;

  // Rolling windows: previous slice of equal duration ending the instant before current starts
  const durationMs = curEnd.getTime() - curStart.getTime() + 1;
  const prevEnd = new Date(curStart.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs + 1);
  return { start: startOfDay(prevStart), end: endOfDay(prevEnd) };
}

/** Percent change; null if not meaningful */
export function percentChange(current, previous) {
  if (previous == null || Number.isNaN(previous)) return null;
  if (previous === 0) {
    if (current === 0) return null;
    return null;
  }
  return ((current - previous) / previous) * 100;
}

export function formatPercentChange(v) {
  if (v === null || Number.isNaN(v)) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

/** Line shown under card title: "vs …" */
export function getComparisonLabel(range) {
  switch (range) {
    case "today":
      return "vs yesterday";
    case "7d":
      return "vs previous 7 days";
    case "this_month":
      return "vs last month";
    case "30d":
      return "vs previous 30 days";
    case "3m":
      return "vs previous 3 months";
    case "6m":
      return "vs previous 6 months";
    case "1y":
      return "vs previous 12 months";
    case "overall":
    default:
      return "";
  }
}

/** Sparkline footer label (activity / trend) */
export function getTrendSubtitle(range) {
  switch (range) {
    case "today":
      return "Today activity";
    case "7d":
      return "7D trend";
    case "this_month":
      return "Monthly trend";
    case "30d":
      return "30D trend";
    case "3m":
      return "3M trend";
    case "6m":
      return "6M trend";
    case "1y":
      return "1Y trend";
    case "overall":
      return "All-time overview";
    default:
      return "Trend";
  }
}

/** Sparkline footer: "activity" for count series, else trend subtitle */
export function getSparklineMicroLabel(range, isCountMetric) {
  if (!isCountMetric) return getTrendSubtitle(range);
  if (range === "overall") return "All-time activity";
  if (range === "today") return "Today activity";
  return getTrendSubtitle(range).replace(/\btrend\b/i, "activity");
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function monthKeyFromDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function bucketTotals(txs, start, end) {
  const slice = filterTransactionsBetween(txs, start, end);
  return computePeriodTotals(slice);
}

/**
 * Build sparkline values for net / income / expenses / count.
 * Uses allTransactions so "today" can include yesterday for a 2-point line.
 */
export function buildSparklineSeries(allTransactions = [], range, now, metric) {
  const txs = Array.isArray(allTransactions) ? allTransactions : [];

  const pick = (totals) => {
    switch (metric) {
      case "income":
        return totals.totalIncome;
      case "expenses":
        return totals.totalExpenses;
      case "count":
        return totals.transactionCount;
      case "balance":
      default:
        return totals.totalBalance;
    }
  };

  if (range === "today") {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    const yBounds = { start: startOfDay(y), end: endOfDay(y) };
    const tBounds = { start: startOfDay(now), end: endOfDay(now) };
    return [
      pick(bucketTotals(txs, yBounds.start, yBounds.end)),
      pick(bucketTotals(txs, tBounds.start, tBounds.end)),
    ];
  }

  if (range === "7d") {
    const { start: winStart } = getCurrentPeriodBounds("7d", now);
    const out = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(winStart, i);
      const s = startOfDay(day);
      const e = endOfDay(day);
      if (s > endOfDay(now)) break;
      out.push(pick(bucketTotals(txs, s, e)));
    }
    return out.length ? out : [0];
  }

  if (range === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const out = [];
    for (let d = new Date(start); d <= endOfDay(now); d = addDays(d, 1)) {
      out.push(pick(bucketTotals(txs, startOfDay(d), endOfDay(d))));
    }
    return out.length ? out : [0];
  }

  if (range === "30d") {
    const { start: winStart } = getCurrentPeriodBounds("30d", now);
    const out = [];
    for (let i = 0; i < 30; i++) {
      const day = addDays(winStart, i);
      if (day > endOfDay(now)) break;
      out.push(pick(bucketTotals(txs, startOfDay(day), endOfDay(day))));
    }
    return out.length ? out : [0];
  }

  if (range === "3m") {
    const { start: winStart } = getCurrentPeriodBounds("3m", now);
    const out = [];
    let cursor = new Date(winStart.getFullYear(), winStart.getMonth(), winStart.getDate());
    while (cursor <= endOfDay(now)) {
      const wEnd = addDays(cursor, 6);
      const e = wEnd > endOfDay(now) ? endOfDay(now) : endOfDay(wEnd);
      out.push(pick(bucketTotals(txs, startOfDay(cursor), e)));
      cursor = addDays(cursor, 7);
    }
    return out.length ? out : [0];
  }

  if (range === "6m" || range === "1y") {
    const monthsBack = range === "6m" ? 6 : 12;
    const { start: winStart } = getCurrentPeriodBounds(range, now);
    const cap = endOfDay(now);
    const out = [];
    const cur = new Date(winStart.getFullYear(), winStart.getMonth(), 1);
    for (let i = 0; i < monthsBack; i++) {
      const monthStart = new Date(cur.getFullYear(), cur.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = endOfDay(new Date(cur.getFullYear(), cur.getMonth() + 1, 0));
      const effStart = monthStart < winStart ? new Date(winStart) : monthStart;
      const effEnd = monthEnd > cap ? cap : monthEnd;
      if (effStart <= effEnd) {
        out.push(pick(bucketTotals(txs, startOfDay(effStart), effEnd)));
      }
      cur.setMonth(cur.getMonth() + 1);
      if (monthStart > cap) break;
    }
    return out.length ? out : [0];
  }

  if (range === "overall") {
    const dated = txs.map((t) => ({ t, d: parseTxDate(t) })).filter((x) => x.d);
    if (!dated.length) return [0];
    let minT = dated[0].d;
    let maxT = dated[0].d;
    dated.forEach(({ d }) => {
      if (d < minT) minT = d;
      if (d > maxT) maxT = d;
    });
    const keys = [];
    const cursor = new Date(minT.getFullYear(), minT.getMonth(), 1);
    const endM = new Date(maxT.getFullYear(), maxT.getMonth(), 1);
    let guard = 0;
    while (cursor <= endM && guard < 36) {
      keys.push(monthKeyFromDate(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
      guard += 1;
    }
    return keys.length ? keys.map((key) => byKeyMonth(txs, key, pick, endOfDay(now))) : [0];
  }

  return [0];
}

function byKeyMonth(txs, key, pickFn, capEnd) {
  const [y, m] = key.split("-").map(Number);
  const s = new Date(y, m - 1, 1, 0, 0, 0, 0);
  const e = endOfDay(new Date(y, m, 0));
  const effEnd = e > capEnd ? capEnd : e;
  return pickFn(bucketTotals(txs, s, effEnd));
}

/** Latest N transactions by date (for dashboard preview; full list stays on Transactions page). */
export function getRecentTransactions(transactions = [], limit = 5) {
  return [...transactions]
    .filter((t) => parseTxDate(t))
    .sort((a, b) => parseTxDate(b) - parseTxDate(a))
    .slice(0, limit);
}

/**
 * Full stats for summary cards: totals for visible period, comparison %, sparklines.
 * `periodTransactions` should match filterByDateRange(all, range) for main numbers.
 */
export function getTimeRangeStats(periodTransactions, allTransactions, range, now = new Date()) {
  const current = computePeriodTotals(periodTransactions);
  const prevBounds = getPreviousPeriodBounds(range, now);
  let previous = null;
  let comparison = {
    totalBalance: null,
    totalIncome: null,
    totalExpenses: null,
    transactionCount: null,
  };

  if (prevBounds && allTransactions?.length) {
    const prevTxs = filterTransactionsBetween(allTransactions, prevBounds.start, prevBounds.end);
    previous = computePeriodTotals(prevTxs);
    comparison = {
      totalBalance: percentChange(current.totalBalance, previous.totalBalance),
      totalIncome: percentChange(current.totalIncome, previous.totalIncome),
      totalExpenses: percentChange(current.totalExpenses, previous.totalExpenses),
      transactionCount: percentChange(current.transactionCount, previous.transactionCount),
    };
  }

  const sparkBalance = buildSparklineSeries(allTransactions, range, now, "balance");
  const sparkIncome = buildSparklineSeries(allTransactions, range, now, "income");
  const sparkExpenses = buildSparklineSeries(allTransactions, range, now, "expenses");
  const sparkCount = buildSparklineSeries(allTransactions, range, now, "count");

  return {
    current,
    previous,
    comparison,
    comparisonLabel: getComparisonLabel(range),
    trendSubtitle: getTrendSubtitle(range),
    sparklines: {
      totalBalance: sparkBalance,
      totalIncome: sparkIncome,
      totalExpenses: sparkExpenses,
      transactionCount: sparkCount,
    },
  };
}
