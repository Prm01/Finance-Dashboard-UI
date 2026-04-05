import React, { useState, useMemo, useEffect } from "react";
import { useAppContext } from "../hooks/useTransactions.js";
import { SummaryCards } from "../components/dashboard/SummaryCards.jsx";
import { IncomeExpenseTrendChart } from "../components/dashboard/IncomeExpenseTrendChart.jsx";
import { BalanceTrendChart } from "../components/dashboard/BalanceTrendChart.jsx";
import { SpendingPieChart } from "../components/dashboard/SpendingPieChart.jsx";
import { RecentTransactionsExpanded } from "../components/dashboard/RecentTransactionsExpanded.jsx";
import { FinancialHealthCard } from "../components/dashboard/FinancialHealthCard.jsx";
import { BudgetProgressHorizontal } from "../components/dashboard/BudgetProgressHorizontal.jsx";
import { FinanceCard } from "../components/dashboard/FinanceCard.jsx";
import { MarketStatusCard } from "../components/dashboard/MarketStatusCard.jsx";
import { TimeRangeFilter } from "../components/shared/TimeRangeFilter.jsx";
import { EmptyState } from "../components/shared/EmptyState.jsx";
import { InlineAlert } from "../components/shared/InlineAlert.jsx";
import { SummaryCardsSkeleton, ChartSkeleton } from "../components/shared/LoadingSkeleton.jsx";
import { motion } from "framer-motion";
import { filterByDateRange } from "../utils/dateFilterUtils.js";

export const DashboardPage = () => {
  const { state, setAssistantDashboardRange, summary } = useAppContext();
  const { loading, error, notice, transactions } = state;
  const [selectedDateRange, setSelectedDateRange] = useState("1y");

  useEffect(() => {
    setAssistantDashboardRange(selectedDateRange);
    return () => setAssistantDashboardRange(null);
  }, [selectedDateRange, setAssistantDashboardRange]);

  // Filter transactions based on selected date range
  const filteredTransactions = useMemo(() => {
    return filterByDateRange(transactions, selectedDateRange);
  }, [transactions, selectedDateRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950/50">
      {/* Load State */}
      {loading ? (
        <div className="space-y-6 px-4 py-8 sm:px-6 md:px-8">
          <SummaryCardsSkeleton />
        </div>
      ) : error ? (
        <div className="px-4 py-8 sm:px-6 md:px-8">
          <EmptyState
            title="Unable to load your dashboard"
            description={error}
            action={null}
          />
        </div>
      ) : null}

      {/* Notice Alert - Sticky at top */}
      {!loading && notice ? (
        <div className="z-40 px-4 py-3 sm:px-6 md:px-8 bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
          <InlineAlert
            kind="info"
            title="Demo mode"
            message={notice}
          />
        </div>
      ) : null}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 lg:py-8 space-y-8">
        {/* Time Range Filter */}
        {!loading && !error ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TimeRangeFilter
              selectedRange={selectedDateRange}
              onRangeChange={setSelectedDateRange}
            />
          </motion.div>
        ) : null}

        {/* HERO SECTION - Prominent Summary */}
        {!loading && !error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-br from-teal-600/10 via-blue-600/5 to-transparent dark:from-teal-500/20 dark:via-blue-500/10 dark:to-transparent rounded-2xl border border-teal-200/30 dark:border-teal-800/30 p-6 md:p-8 shadow-sm"
          >
            <SummaryCards
              transactions={filteredTransactions}
              allTransactions={transactions}
              selectedRange={selectedDateRange}
            />
          </motion.div>
        ) : null}

        {/* Main Content Layout - Asymmetric */}
        {!loading && !error ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* MAIN COLUMN (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Chart - Income vs Expenses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-5 md:p-6 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                          Financial Overview
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Income vs expenses trend
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                        Last 6 months
                      </div>
                    </div>
                  </div>
                  <div className="h-[380px] md:h-[420px]">
                    <IncomeExpenseTrendChart transactions={filteredTransactions} />
                  </div>
                </div>
              </motion.div>

              {/* Secondary Grid - Spending & Transactions */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Spending Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="p-5 border-b border-gray-100 dark:border-white/5">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Spending by Category
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Where your money goes
                      </p>
                    </div>
                    <div className="flex-1 h-[300px]">
                      <SpendingPieChart transactions={filteredTransactions} />
                    </div>
                  </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col p-5">
                    <RecentTransactionsExpanded transactions={transactions} />
                  </div>
                </motion.div>
              </div>

              {/* Budget Status - Horizontal at bottom of main column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 md:p-6"
              >
                <BudgetProgressHorizontal transactions={filteredTransactions} />
              </motion.div>
            </div>

            {/* SIDEBAR (1/3) - Lighter, Secondary Content */}
            <div className="space-y-6">
              {/* Market Status Card */}
              <MarketStatusCard />

              {/* Finance Card - Admin Only */}
              {state.role === "admin" && (
                <FinanceCard balance={summary?.totalBalance || 0} />
              )}

              {/* Financial Health - Primary Insight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900/50 dark:to-gray-900/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5"
              >
                <FinancialHealthCard transactions={filteredTransactions} />
              </motion.div>

              {/* Balance Trend - Secondary Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-5 border-b border-gray-100 dark:border-white/5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Balance History
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Last 6 months
                    </p>
                  </div>
                  <div className="h-[320px]">
                    <BalanceTrendChart transactions={filteredTransactions} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

