/**
 * Transaction analytics — single source of truth for Financer (copilot) calculations.
 */
import { filterByDateRange, applyAllFilters } from "../utils/dateFilterUtils.js";
import { EXPENSE_CATEGORIES } from "../constants/index.js";

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

export const monthKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const parseTxDate = (t) => {
  const d = t?.date ? new Date(t.date) : null;
  if (!d || Number.isNaN(d.getTime())) return null;
  return d;
};

export function filterTransactionsByDateWindow(transactions, start, end) {
  const list = Array.isArray(transactions) ? transactions : [];
  return list.filter((t) => {
    const d = parseTxDate(t);
    if (!d) return false;
    if (start && d < startOfDay(start)) return false;
    if (end && d > endOfDay(end)) return false;
    return true;
  });
}

export function getFilteredTransactions(transactions, options = {}) {
  let list = Array.isArray(transactions) ? [...transactions] : [];
  const { start, end, type, categories } = options;

  if (start || end) {
    list = filterTransactionsByDateWindow(list, start || null, end || null);
  }

  if (type === "income" || type === "expense") {
    list = list.filter((t) => t.type === type);
  }

  if (categories && categories.length > 0) {
    const set = new Set(categories);
    list = list.filter((t) => set.has(t.category));
  }

  return list;
}

export function getSummaryStats(transactions) {
  const txs = Array.isArray(transactions) ? transactions : [];
  const n = txs.length;
  if (n === 0) {
    return {
      count: 0,
      totalIncome: 0,
      totalExpenses: 0,
      net: 0,
      avgAmount: 0,
      largest: null,
      smallest: null,
    };
  }

  const amounts = txs.map((t) => Number(t.amount) || 0);
  const totalIncome = txs.filter((t) => t.type === "income").reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalExpenses = txs.filter((t) => t.type === "expense").reduce((s, t) => s + (Number(t.amount) || 0), 0);

  let largest = txs[0];
  let smallest = txs[0];
  for (const t of txs) {
    const a = Number(t.amount) || 0;
    if (a > (Number(largest.amount) || 0)) largest = t;
    if (a < (Number(smallest.amount) || 0)) smallest = t;
  }

  return {
    count: n,
    totalIncome,
    totalExpenses,
    net: totalIncome - totalExpenses,
    avgAmount: amounts.reduce((a, b) => a + b, 0) / n,
    largest,
    smallest,
  };
}

export function getCategoryBreakdown(transactions, onlyExpense = true) {
  const txs = Array.isArray(transactions) ? transactions : [];
  const filtered = onlyExpense ? txs.filter((t) => t.type === "expense") : txs;
  const map = {};
  for (const t of filtered) {
    const c = t.category || "Other";
    map[c] = (map[c] || 0) + (Number(t.amount) || 0);
  }
  return map;
}

export function getTopSpendingCategory(transactions) {
  const breakdown = getCategoryBreakdown(transactions, true);
  const entries = Object.entries(breakdown);
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1]);
  const [category, total] = entries[0];
  const sum = entries.reduce((s, [, v]) => s + v, 0);
  return { category, total, share: sum > 0 ? (total / sum) * 100 : 0, expenseTotal: sum };
}

export function getIncomeExpenseSummary(transactions) {
  const s = getSummaryStats(transactions);
  return {
    income: s.totalIncome,
    expenses: s.totalExpenses,
    net: s.net,
    count: s.count,
  };
}

export function getMonthlyComparison(transactions, refDate = new Date()) {
  const txs = Array.isArray(transactions) ? transactions : [];
  const y = refDate.getFullYear();
  const m = refDate.getMonth();
  const thisStart = new Date(y, m, 1);
  const thisEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
  const prevStart = new Date(y, m - 1, 1);
  const prevEnd = new Date(y, m, 0, 23, 59, 59, 999);

  const sumWindow = (start, end) => {
    let income = 0;
    let expenses = 0;
    for (const t of txs) {
      const d = parseTxDate(t);
      if (!d || d < startOfDay(start) || d > endOfDay(end)) continue;
      const amt = Number(t.amount) || 0;
      if (t.type === "income") income += amt;
      else if (t.type === "expense") expenses += amt;
    }
    return { income, expenses, net: income - expenses };
  };

  const current = sumWindow(thisStart, thisEnd);
  const previous = sumWindow(prevStart, prevEnd);

  return {
    thisMonthLabel: thisStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    prevMonthLabel: prevStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    current,
    previous,
  };
}

export function getLargestTransaction(transactions) {
  const txs = Array.isArray(transactions) ? transactions.filter((t) => t.type === "expense") : [];
  if (!txs.length) return null;
  return txs.reduce((best, t) => ((Number(t.amount) || 0) > (Number(best.amount) || 0) ? t : best), txs[0]);
}

export function detectRecurringExpenses(transactions, minCount = 3) {
  const txs = Array.isArray(transactions) ? transactions.filter((t) => t.type === "expense") : [];
  const byCat = {};
  for (const t of txs) {
    const c = t.category || "Other";
    if (!byCat[c]) byCat[c] = [];
    byCat[c].push(t);
  }
  return Object.entries(byCat)
    .filter(([, arr]) => arr.length >= minCount)
    .map(([category, arr]) => ({
      category,
      count: arr.length,
      total: arr.reduce((s, t) => s + (Number(t.amount) || 0), 0),
    }))
    .sort((a, b) => b.count - a.count);
}

