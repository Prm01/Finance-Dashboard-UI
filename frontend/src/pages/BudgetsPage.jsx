import React, { useMemo } from "react";
import { useAppContext } from "../hooks/useTransactions.js";
import { getBudgetSummary, getTopOverspendingCategories } from "../utils/budgetProgressUtils.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import { ShieldCheck, TrendingUp, Wallet } from "lucide-react";

export const BudgetsPage = () => {
  const { state } = useAppContext();
  const { transactions } = state;

  const budgetSummary = useMemo(() => getBudgetSummary(transactions), [transactions]);
  const overspending = useMemo(() => getTopOverspendingCategories(transactions), [transactions]);
  const statusColor = budgetSummary.status === "over" ? "text-rose-600" : budgetSummary.status === "near" ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/50">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200/70 bg-white dark:border-white/10 dark:bg-slate-950/90 shadow-sm shadow-slate-900/5 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <Wallet size={14} /> Budgets
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">Keep spending within your plan.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Your budget view helps you compare income, planned spend, and actual expenses, so you can act before categories start to drift.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Budget health</p>
              <p className={`mt-3 text-lg font-semibold ${statusColor}`}>{budgetSummary.status === "over" ? "Over budget" : budgetSummary.status === "near" ? "Near budget" : "On track"}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{budgetSummary.message.split("\n")[0]}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {[
              { label: "Income", value: budgetSummary.totalIncome, icon: ShieldCheck },
              { label: "Planned spend", value: budgetSummary.plannedSpend, icon: TrendingUp },
              { label: "Actual spend", value: budgetSummary.actualSpend, icon: Wallet },
              { label: "Remaining", value: budgetSummary.remaining, icon: ShieldCheck },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-3xl border border-gray-200/70 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(value)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-950">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Budget summary</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-line">{budgetSummary.message}</p>
            </div>
            <div className="rounded-3xl border border-gray-200/70 bg-white p-6 dark:border-white/10 dark:bg-slate-950">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Trend signal</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{overspending}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
