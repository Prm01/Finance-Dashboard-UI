const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const labelForMonth = (d) => {
  const month = new Intl.DateTimeFormat("en-IN", { month: "short" }).format(d);
  const year = d.getFullYear();
  return `${month} ${year}`;
};

const addMonths = (date, delta) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return d;
};

export const getMonthlyTotals = (transactions, count = 6) => {
  const list = Array.isArray(transactions) ? transactions : [];
  if (list.length === 0) return [];

  const parsed = list
    .map((t) => ({ ...t, _dateObj: t.date ? new Date(t.date) : null }))
    .filter((t) => t._dateObj && !Number.isNaN(t._dateObj.getTime()));

  if (parsed.length === 0) return [];

  const maxDate = parsed.reduce((a, b) => (a._dateObj > b._dateObj ? a : b))._dateObj;

  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = addMonths(maxDate, -i);
    months.push({
      key: monthKey(d),
      label: labelForMonth(d),
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
    });
  }

  const map = new Map(months.map((m) => [m.key, { income: 0, expenses: 0 }]));

  parsed.forEach((t) => {
    const d = t._dateObj;
    const key = monthKey(d);
    if (!map.has(key)) return;
    const bucket = map.get(key);
    if (t.type === "income") bucket.income += Number(t.amount || 0);
    if (t.type === "expense") bucket.expenses += Number(t.amount || 0);
  });

  return months.map((m) => {
    const { income, expenses } = map.get(m.key) || { income: 0, expenses: 0 };
    return {
      key: m.key,
      monthLabel: m.label,
      income,
      expenses,
      net: income - expenses,
    };
  });
};

