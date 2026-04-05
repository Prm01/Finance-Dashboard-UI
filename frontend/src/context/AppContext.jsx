import React, { createContext, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  fetchTransactions,
  createTransaction as apiPostTransaction,
  updateTransaction as apiPutTransaction,
  deleteTransaction as apiDeleteTransaction,
  fetchSummary,
} from "../api/transactionsApi";
import { getMockTransactions } from "../constants/mockTransactions.js";

export const AppContext = createContext(null);

const defaultFilters = {
  search: "",
  type: "all",
  category: "all",
  startDate: "",
  endDate: "",
};

const initialState = {
  transactions: [],
  loading: false,
  error: null,
  notice: null,
  isAuthenticated: false,
  user: null, // { username, role, displayName, avatarUrl }
  role: "viewer", // derived from user.role after login (kept for existing UI checks)
  filters: defaultFilters,
  activePage: "dashboard",
  sidebarVisible: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_NOTICE":
      return { ...state, notice: action.payload };
    case "LOGIN": {
      const user = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
        role: user?.role || "viewer",
      };
    }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        role: "viewer",
      };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          String(t._id || t.id) === String(action.payload._id || action.payload.id)
            ? action.payload
            : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (t) => String(t._id || t.id) !== String(action.payload)
        ),
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_PAGE":
      return { ...state, activePage: action.payload };
    case "SET_SIDEBAR_VISIBLE":
      return { ...state, sidebarVisible: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarVisible: !state.sidebarVisible };
    default:
      return state;
  }
};

const STORAGE_KEYS = {
  auth: "fd_auth",
  users: "fd_users",
  filters: "fd_filters",
  sidebar: "fd_sidebar_visible",
};

const coerceRole = (v) => (v === "admin" ? "admin" : "viewer");
const coerceBoolean = (v) => String(v) === "true";
const coerceAuth = (raw) => {
  const parsed = safeParseJSON(raw);
  if (!parsed || !parsed.user) return { isAuthenticated: false, user: null };
  const role = coerceRole(parsed.user.role);
  const username = String(parsed.user.username || "").trim();
  if (!username) return { isAuthenticated: false, user: null };
  return {
    isAuthenticated: true,
    user: {
      username,
      role,
      displayName: String(parsed.user.displayName || username).trim(),
      avatarUrl: parsed.user.avatarUrl || null,
    },
  };
};

