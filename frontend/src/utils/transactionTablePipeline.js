/**
 * Transactions page: filter → sort → paginate (order matters).
 */
import { applyAllFilters, filterByCustomDateRange } from "./dateFilterUtils.js";

/** Apply search, type, category, and optional from/to date bounds (inclusive). */
export function getFilteredTransactions(transactions = [], filters = {}) {
  const filterConfig = {
    category: filters.category && filters.category !== "all" ? filters.category : null,
    type: filters.type && filters.type !== "all" ? filters.type : null,
    search: filters.search || "",
  };
  let list = applyAllFilters(transactions, filterConfig);
  list = filterByCustomDateRange(list, filters.startDate, filters.endDate);
  return list;
}

const txDateMs = (t) => {
  const d = t?.date ? new Date(t.date) : null;
  if (!d || Number.isNaN(d.getTime())) return 0;
  return d.getTime();
};

/** @param {string} sortField — date | amount | description | category */
export function getSortedTransactions(transactions = [], sortField = "date", sortDirection = "desc") {
  const list = [...transactions];
  const dir = sortDirection === "asc" ? 1 : -1;

  list.sort((a, b) => {
    switch (sortField) {
      case "amount": {
        const na = Number(a.amount) || 0;
        const nb = Number(b.amount) || 0;
        if (na === nb) return txDateMs(b) - txDateMs(a);
        return na < nb ? -dir : na > nb ? dir : 0;
      }
      case "description": {
        const sa = String(a.description || "").toLowerCase();
        const sb = String(b.description || "").toLowerCase();
        const c = sa.localeCompare(sb);
        if (c !== 0) return c * dir;
        return txDateMs(b) - txDateMs(a);
      }
      case "category": {
        const sa = String(a.category || "").toLowerCase();
        const sb = String(b.category || "").toLowerCase();
        const c = sa.localeCompare(sb);
        if (c !== 0) return c * dir;
        return txDateMs(b) - txDateMs(a);
      }
      case "date":
      default: {
        const diff = txDateMs(a) - txDateMs(b);
        return diff * dir;
      }
    }
  });

  return list;
}

export function getPaginatedTransactions(transactions = [], page = 1, rowsPerPage = 5) {
  const totalCount = transactions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = transactions.slice(start, start + rowsPerPage);
  return { pageRows, totalCount, totalPages, safePage };
}
