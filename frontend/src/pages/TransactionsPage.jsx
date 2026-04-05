import React, { useMemo, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../hooks/useTransactions.js";
import { FilterBar } from "../components/transactions/FilterBar.jsx";
import { TransactionTable } from "../components/transactions/TransactionTable.jsx";
import { TransactionsAnalyticsPanel } from "../components/transactions/TransactionsAnalyticsPanel.jsx";
import { TransactionForm } from "../components/transactions/TransactionForm.jsx";
import { ConfirmDialog } from "../components/shared/ConfirmDialog.jsx";
import { EmptyState } from "../components/shared/EmptyState.jsx";
import { InlineAlert } from "../components/shared/InlineAlert.jsx";
import { TableSkeleton } from "../components/shared/LoadingSkeleton.jsx";
import { Drawer } from "../components/shared/Drawer.jsx";
import { Download } from "lucide-react";
import { Badge } from "../components/shared/Badge.jsx";
import { formatCurrencyNoSign } from "../utils/formatCurrency.js";
import {
  getFilteredTransactions,
  getSortedTransactions,
  getPaginatedTransactions,
} from "../utils/transactionTablePipeline.js";

export const TransactionsPage = () => {
  const { state, createTransaction, updateTransaction, deleteTransaction } = useAppContext();
  const { loading, error, notice, transactions, role, isAuthenticated, filters } = state;
  const isAdmin = isAuthenticated && role === "admin";

  // 1) Filter → 2) Sort (table headers) → 3) Paginate
  const filteredTransactions = useMemo(
    () => getFilteredTransactions(transactions, filters),
    [transactions, filters]
  );

  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.type, filters.category, filters.startDate, filters.endDate]);

  const sortedTransactions = useMemo(
    () => getSortedTransactions(filteredTransactions, sortField, sortDirection),
    [filteredTransactions, sortField, sortDirection]
  );

  const { pageRows, totalCount, totalPages, safePage } = useMemo(
    () => getPaginatedTransactions(sortedTransactions, currentPage, rowsPerPage),
    [sortedTransactions, currentPage, rowsPerPage]
  );

  useEffect(() => {
    if (safePage !== currentPage) setCurrentPage(safePage);
  }, [safePage, currentPage]);

  const handleSortHeaderClick = (field) => {
    setCurrentPage(1);
    if (sortField !== field) {
      setSortField(field);
      setSortDirection(field === "date" ? "desc" : "asc");
      return;
    }
    if (field === "date") {
      setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
      return;
    }
    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortField("date");
      setSortDirection("desc");
    }
  };

  const handleRowsPerPageChange = (n) => {
    setRowsPerPage(n);
    setCurrentPage(1);
  };

  const exportCsv = () => {
    const txs = Array.isArray(transactions) ? transactions : [];

    const formatDate = (iso) => {
      const d = iso ? new Date(iso) : null;
      if (!d || Number.isNaN(d.getTime())) return "";
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(d);
    };

    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const escape = (val) => {
      const s = val === null || val === undefined ? "" : String(val);
      // CSV escaping: quote if contains comma/quote/newline
      if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const rows = txs.map((t) => {
      const isIncome = t.type === "income";
      const signAmount = `${isIncome ? "+" : "-"}${Number(t.amount || 0).toFixed(2)}`;
      return [
        formatDate(t.date),
        t.description || "",
        t.category || "",
        t.type || "",
        signAmount,
      ];
    });

    const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `transactions_${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState("create");
  const [editingTransaction, setEditingTransaction] = React.useState(null);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedTx, setSelectedTx] = React.useState(null);

  const openCreate = () => {
    setFormMode("create");
    setEditingTransaction(null);
    setFormOpen(true);
  };

  const openEdit = (tx) => {
    setFormMode("edit");
    setEditingTransaction(tx);
    setFormOpen(true);
  };

  const closeForm = () => setFormOpen(false);

  const requestDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setConfirmLoading(true);
    try {
      await deleteTransaction(deleteId);
      setConfirmOpen(false);
    } finally {
      setConfirmLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Manage Transactions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse as a guest, or sign in as Admin to add, edit, or delete.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportCsv}
            disabled={loading || !Array.isArray(transactions) || transactions.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100"
          >
            <Download size={18} />
            Export CSV
          </button>

          {isAdmin ? (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          ) : null}
        </div>
      </div>

      <FilterBar />

      {error ? (
        <EmptyState
          title="Unable to load transactions"
          description={error}
        />
      ) : null}

      {!error && notice ? (
        <InlineAlert kind="info" title="Demo mode" message={notice} />
      ) : null}

      {loading ? (
        <TableSkeleton />
      ) : (
        !error ? (
          <TransactionTable
            transactions={pageRows}
            totalFilteredCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortHeaderClick={handleSortHeaderClick}
            role={isAdmin ? "admin" : "viewer"}
            onEdit={(tx) => openEdit(tx)}
            onDelete={(id) => requestDelete(id)}
            onRowClick={(tx) => {
              setSelectedTx(tx);
              setDrawerOpen(true);
            }}
          />
        ) : null
      )}

      {/* Analytics for filtered data — below the table */}
      {!loading && !error && (
        <TransactionsAnalyticsPanel
          filteredTransactions={filteredTransactions}
          totalTransactions={Array.isArray(transactions) ? transactions.length : 0}
        />
      )}

      {isAdmin ? (
        <>
          <TransactionForm
            open={formOpen}
            mode={formMode}
            initialTransaction={editingTransaction}
            onClose={closeForm}
            onSubmit={async (payload) => {
              if (formMode === "create") {
                await createTransaction(payload);
              } else if (editingTransaction?._id) {
                await updateTransaction(editingTransaction._id, payload);
              }
            }}
          />

          <ConfirmDialog
            open={confirmOpen}
            title="Delete Transaction"
            message="Are you sure you want to delete this transaction?"
            confirmText="Delete"
            cancelText="Cancel"
            danger
            isLoading={confirmLoading}
            onCancel={() => {
              if (!confirmLoading) setConfirmOpen(false);
            }}
            onConfirm={onConfirmDelete}
          />
        </>
      ) : null}

      <Drawer
        open={drawerOpen}
        title="Transaction Details"
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        {!selectedTx ? null : (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Summary</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(selectedTx.date))}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={[
                    "amount-mono font-extrabold",
                    selectedTx.type === "income" ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300",
                  ].join(" ")}
                  style={{ fontSize: 18, textShadow: selectedTx.type === "income" ? "0 0 12px rgba(16,185,129,0.35)" : "0 0 12px rgba(239,68,68,0.35)" }}
                >
                  {selectedTx.type === "income" ? "+" : "-"}
                  {formatCurrencyNoSign(selectedTx.amount)}
                </div>
                <div className="mt-1">
                  {selectedTx.type === "income" ? (
                    <Badge variant="income">Income</Badge>
                  ) : (
                    <Badge variant="expense">Expense</Badge>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Description</div>
              <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100 break-words">{selectedTx.description || "—"}</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Category</div>
                <div className="mt-2">
                  <span
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{
                      borderColor: "rgba(99,102,241,0.20)",
                      background: "rgba(99,102,241,0.06)",
                      color: "#6366f1",
                    }}
                  >
                    {selectedTx.category || "—"}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Transaction ID</div>
                <div className="mt-2 text-sm font-mono text-gray-700 dark:text-gray-200 break-all" style={{ opacity: 0.9 }}>
                  {selectedTx._id || selectedTx.id}
                </div>
              </div>
            </div>

            {isAdmin ? (
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      openEdit(selectedTx);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
                    style={{
                      background: "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.22)",
                      color: "#6366f1",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(selectedTx._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.22)",
                      color: "#ef4444",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                You’re browsing as a guest/viewer. Sign in as Admin to edit transactions.
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

