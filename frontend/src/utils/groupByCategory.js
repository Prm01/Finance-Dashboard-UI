export const groupByCategory = (transactions, onlyType = null) => {
  const list = Array.isArray(transactions) ? transactions : [];

  return list.reduce((acc, t) => {
    if (!t) return acc;
    if (onlyType && t.type !== onlyType) return acc;
    const key = t.category;
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + Number(t.amount || 0);
    return acc;
  }, {});
};

export const toSortedCategoryTotals = (totals, order = "desc") => {
  const entries = Object.entries(totals || {});
  entries.sort((a, b) => {
    const diff = Number(b[1]) - Number(a[1]);
    return order === "asc" ? -diff : diff;
  });
  return entries;
};

