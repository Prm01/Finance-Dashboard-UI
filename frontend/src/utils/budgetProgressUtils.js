/**
 * Budget progress for the dashboard: compares period spending to income-based budgets.
 * Provides human-readable summaries and breakdowns.
 */
import { formatCurrencyNoSign } from "./formatCurrency.js";

const BUDGET_PERCENTAGES = {
  Rent: 0.40,        // 40% of income
  Food: 0.15,        // 15% of income
  Transport: 0.10,   // 10% of income
  Shopping: 0.10,    // 10% of income
  Entertainment: 0.10, // 10% of income
  Utilities: 0.05,   // 5% of income
};

/**
 * Calculate total income from transactions
 */
function calculateTotalIncome(transactions = []) {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Generate dynamic budgets based on income
 */
function generateBudgets(totalIncome) {
  const budgets = {};
  Object.entries(BUDGET_PERCENTAGES).forEach(([category, percentage]) => {
    budgets[category] = Math.round(totalIncome * percentage);
  });
  return budgets;
}

function statusForPercent(pct) {
  if (pct > 100) return "over";
  if (pct >= 80) return "near";
  return "ok";
}

/**
 * Generate human-like budget message based on usage percentage
 */
export function getBudgetMessage(totalSpent, totalBudgeted, formatMoney) {
  const pct = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  const remaining = Math.max(0, totalBudgeted - totalSpent);
  const overBy = Math.max(0, totalSpent - totalBudgeted);

  if (pct < 80) {
    return {
      message: `You're doing well this month 👍\nYou've spent ${formatMoney(totalSpent)} so far, which is comfortably within your income-based budget of ${formatMoney(totalBudgeted)}.\nYou still have plenty of room left.`,
      status: "ok"
    };
  } else if (pct <= 100) {
    return {
      message: `You're getting close to your budget ⚠️\nYou've used most of your income-based budget of ${formatMoney(totalBudgeted)}.\nTry to limit spending for the remaining days.`,
      status: "near"
    };
  } else {
    return {
      message: `You're over your budget this month ⚠️\nYou've spent ${formatMoney(totalSpent)} against your income-based budget of ${formatMoney(totalBudgeted)}.\nConsider reviewing your recent expenses.`,
      status: "over"
    };
  }
}

/**
 * Get a human-readable budget summary
 */
export function getBudgetSummary(transactions = []) {
  const totalIncome = calculateTotalIncome(transactions);
  const budgets = generateBudgets(totalIncome);

  const expenses = (transactions || []).filter((t) => t.type === "expense");
  const byCategory = {};
  expenses.forEach((t) => {
    const cat = t.category || "Other";
    byCategory[cat] = (byCategory[cat] || 0) + Number(t.amount || 0);
  });

  const totalBudgeted = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  const totalSpent = Object.values(byCategory).reduce((sum, spent) => sum + spent, 0);

  const formatMoney = (n) => formatCurrencyNoSign(n);
  const messageData = getBudgetMessage(totalSpent, totalBudgeted, formatMoney);

  return {
    totalIncome,
    plannedSpend: totalBudgeted,
    actualSpend: totalSpent,
    remaining: Math.max(0, totalBudgeted - totalSpent),
    overBy: Math.max(0, totalSpent - totalBudgeted),
    message: messageData.message,
    status: messageData.status,
  };
}

/**
 * Get budget status
 */
export function getBudgetStatus(totalSpent, totalBudgeted) {
  const pct = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  return statusForPercent(pct);
}

/**
 * Get top overspending categories
 */
export function getTopOverspendingCategories(transactions = []) {
  const totalIncome = calculateTotalIncome(transactions);
  const budgets = generateBudgets(totalIncome);

  const expenses = (transactions || []).filter((t) => t.type === "expense");
  const byCategory = {};
  expenses.forEach((t) => {
    const cat = t.category || "Other";
    byCategory[cat] = (byCategory[cat] || 0) + Number(t.amount || 0);
  });

  const overspending = Object.entries(budgets)
    .map(([category, budget]) => ({
      category,
      spent: byCategory[category] || 0,
      overBy: Math.max(0, (byCategory[category] || 0) - budget),
    }))
    .filter(item => item.overBy > 0)
    .sort((a, b) => b.overBy - a.overBy);

  if (overspending.length === 0) {
    return "You are within budget for all categories.";
  }

  const top = overspending.slice(0, 2).map(item => item.category);
  return `Most overspending comes from ${top.join(" and ")}.`;
}

/**
 * Get category budget breakdown
 */
export function getCategoryBudgetBreakdown(transactions = []) {
  const totalIncome = calculateTotalIncome(transactions);
  const budgets = generateBudgets(totalIncome);

  const expenses = (transactions || []).filter((t) => t.type === "expense");
  const byCategory = {};
  expenses.forEach((t) => {
    const cat = t.category || "Other";
    byCategory[cat] = (byCategory[cat] || 0) + Number(t.amount || 0);
  });

  return Object.entries(budgets).map(([category, budget]) => {
    const spent = byCategory[category] || 0;
    const overBy = spent - budget;
    const isOver = overBy > 0;
    const pct = budget > 0 ? (spent / budget) * 100 : 0;
    const status = statusForPercent(pct);
    const differenceText = isOver ? `Over by ${formatCurrencyNoSign(overBy)}` : `Under by ${formatCurrencyNoSign(Math.abs(overBy))}`;

    return {
      category,
      spent,
      budget,
      status,
      differenceText,
      isOver,
    };
  }).sort((a, b) => b.spent - a.spent); // Sort by spent descending
}

/** @param {Array} transactions — already scoped to dashboard time range */
export function getBudgetProgressData(transactions = []) {
  const summary = getBudgetSummary(transactions);
  const insight = getTopOverspendingCategories(transactions);
  const rows = getCategoryBudgetBreakdown(transactions);

  return {
    summary,
    insight,
    rows,
    formatMoney: (n) => formatCurrencyNoSign(n),
  };
}
