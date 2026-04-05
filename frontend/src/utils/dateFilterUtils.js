/**
 * Date filtering utilities for time-based analytics
 */

/** Preset keys used across dashboard + Financer context */
export const DATE_RANGES = {
  TODAY: "today",
  WEEK: "7d",
  THIS_MONTH: "this_month",
  MONTH: "30d",
  QUARTER: "3m",
  HALF_YEAR: "6m",
  YEAR: "1y",
  OVERALL: "overall",
};

/** Human-readable labels for every preset (incl. Financer / assistant) */
export const DATE_RANGE_LABELS = {
  today: "Today",
  "7d": "Last 7 days",
  this_month: "This month",
  "30d": "Last 30 days",
  "3m": "3 Months",
  "6m": "6 Months",
  "1y": "1 Year",
  overall: "Overall",
};

/**
 * Ordered options for the dashboard time-range control (short → long).
 * Default selection in UI is `1y` (1 Year).
 */
export const TIME_RANGE_OPTIONS = [
  { value: "today", label: DATE_RANGE_LABELS.today },
  { value: "7d", label: DATE_RANGE_LABELS["7d"] },
  { value: "this_month", label: DATE_RANGE_LABELS.this_month },
  { value: "30d", label: DATE_RANGE_LABELS["30d"] },
  { value: "3m", label: DATE_RANGE_LABELS["3m"] },
  { value: "6m", label: DATE_RANGE_LABELS["6m"] },
  { value: "1y", label: DATE_RANGE_LABELS["1y"] },
  { value: "overall", label: DATE_RANGE_LABELS.overall },
];

/**
 * Calculate start date based on range (local calendar where relevant)
 */
export const getStartDate = (range) => {
  const now = new Date();
  let startDate = new Date();

  if (range === "overall") {
    startDate.setFullYear(now.getFullYear() - 100);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  switch (range) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate.setHours(0, 0, 0, 0);
      return startDate;
    }
    case "this_month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      return startDate;
    }
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "3m":
      startDate.setMonth(now.getMonth() - 3);
      break;
    case "6m":
      startDate.setMonth(now.getMonth() - 6);
      break;
    case "1y":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setFullYear(now.getFullYear() - 1);
  }

  startDate.setHours(0, 0, 0, 0);
  return startDate;
};

/**
 * Filter transactions by date range (inclusive start, inclusive end-of-today)
 */
export const filterByDateRange = (transactions = [], range = "1y") => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  if (range === "overall") {
    return [...transactions];
  }

  const startDate = getStartDate(range);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return transactions.filter((t) => {
    if (!t.date) return false;
    const txDate = new Date(t.date);
    if (Number.isNaN(txDate.getTime())) return false;
    return txDate >= startDate && txDate <= end;
  });
};

export const filterByCategory = (transactions = [], category = null) => {
  if (!category) return transactions;
  return transactions.filter((t) => t.category === category);
};

export const filterByType = (transactions = [], type = null) => {
  if (!type) return transactions;
  return transactions.filter((t) => t.type === type);
};

export const filterBySearch = (transactions = [], query = "") => {
  if (!query.trim()) return transactions;
  const lowercaseQuery = query.toLowerCase();
  return transactions.filter(
    (t) =>
      (t.description && t.description.toLowerCase().includes(lowercaseQuery)) ||
      (t.category && t.category.toLowerCase().includes(lowercaseQuery))
  );
};

export const applyAllFilters = (transactions = [], filters = {}) => {
  let filtered = [...transactions];

  if (filters.dateRange) {
    filtered = filterByDateRange(filtered, filters.dateRange);
  }

  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category);
  }

  if (filters.type) {
    filtered = filterByType(filtered, filters.type);
  }

  if (filters.search) {
    filtered = filterBySearch(filtered, filters.search);
  }

  return filtered;
};

/**
 * Inclusive bounds from HTML date inputs (YYYY-MM-DD), local calendar day.
 */
export function filterByCustomDateRange(transactions = [], startDateStr, endDateStr) {
  const s = startDateStr != null ? String(startDateStr).trim() : "";
  const e = endDateStr != null ? String(endDateStr).trim() : "";
  if (!s && !e) return transactions;

  let start = null;
  let end = null;
  if (s) {
    start = new Date(`${s}T00:00:00`);
    if (Number.isNaN(start.getTime())) start = null;
  }
  if (e) {
    end = new Date(`${e}T23:59:59.999`);
    if (Number.isNaN(end.getTime())) end = null;
  }

  return transactions.filter((t) => {
    const d = t?.date ? new Date(t.date) : null;
    if (!d || Number.isNaN(d.getTime())) return false;
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  });
}

export const formatDateRange = (range) => {
  return DATE_RANGE_LABELS[range] || DATE_RANGE_LABELS["1y"];
};
