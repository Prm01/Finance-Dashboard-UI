import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { calculateAnalytics, formatChartData, calculateSpendingTrend } from '../../utils/analyticsCalculations.js';
import { formatCurrencyNoSign } from '../../utils/formatCurrency.js';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Rent: '#ef4444',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Health: '#10b981',
  Utilities: '#64748b',
  Entertainment: '#8b5cf6',
  Education: '#14b8a6',
  Salary: '#6366f1',
  Freelance: '#10b981',
  Investment: '#3b82f6',
};

export const TransactionsAnalyticsPanel = ({ filteredTransactions = [], totalTransactions = 0 }) => {
  const analytics = useMemo(() => calculateAnalytics(filteredTransactions), [filteredTransactions]);
  const chartData = useMemo(() => formatChartData(filteredTransactions), [filteredTransactions]);
  const trendData = useMemo(() => calculateSpendingTrend(filteredTransactions), [filteredTransactions]);

  if (filteredTransactions.length === 0) {
    return (
      <motion.div
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <TrendingUp size={40} className="text-text-secondary dark:text-text-400 mb-4" />
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-100 mb-2">
            No data for selected filters
          </h3>
          <p className="text-sm text-text-muted dark:text-text-secondary">
            Try adjusting your filters to see analytics
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Analytics for Selected Data
        </h2>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8 p-6">
        {/* Charts Section - Takes 2 columns on desktop */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Bar Chart - Spending by Category */}
          <div className="min-h-80 flex flex-col">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
              Spending by Category
            </h3>
            {chartData.length > 0 ? (
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,0,0,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">
                No spending data
              </div>
            )}
          </div>

          {/* Line Chart - Spending Trend */}
          <div className="min-h-80 flex flex-col">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
              Spending Trend (30 Days)
            </h3>
            {trendData.length > 0 ? (
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,0,0,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="rgba(0,0,0,0.3)"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      dot={false}
                      strokeWidth={2}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      dot={false}
                      strokeWidth={2}
                      name="Expense"
                    />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#3b82f6"
                      dot={false}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Net"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">
                No trend data
              </div>
            )}
          </div>
        </div>

        {/* Stats Section - Takes 1 column */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Summary
          </h3>

          {/* Total Amount */}
          <motion.div
            className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
              Total Amount
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-mono">
              ₹{formatCurrencyNoSign(analytics.totalAmount)}
            </div>
          </motion.div>

          {/* Transaction Count */}
          <motion.div
            className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
              Transactions
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {analytics.transactionCount}
            </div>
            {totalTransactions > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {((analytics.transactionCount / totalTransactions) * 100).toFixed(1)}% of total
              </div>
            )}
          </motion.div>

          {/* Average Transaction */}
          <motion.div
            className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
              Average
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
              ₹{formatCurrencyNoSign(analytics.averageTransaction)}
            </div>
          </motion.div>

          {/* Max & Min */}
          <motion.div
            className="grid grid-cols-2 gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Max</div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                ₹{formatCurrencyNoSign(analytics.maxTransaction)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Min</div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                ₹{formatCurrencyNoSign(analytics.minTransaction)}
              </div>
            </div>
          </motion.div>

          {/* Income/Expense */}
          <motion.div
            className="grid grid-cols-2 gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20">
              <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Income</div>
              <div className="text-sm font-bold text-green-900 dark:text-green-300 font-mono">
                ₹{formatCurrencyNoSign(analytics.totalIncome)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                {analytics.incomeCount} txn
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20">
              <div className="text-xs text-red-700 dark:text-red-400 font-medium mb-1">Expense</div>
              <div className="text-sm font-bold text-red-900 dark:text-red-300 font-mono">
                ₹{formatCurrencyNoSign(analytics.totalExpense)}
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                {analytics.expenseCount} txn
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