const safeParseJSON = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const auth = coerceAuth(localStorage.getItem(STORAGE_KEYS.auth));
    const storedFilters = safeParseJSON(localStorage.getItem(STORAGE_KEYS.filters));
    const merged =
      storedFilters && typeof storedFilters === "object"
        ? { ...init.filters, ...storedFilters }
        : init.filters;
    const { sortBy: _sb, sortOrder: _so, ...rest } = merged;
    const storedSidebar = localStorage.getItem(STORAGE_KEYS.sidebar);
    return {
      ...init,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      role: auth.user?.role || "viewer",
      filters: { ...init.filters, ...rest },
      sidebarVisible: storedSidebar === null ? true : coerceBoolean(storedSidebar),
    };
  });

  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    transactionCount: 0,
  });

  const [toasts, setToasts] = useState([]);

  /** Synced from Dashboard time-range so the assistant can interpret “summarise this”. */
  const [assistantDashboardRange, setAssistantDashboardRange] = useState(null);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ type = "success", title = "Done", message = "" }) => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const toast = { id, type, title, message };
      setToasts((prev) => [toast, ...prev].slice(0, 4));
      setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast]
  );

  const friendlyError = useCallback((err) => {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong while communicating with the server.";

    // Detect network/CORS/offline scenarios (axios usually has no response in these cases).
    if (!err?.response) {
      return "Unable to connect to the backend. Please check your network and backend service URL.";
    }
    return msg;
  }, []);

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err) {
      // Summary errors are non-fatal for other pages.
      setSummary({
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        transactionCount: 0,
      });
    }
  }, []);

  const loadTransactions = useCallback(
    async (filtersOverride) => {
      const filtersToUse = filtersOverride || state.filters;
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_NOTICE", payload: null });

      try {
        const data = await fetchTransactions(filtersToUse);
        if (Array.isArray(data) && data.length === 0) {
          dispatch({ type: "SET_TRANSACTIONS", payload: getMockTransactions() });
          dispatch({
            type: "SET_NOTICE",
            payload:
              "You're viewing demo data. Sign in as Admin and add your first transaction to see real magic -- data.",
          });
        } else {
          dispatch({ type: "SET_TRANSACTIONS", payload: data });
        }
      } catch (err) {
        const msg = friendlyError(err);
        const shouldUseMock = !err?.response;
        if (shouldUseMock) {
          dispatch({ type: "SET_TRANSACTIONS", payload: getMockTransactions() });
          dispatch({
            type: "SET_NOTICE",
            payload: "You're viewing demo data. Sign in as Admin and add your first transaction to see real magic -- data.",
          });
        } else {
          dispatch({ type: "SET_TRANSACTIONS", payload: [] });
          dispatch({ type: "SET_ERROR", payload: msg });
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [friendlyError, state.filters]
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.auth,
      JSON.stringify({ isAuthenticated: state.isAuthenticated, user: state.user })
    );
  }, [state.isAuthenticated, state.user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(state.filters));
  }, [state.filters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sidebar, String(state.sidebarVisible));
  }, [state.sidebarVisible]);

  useEffect(() => {
    // Everyone (including guests) can browse the dashboard; load data on mount.
    loadSummary();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadTransactions();
  }, [state.filters, loadTransactions]);

  // Demo login (frontend-only) for Admin and Viewer.
  const ensureDefaultUsers = useCallback(() => {
    const existing = safeParseJSON(localStorage.getItem(STORAGE_KEYS.users));
    if (Array.isArray(existing) && existing.length > 0) return existing;
    const defaults = [
      { username: "admin", password: "admin123", role: "admin", displayName: "Administrator", avatarUrl: null },
      { username: "viewer", password: "viewer123", role: "viewer", displayName: "Finance Viewer", avatarUrl: null },
    ];
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(defaults));
    return defaults;
  }, []);

  const getUsers = useCallback(() => {
    const list = safeParseJSON(localStorage.getItem(STORAGE_KEYS.users));
    if (Array.isArray(list)) return list;
    return ensureDefaultUsers();
  }, [ensureDefaultUsers]);

  const login = useCallback(
    async (username, password) => {
      const u = String(username || "").trim().toLowerCase();
      const p = String(password || "");
      const users = getUsers();
      const match = users.find((a) => a.username === u && a.password === p);
      if (!match) throw new Error("Invalid username or password.");
      dispatch({
        type: "LOGIN",
        payload: {
          username: match.username,
          role: match.role,
          displayName: String(match.displayName || match.username).trim(),
          avatarUrl: match.avatarUrl || null,
        },
      });
    },
    [getUsers]
  );

  const signup = useCallback(
    async (username, password, role) => {
      const u = String(username || "").trim().toLowerCase();
      const p = String(password || "");
      const r = role === "admin" ? "admin" : "viewer";
      if (!u) throw new Error("Username is required.");
      if (!/^[a-z0-9_]{3,20}$/.test(u)) {
        throw new Error("Username must be 3–20 chars: a-z, 0-9, underscore.");
      }
      if (!p || p.length < 6) throw new Error("Password must be at least 6 characters.");

      const users = getUsers();
      if (users.some((x) => x.username === u)) {
        throw new Error("This username is already registered. Please sign in.");
      }

      const next = [
        ...users,
        {
          username: u,
          password: p,
          role: r,
          displayName: u,
          avatarUrl: null,
        },
      ];
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(next));
      return true;
    },
    [getUsers]
  );

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_NOTICE", payload: null });
    // Keep browsing after logout — refresh data for guest view
    loadSummary();
    loadTransactions();
  }, [loadSummary, loadTransactions]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }, [dispatch]);

  const updateUserProfile = useCallback(
    async (updates) => {
      if (!state.user?.username) return;
      dispatch({ type: "UPDATE_USER", payload: updates });

      const mergedUser = { ...state.user, ...updates };
      const authPayload = { isAuthenticated: true, user: mergedUser };
      localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(authPayload));

      const users = getUsers().map((user) =>
        user.username === state.user.username ? { ...user, ...updates } : user
      );
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));

      pushToast({ type: "success", title: "Profile updated", message: "Your profile details are now saved." });
      return mergedUser;
    },
    [getUsers, pushToast, state.user]
  );

  const txId = (t) => String(t?._id ?? t?.id ?? "");

  const handleCreate = useCallback(
    async (data) => {
      try {
        console.log("[AppContext] handleCreate payload:", data);
        const created = await apiPostTransaction(data);
        if (!created) {
          throw new Error("Server returned no transaction data.");
        }
        await loadSummary();

        // Refetch with current filters, then merge if the new row is excluded (e.g. category filter).
        let list = [];
        try {
          list = await fetchTransactions(state.filters);
          if (!Array.isArray(list)) list = [];
        } catch (fetchErr) {
          console.warn("[AppContext] handleCreate refetch failed, keeping new row only:", fetchErr);
          dispatch({ type: "SET_TRANSACTIONS", payload: [created] });
          pushToast({
            type: "success",
            title: "Transaction added",
            message: "Saved. Could not refresh the list — reload the page if counts look wrong.",
          });
          return created;
        }

        const cid = txId(created);
        const inList = cid && list.some((t) => txId(t) === cid);
        const nextList = !inList && created ? [created, ...list] : list;
        const filterHint =
          !inList && created
            ? "Saved. It’s shown above even though it doesn’t match your current filters."
            : "Saved successfully.";

        dispatch({ type: "SET_TRANSACTIONS", payload: nextList });
        pushToast({ type: "success", title: "Transaction added", message: filterHint });
        return created;
      } catch (err) {
        console.error("[AppContext] handleCreate failed:", err);
        pushToast({
          type: "error",
          title: "Could not add transaction",
          message: friendlyError(err),
        });
        throw err;
      }
    },
    [apiPostTransaction, dispatch, fetchTransactions, friendlyError, loadSummary, pushToast, state.filters]
  );

  const handleUpdate = useCallback(
    async (id, data) => {
      try {
        console.log("[AppContext] handleUpdate", id, data);
        const updated = await apiPutTransaction(id, data);
        if (!updated) {
          throw new Error("Server returned no transaction data.");
        }
        await loadSummary();

        let list = [];
        try {
          list = await fetchTransactions(state.filters);
          if (!Array.isArray(list)) list = [];
        } catch (fetchErr) {
          console.warn("[AppContext] handleUpdate refetch failed:", fetchErr);
          dispatch({ type: "UPDATE_TRANSACTION", payload: updated });
          pushToast({
            type: "success",
            title: "Transaction updated",
            message: "Saved. Could not refresh the full list.",
          });
          return updated;
        }

        const uid = txId(updated);
        const inList = list.some((t) => txId(t) === uid);
        const nextList = inList
          ? list
          : [updated, ...list.filter((t) => txId(t) !== uid)];

        dispatch({ type: "SET_TRANSACTIONS", payload: nextList });
        pushToast({
          type: "success",
          title: "Transaction updated",
          message: inList
            ? "Changes saved."
            : "Saved. It’s shown above even though it no longer matches your filters.",
        });
        return updated;
      } catch (err) {
        console.error("[AppContext] handleUpdate failed:", err);
        pushToast({
          type: "error",
          title: "Could not update transaction",
          message: friendlyError(err),
        });
        throw err;
      }
    },
    [apiPutTransaction, dispatch, fetchTransactions, friendlyError, loadSummary, pushToast, state.filters]
  );

  const handleDelete = useCallback(
    async (id) => {
      await apiDeleteTransaction(id);
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
      pushToast({ type: "success", title: "Transaction deleted", message: "Removed successfully." });

      await loadSummary();
      await loadTransactions();
    },
    [apiDeleteTransaction, dispatch, loadSummary, loadTransactions, pushToast]
  );

  const value = useMemo(
    () => ({
      state,
      summary,
      toasts,
      pushToast,
      dismissToast,
      dispatch,
      login,
      signup,
      logout,
      loadSummary,
      loadTransactions,
      createTransaction: handleCreate,
      updateTransaction: handleUpdate,
      deleteTransaction: handleDelete,
      updateUserProfile,
      toggleSidebar,
      assistantDashboardRange,
      setAssistantDashboardRange,
    }),
    [
      state,
      summary,
      toasts,
      pushToast,
      dismissToast,
      loadSummary,
      loadTransactions,
      login,
      signup,
      logout,
      handleCreate,
      handleUpdate,
      handleDelete,
      updateUserProfile,
      toggleSidebar,
      assistantDashboardRange,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

