import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
});

const buildQueryParams = (filters) => {
  if (!filters) return {};
  const params = {};

  if (filters.type && filters.type !== "all") params.type = filters.type;
  if (filters.category && filters.category !== "all") params.category = filters.category;
  if (filters.search && String(filters.search).trim().length > 0) params.search = String(filters.search).trim();

  // Server default sort (date desc); client Transactions table re-sorts as needed.

  // Optional date range support (not part of base filters shape).
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  return params;
};

export const fetchTransactions = async (filters) => {
  const res = await client.get("/transactions", { params: buildQueryParams(filters) });
  return res.data.data || [];
};

const serializeTransactionBody = (data) => {
  const rawDate = data.date instanceof Date ? data.date : new Date(data.date);
  if (Number.isNaN(rawDate.getTime())) {
    throw new Error("Invalid transaction date");
  }
  const amount = typeof data.amount === "string" ? parseFloat(data.amount) : Number(data.amount);
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid transaction amount");
  }
  return {
    type: data.type,
    category: data.category,
    description: data.description,
    amount,
    date: rawDate.toISOString(),
  };
};

export const createTransaction = async (data) => {
  const body = serializeTransactionBody(data);
  const url = `${client.defaults.baseURL}/transactions`;
  console.log("[transactionsApi] POST", url, body);
  const res = await client.post("/transactions", body);
  console.log("[transactionsApi] POST ok", res.status, res.data?.data?._id);
  return res.data.data;
};

export const updateTransaction = async (id, data) => {
  const body = serializeTransactionBody(data);
  const url = `${client.defaults.baseURL}/transactions/${id}`;
  console.log("[transactionsApi] PUT", url, body);
  const res = await client.put(`/transactions/${id}`, body);
  console.log("[transactionsApi] PUT ok", res.status);
  return res.data.data;
};

export const deleteTransaction = async (id) => {
  const res = await client.delete(`/transactions/${id}`);
  return res.data;
};

export const fetchSummary = async () => {
  const res = await client.get("/transactions/summary");
  return res.data.data || { totalBalance: 0, totalIncome: 0, totalExpenses: 0, transactionCount: 0 };
};