export function detectUnusualSpending(transactions) {
  const expenses = Array.isArray(transactions) ? transactions.filter((t) => t.type === "expense") : [];
  if (expenses.length < 3) return { outliers: [], median: 0 };
  const amounts = expenses.map((t) => Number(t.amount) || 0).sort((a, b) => a - b);
  const mid = Math.floor(amounts.length / 2);
  const median = amounts.length % 2 ? amounts[mid] : (amounts[mid - 1] + amounts[mid]) / 2;
  const threshold = Math.max(median * 2.5, median + 1);
  const outliers = expenses.filter((t) => (Number(t.amount) || 0) >= threshold);
  return { outliers, median };
}

export function getCategoryIncreaseMonthOverMonth(transactions, refDate = new Date()) {
  const txs = Array.isArray(transactions) ? transactions : [];
  const y = refDate.getFullYear();
  const m = refDate.getMonth();
  const thisStart = new Date(y, m, 1);
  const thisEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
  const prevStart = new Date(y, m - 1, 1);
  const prevEnd = new Date(y, m, 0, 23, 59, 59, 999);

  const catSum = (start, end) => {
    const map = {};
    for (const t of txs) {
      if (t.type !== "expense") continue;
      const d = parseTxDate(t);
      if (!d || d < startOfDay(start) || d > endOfDay(end)) continue;
      const c = t.category || "Other";
      map[c] = (map[c] || 0) + (Number(t.amount) || 0);
    }
    return map;
  };

  const cur = catSum(thisStart, thisEnd);
  const prev = catSum(prevStart, prevEnd);
  let best = null;
  let bestPct = -Infinity;
  for (const cat of EXPENSE_CATEGORIES) {
    const a = cur[cat] || 0;
    const b = prev[cat] || 0;
    if (a === 0 && b === 0) continue;
    const pct = b > 0 ? ((a - b) / b) * 100 : a > 0 ? 100 : 0;
    if (pct > bestPct) {
      bestPct = pct;
      best = { category: cat, current: a, previous: b, pct };
    }
  }
  return best;
}

export function computeMonthAveragesByCalendarMonth(transactions) {
  const txs = Array.isArray(transactions) ? transactions : [];
  const bucketMap = new Map();
  for (const t of txs) {
    const d = parseTxDate(t);
    if (!d) continue;
    const key = monthKey(d);
    if (!bucketMap.has(key)) bucketMap.set(key, { income: 0, expenses: 0 });
    const b = bucketMap.get(key);
    const amt = Number(t.amount) || 0;
    if (t.type === "income") b.income += amt;
    if (t.type === "expense") b.expenses += amt;
  }

  const perMonth = Array.from({ length: 12 }, () => ({ count: 0, incomeSum: 0, expenseSum: 0 }));
  for (const [key, tot] of bucketMap.entries()) {
    const monthIndex = Number(key.split("-")[1]) - 1;
    if (monthIndex < 0 || monthIndex > 11) continue;
    perMonth[monthIndex].count += 1;
    perMonth[monthIndex].incomeSum += tot.income;
    perMonth[monthIndex].expenseSum += tot.expenses;
  }

  return perMonth.map((m) => ({
    count: m.count,
    avgIncome: m.count ? m.incomeSum / m.count : 0,
    avgExpenses: m.count ? m.expenseSum / m.count : 0,
  }));
}

export function getNextMonthForecast(transactions, now = new Date()) {
  const avgs = computeMonthAveragesByCalendarMonth(transactions);
  const next = new Date(now);
  next.setMonth(next.getMonth() + 1);
  const idx = next.getMonth();
  const a = avgs[idx] || { avgIncome: 0, avgExpenses: 0 };
  return {
    monthLabel: next.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    income: a.avgIncome,
    expenses: a.avgExpenses,
    net: a.avgIncome - a.avgExpenses,
  };
}

export function getYearForecastFromAverages(transactions, year) {
  const avgs = computeMonthAveragesByCalendarMonth(transactions);
  let totalIncome = 0;
  let totalExpenses = 0;
  for (let i = 0; i < 12; i++) {
    totalIncome += avgs[i]?.avgIncome || 0;
    totalExpenses += avgs[i]?.avgExpenses || 0;
  }
  return { year, totalIncome, totalExpenses, net: totalIncome - totalExpenses };
}

export function applyContextualFilters(transactions, { pathname, filters, dashboardRange }) {
  let list = Array.isArray(transactions) ? transactions : [];
  if (pathname === "/" && dashboardRange) {
    list = filterByDateRange(list, dashboardRange);
  } else if (pathname === "/transactions" || pathname.startsWith("/transactions")) {
    list = applyAllFilters(list, {
      category: filters?.category && filters.category !== "all" ? filters.category : null,
      type: filters?.type && filters.type !== "all" ? filters.type : null,
      search: filters?.search || "",
    });
  }
  return list;
}

export { EXPENSE_CATEGORIES };
