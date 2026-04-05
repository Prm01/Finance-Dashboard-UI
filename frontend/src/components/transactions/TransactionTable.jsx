import React from "react";
import { motion } from "framer-motion";
import { PencilLine, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { EmptyState } from "../shared/EmptyState.jsx";
import { formatCurrencyNoSign } from "../../utils/formatCurrency.js";
import { ROWS_PER_PAGE_OPTIONS } from "../../constants/index.js";

const CATEGORY_COLORS = {
  Food: "#14b8a6",
  Rent: "#22c55e",
  Transport: "#06b6d4",
  Shopping: "#14b8a6",
  Health: "#22c55e",
  Utilities: "#06b6d4",
  Entertainment: "#14b8a6",
  Education: "#22c55e",
  Salary: "#22c55e",
  Freelance: "#22c55e",
  Investment: "#14b8a6",
};

const formatDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

function SortHeader({
  label,
  field,
  align = "left",
  sortField,
  sortDirection,
  onSort,
}) {
  const active = sortField === field;
  return (
    <th
      aria-sort={active ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
      className={[
        "sticky top-0 z-[3] border-b-2 border-teal-500/15 bg-gradient-to-r from-teal-500/[0.08] to-teal-500/[0.04] backdrop-blur-md",
        align === "right" ? "text-right" : "text-left",
        active ? "ring-1 ring-inset ring-teal-500/25" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={[
          "group inline-flex w-full items-center gap-1.5 px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider transition-colors",
          align === "right" ? "justify-end" : "justify-start",
          active
            ? "text-teal-600 dark:text-teal-300"
            : "text-gray-500 opacity-70 hover:opacity-100 dark:text-gray-400",
        ].join(" ")}
      >
        <span>{label}</span>
        <span
          className={[
            "inline-flex shrink-0 flex-col leading-none",
            active ? "opacity-100" : "opacity-0 group-hover:opacity-50",
          ].join(" ")}
          aria-hidden
        >
          {active && sortDirection === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" strokeWidth={2.5} />
          ) : active && sortDirection === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" strokeWidth={2.5} />
          ) : (
            <span className="flex flex-col text-gray-400 dark:text-gray-500">
              <ArrowUp className="h-3 w-3 -mb-1" strokeWidth={2} />
              <ArrowDown className="h-3 w-3" strokeWidth={2} />
            </span>
          )}
        </span>
      </button>
    </th>
  );
}

/**
 * @param {object} props
 * @param {Array} props.transactions — current page rows only
 * @param {number} props.totalFilteredCount — after filters + before pagination
 * @param {number} props.currentPage
 * @param {number} props.totalPages
 * @param {function} props.onPageChange
 * @param {number} props.rowsPerPage
 * @param {function} props.onRowsPerPageChange
 * @param {string} props.sortField
 * @param {'asc'|'desc'} props.sortDirection
 * @param {function} props.onSortHeaderClick — (field: string) => void
 */
export const TransactionTable = ({
  transactions,
  totalFilteredCount,
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  sortField,
  sortDirection,
  onSortHeaderClick,
  role,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const pageRows = Array.isArray(transactions) ? transactions : [];
  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = totalFilteredCount === 0 ? 0 : (clampedPage - 1) * rowsPerPage + 1;
  const endIdx = totalFilteredCount === 0 ? 0 : Math.min(clampedPage * rowsPerPage, totalFilteredCount);

  if (totalFilteredCount === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description="Try changing filters or clearing the search."
      />
    );
  }

  return (
    <div className="card-ai overflow-hidden rounded-lg border border-white/5 bg-card-900">
      <div className="flex flex-col gap-3 border-b border-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-extrabold tracking-wide text-gray-100">
            Transactions
          </div>
          <div className="mt-1 text-xs font-semibold text-gray-400">
            Showing {startIdx}–{endIdx} of {totalFilteredCount} results
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span className="whitespace-nowrap text-gray-300">Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="rounded-xl border border-teal-500/20 bg-gray-950/70 px-3 py-2 text-sm font-medium text-gray-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          >
            {ROWS_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n} className="bg-gray-900 text-gray-200">
                {n}
              </option>
            ))}
          </select>
          <span className="whitespace-nowrap text-gray-300">entries</span>
        </label>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {pageRows.map((t) => {
          const isIncome = t.type === "income";
          return (
            <div key={t._id || t.id} className="rounded-3xl border border-white/10 bg-white/95 dark:bg-card-900/90 p-4 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.description || "Untitled transaction"}</div>
                  <div className="mt-1 text-xs text-text-muted dark:text-text-secondary">{formatDate(t.date)} • {t.category}</div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${isIncome ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
                    {isIncome ? "Income" : "Expense"}
                  </div>
                  <div className={`mt-2 text-lg font-semibold ${isIncome ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>
                    {isIncome ? "+" : "-"}{formatCurrencyNoSign(t.amount)}
                  </div>
                </div>
              </div>
              {role === "admin" ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(t);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-200 transition-all duration-200 hover:bg-teal-500/20"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(t._id);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition-all duration-200 hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto hidden md:block">
        <table className="w-full min-w-[680px] border-separate border-spacing-0">
          <thead>
            <tr>
              <SortHeader
                label="Date"
                field="date"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSortHeaderClick}
              />
              <SortHeader
                label="Description"
                field="description"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSortHeaderClick}
              />
              <SortHeader
                label="Category"
                field="category"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSortHeaderClick}
              />
              <th className="sticky top-0 z-[3] border-b-2 border-teal-500/15 bg-gradient-to-r from-teal-500/[0.08] to-teal-500/[0.04] px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-gray-500 opacity-70 backdrop-blur-md dark:text-gray-400">
                Type
              </th>
              <SortHeader
                label="Amount"
                field="amount"
                align="right"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSortHeaderClick}
              />
              {role === "admin" ? (
                <th className="sticky top-0 z-[3] border-b-2 border-teal-500/15 bg-gradient-to-r from-teal-500/[0.08] to-teal-500/[0.04] px-5 py-3.5 text-right text-[11px] font-extrabold uppercase tracking-wider text-gray-500 opacity-70 backdrop-blur-md dark:text-gray-400">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((t, rowIndex) => {
              const isIncome = t.type === "income";
              const catColor = CATEGORY_COLORS[t.category] || "#9d4edd";
              const amountColor = isIncome ? "#22c55e" : "#ff68d7";
              const textShadow = isDark
                ? isIncome
                  ? "0 0 12px rgba(34, 197, 94, 0.45)"
                  : "0 0 12px rgba(255, 104, 215, 0.45)"
                : "none";

              return (
                <motion.tr
                  key={t._id || t.id}
                  style={{
                    borderBottom: "1px solid rgba(20, 184, 166, 0.08)",
                    borderLeft: "3px solid transparent",
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(rowIndex * 0.05, 0.3) }}
                  whileHover={{
                    backgroundColor: "rgba(20, 184, 166, 0.10)",
                    borderLeftColor: "#14b8a6",
                    transition: { duration: 0.15 },
                  }}
                  onClick={() => onRowClick?.(t)}
                  className="transition-all"
                >
                  <td className="px-5 py-3.5 font-mono text-[13px] text-gray-700 dark:text-gray-400">{formatDate(t.date)}</td>
                  <td className="max-w-[220px] px-5 py-3.5 text-[13px] font-medium text-gray-900 dark:text-gray-100">
                    <span className="block truncate">{t.description}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        background: `${catColor}18`,
                        color: catColor,
                        border: `1px solid ${catColor}30`,
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold ${isIncome ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20" : "bg-rose-500/10 text-rose-300 border border-rose-400/20"}`}
                    >
                      {isIncome ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`amount-mono text-[14px] font-extrabold ${isIncome ? "text-emerald-300" : "text-rose-300"}`}>
                      {isIncome ? "+" : "-"}
                      {formatCurrencyNoSign(t.amount)}
                    </span>
                  </td>
                  {role === "admin" ? (
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(t);
                          }}
                          className="rounded-lg border border-teal-500/20 bg-teal-500/10 p-2 text-teal-400 transition-all duration-200 hover:bg-teal-500/20"
                          aria-label="Edit"
                        >
                          <PencilLine size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(t._id);
                          }}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition-all duration-200 hover:bg-red-500/20"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  ) : null}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-semibold text-gray-300">
          Page <span className="text-gray-100">{clampedPage}</span> of <span className="text-gray-100">{totalPages}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(clampedPage - 1)}
            disabled={clampedPage <= 1}
            className="rounded-xl border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-sm font-medium text-gray-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-teal-500/20"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onPageChange(clampedPage + 1)}
            disabled={clampedPage >= totalPages}
            className="rounded-xl border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-sm font-medium text-gray-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-teal-500/20"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
