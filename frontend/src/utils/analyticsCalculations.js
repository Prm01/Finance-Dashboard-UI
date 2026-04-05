/**
 * Analytics calculations for filtered transaction data
 */

export const calculateAnalytics = (transactions = []) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      totalAmount: 0,
      transactionCount: 0,
      averageTransaction: 0,
      maxTransaction: 0,
      minTransaction: 0,
      incomeCount: 0,
      expenseCount: 0,
      totalIncome: 0,
      totalExpense: 0,
    };
  }

  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const transactionCount = transactions.length;
  const averageTransaction = transactionCount > 0 ? totalAmount / transactionCount : 0;

  const amounts = transactions.map(t => t.amount || 0);
  const maxTransaction = amounts.length > 0 ? Math.max(...amounts) : 0;
  const minTransaction = amounts.length > 0 ? Math.min(...amounts) : 0;

  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return {
    totalAmount,
    transactionCount,
    averageTransaction,
    maxTransaction,
    minTransaction,
    incomeCount,
    expenseCount,
    totalIncome,
    totalExpense,
  };
};

/**
 * Group transactions by category for analytics
 */
export const groupByCategory = (transactions = []) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {};
  }

  return transactions.reduce((acc, t) => {
    const category = t.category || 'Other';
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        count: 0,
        type: t.type,
      };
    }
    acc[category].total += t.amount || 0;
    acc[category].count += 1;
    return acc;
  }, {});
};

/**
 * Format data for chart visualization
 */
export const formatChartData = (transactions = []) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const categoryData = groupByCategory(transactions);

  return Object.entries(categoryData)
    .map(([category, data]) => ({
      name: category,
      value: data.total,
      count: data.count,
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Calculate spending trend over time periods
 */
export const calculateSpendingTrend = (transactions = []) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const grouped = {};

  transactions.forEach(t => {
    const date = t.date ? new Date(t.date) : null;
    if (!date || Number.isNaN(date.getTime())) return;

    const dayKey = date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    if (!grouped[dayKey]) {
      grouped[dayKey] = {
        date: dayKey,
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    if (t.type === 'income') {
      grouped[dayKey].income += t.amount || 0;
    } else {
      grouped[dayKey].expense += t.amount || 0;
    }

    grouped[dayKey].net = grouped[dayKey].income - grouped[dayKey].expense;
  });

  return Object.values(grouped)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30); // Last 30 days
};

/**
 * Get percentage of total
 */
export const getPercentageOfTotal = (amount, total) => {
  if (total === 0) return 0;
  return ((amount / total) * 100).toFixed(1);
};
