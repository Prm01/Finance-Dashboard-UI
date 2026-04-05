export function getBudgetSummary(totalSpent, totalBudget) {
  const difference = totalSpent - totalBudget;
  const isOverBudget = difference > 0;

  return {
    totalSpent,
    totalBudget,
    difference,
    isOverBudget,
  };
}