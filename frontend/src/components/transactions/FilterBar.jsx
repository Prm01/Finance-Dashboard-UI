import React from "react";
import { useAppContext } from "../../hooks/useTransactions.js";
import { TYPE_OPTIONS, ALL_CATEGORIES } from "../../constants/index.js";
import { Search, X } from "lucide-react";

export const FilterBar = () => {
  const { state, dispatch } = useAppContext();
  const { filters } = state;

  const [localSearch, setLocalSearch] = React.useState(filters.search);

  React.useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: "SET_FILTERS", payload: { search: localSearch } });
    }, 300);
    return () => clearTimeout(t);
  }, [localSearch, dispatch]);

  const setFilter = (key, value) => {
    dispatch({ type: "SET_FILTERS", payload: { [key]: value } });
  };

  const clearFilters = () => {
    dispatch({
      type: "SET_FILTERS",
      payload: {
        search: "",
        type: "all",
        category: "all",
        startDate: "",
        endDate: "",
      },
    });
  };

  const activeChips = [];
  if (String(filters.search || "").trim()) {
    const q = String(filters.search).trim();
    activeChips.push({
      key: "search",
      label: `Search: ${q.length > 22 ? `${q.slice(0, 22)}…` : q}`,
      onRemove: () => dispatch({ type: "SET_FILTERS", payload: { search: "" } }),
    });
  }
  if (filters.type !== "all") {
    activeChips.push({
      key: "type",
      label: `Type: ${TYPE_OPTIONS.find((x) => x.value === filters.type)?.label || filters.type}`,
      onRemove: () => dispatch({ type: "SET_FILTERS", payload: { type: "all" } }),
    });
  }
  if (filters.category !== "all") {
    activeChips.push({
      key: "category",
      label: `Category: ${filters.category}`,
      onRemove: () => dispatch({ type: "SET_FILTERS", payload: { category: "all" } }),
    });
  }
  if (String(filters.startDate || "").trim()) {
    activeChips.push({
      key: "startDate",
      label: `From: ${filters.startDate}`,
      onRemove: () => dispatch({ type: "SET_FILTERS", payload: { startDate: "" } }),
    });
  }
  if (String(filters.endDate || "").trim()) {
    activeChips.push({
      key: "endDate",
      label: `To: ${filters.endDate}`,
      onRemove: () => dispatch({ type: "SET_FILTERS", payload: { endDate: "" } }),
    });
  }

  return (
    <div className="card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Filters
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Narrow your list, then sort columns in the table below.
          </div>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-indigo-500/15 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-700 transition-all duration-200 hover:bg-indigo-50/60 dark:border-indigo-500/20 dark:bg-[#0d1424]/40 dark:text-indigo-200 dark:hover:bg-indigo-900/20"
        >
          <X size={16} />
          Clear filters
        </button>
      </div>

      {activeChips.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="group inline-flex items-center gap-2 rounded-full border border-indigo-500/15 bg-indigo-500/5 px-3 py-1 text-xs font-semibold text-indigo-700 transition-all duration-200 hover:bg-indigo-500/10 dark:border-indigo-500/20 dark:bg-indigo-400/5 dark:text-indigo-200"
              aria-label={`Remove ${chip.label}`}
            >
              <span className="max-w-[180px] truncate">{chip.label}</span>
              <X size={14} className="text-indigo-500 transition-transform duration-200 group-hover:scale-110" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label className="block sm:col-span-2 xl:col-span-2">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Search
          </div>
          <div className="mt-2 relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="e.g. rent, salary, groceries"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        </label>

        <label className="block">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Type
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilter("type", e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Category
          </div>
          <select
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            From date
          </div>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => setFilter("startDate", e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <label className="block">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            To date
          </div>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => setFilter("endDate", e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>
      </div>
    </div>
  );
};
