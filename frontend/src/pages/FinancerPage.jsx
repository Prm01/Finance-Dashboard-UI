import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, ListChecks, Sparkles } from "lucide-react";
import { useAppContext } from "../hooks/useTransactions.js";

export const FinancerPage = () => {
  const { state, summary } = useAppContext();
  const username = state.user?.username || "Guest";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/50">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200/70 bg-white dark:border-white/10 dark:bg-slate-950/90 shadow-sm shadow-slate-900/5 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                <Sparkles size={14} /> Financer
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                Your finance companion is ready.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Financer helps you explore spending trends, identify savings opportunities, and keep your budget on track.
                Use the assistant or jump straight into your dashboard, transactions and insights.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
                <p className="mt-3 text-lg font-semibold">{username}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Your personal insights are waiting.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current balance</p>
                <p className="mt-3 text-lg font-semibold">₹{summary?.totalBalance?.toLocaleString()}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Balances update as transactions sync.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link
              to="/"
              className="group rounded-3xl border border-gray-200/70 bg-white p-6 text-left shadow-sm transition hover:border-teal-400/40 hover:shadow-md dark:border-white/10 dark:bg-slate-950/80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-sm">
                <BarChart3 size={20} />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">View dashboard</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">See your spending trends, balances, and the latest financial highlights.</p>
            </Link>
            <Link
              to="/transactions"
              className="group rounded-3xl border border-gray-200/70 bg-white p-6 text-left shadow-sm transition hover:border-teal-400/40 hover:shadow-md dark:border-white/10 dark:bg-slate-950/80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-sm">
                <ListChecks size={20} />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">Review transactions</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Inspect every entry, spot patterns, and keep your cashflow visible.</p>
            </Link>
            <Link
              to="/insights"
              className="group rounded-3xl border border-gray-200/70 bg-white p-6 text-left shadow-sm transition hover:border-teal-400/40 hover:shadow-md dark:border-white/10 dark:bg-slate-950/80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-sm">
                <Sparkles size={20} />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">Explore insights</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Quickly find opportunities, recurring trends, and performance signals.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
