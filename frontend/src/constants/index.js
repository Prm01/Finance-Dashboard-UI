export const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment"];
export const EXPENSE_CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Health",
  "Utilities",
  "Entertainment",
  "Education",
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export const SORT_BY_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "amount", label: "Amount" },
];

export const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "Asc" },
  { value: "desc", label: "Desc" },
];

/** Transactions table page size */
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

