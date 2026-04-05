import React from "react";
import { Modal } from "../shared/Modal.jsx";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../constants/index.js";

const toDateInputValue = (d) => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCategoriesForType = (type) => {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
};

export const TransactionForm = ({
  open,
  mode = "create",
  initialTransaction = null,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = React.useState({
    date: "",
    amount: "",
    type: "expense",
    category: "Food",
    description: "",
  });

  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    if (!initialTransaction) {
      setForm({
        date: toDateInputValue(new Date()),
        amount: "",
        type: "expense",
        category: "Food",
        description: "",
      });
      setErrors({});
      return;
    }

    setForm({
      date: toDateInputValue(initialTransaction.date),
      amount: String(initialTransaction.amount ?? ""),
      type: initialTransaction.type ?? "expense",
      category: initialTransaction.category ?? (initialTransaction.type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
      description: initialTransaction.description ?? "",
    });
    setErrors({});
  }, [open, initialTransaction]);

  const categories = getCategoriesForType(form.type);

  React.useEffect(() => {
    if (!open) return;
    if (!categories.includes(form.category)) {
      setForm((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [form.type]); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = () => {
    const nextErrors = {};
    if (!form.date) nextErrors.date = "Date is required.";
    if (!form.description || !String(form.description).trim()) nextErrors.description = "Description is required.";
    if (!form.type) nextErrors.type = "Type is required.";
    if (!form.category) nextErrors.category = "Category is required.";
    const amount = Number(form.amount);
    if (!Number.isFinite(amount)) nextErrors.amount = "Amount must be a valid number.";
    else if (amount <= 0) nextErrors.amount = "Amount must be greater than 0.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        date: new Date(form.date),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        description: String(form.description).trim(),
      };
      console.log("[TransactionForm] submit", mode, {
        ...payload,
        date: payload.date.toISOString(),
      });
      await onSubmit?.(payload);
      onClose?.();
    } catch (err) {
      console.error("[TransactionForm] submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Add Transaction" : "Edit Transaction"}
      onClose={() => {
        if (!submitting) onClose?.();
      }}
      widthClassName="max-w-lg"
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Date
            </div>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            {errors.date ? <div className="mt-1 text-xs text-rose-600">{errors.date}</div> : null}
          </label>

          <label className="block">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Amount
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              placeholder="e.g. 2500"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            {errors.amount ? <div className="mt-1 text-xs text-rose-600">{errors.amount}</div> : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Type
            </div>
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {errors.type ? <div className="mt-1 text-xs text-rose-600">{errors.type}</div> : null}
          </label>

          <label className="block">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Category
            </div>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category ? <div className="mt-1 text-xs text-rose-600">{errors.category}</div> : null}
          </label>
        </div>

        <label className="block">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Description
          </div>
          <input
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="e.g. Rent for April"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          {errors.description ? (
            <div className="mt-1 text-xs text-rose-600">{errors.description}</div>
          ) : null}
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => !submitting && onClose?.()}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            disabled={submitting}
          >
            Close
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Saving..." : mode === "create" ? "Add Transaction" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

