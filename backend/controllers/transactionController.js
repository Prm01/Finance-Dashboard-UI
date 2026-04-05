const Transaction = require("../models/Transaction");

const parseSort = (sortBy, sortOrder) => {
  const safeSortBy = sortBy === "amount" ? "amount" : "date";
  const safeSortOrder = sortOrder === "asc" ? 1 : -1;
  return { safeSortBy, safeSortOrder };
};

const normalizeDate = (d) => {
  if (d === undefined || d === null) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const normalizeAmount = (v) => {
  if (v === undefined || v === null) return NaN;
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return n;
};

const listTransactions = async (req, res, next) => {
  try {
    const {
      type = "all",
      category = "all",
      search = "",
      sortBy = "date",
      sortOrder = "desc",
      startDate,
      endDate,
    } = req.query;

    const match = {};

    if (type && type !== "all") {
      match.type = type;
    }

    if (category && category !== "all") {
      match.category = category;
    }

    if (search && typeof search === "string") {
      match.description = { $regex: search, $options: "i" };
    }

    const start = startDate ? normalizeDate(startDate) : null;
    const end = endDate ? normalizeDate(endDate) : null;

    if (start || end) {
      match.date = {};
      if (start) match.date.$gte = start;
      if (end) {
        // Make endDate inclusive by moving to end of day.
        const inclusiveEnd = new Date(end);
        inclusiveEnd.setHours(23, 59, 59, 999);
        match.date.$lte = inclusiveEnd;
      }
    }

    const { safeSortBy, safeSortOrder } = parseSort(sortBy, sortOrder);

    const transactions = await Transaction.find(match)
      .sort({ [safeSortBy]: safeSortOrder })
      .lean();

    res.json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    console.log("[createTransaction] req.body:", JSON.stringify(req.body));

    const { date, amount, type, category, description } = req.body;

    const parsedDate = normalizeDate(date);
    if (!parsedDate) {
      console.warn("[createTransaction] invalid or missing date");
      return res.status(400).json({
        success: false,
        message: "Invalid or missing date",
      });
    }

    const parsedAmount = normalizeAmount(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      console.warn("[createTransaction] invalid amount:", amount);
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const newTransaction = await Transaction.create({
      date: parsedDate,
      amount: parsedAmount,
      type,
      category,
      description: description != null ? String(description).trim() : "",
    });

    console.log("[createTransaction] saved:", newTransaction._id.toString());

    res.status(201).json({
      success: true,
      data: newTransaction,
    });
  } catch (err) {
    console.error("[createTransaction] error:", err.message);
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    console.log("[updateTransaction] id:", req.params.id, "body:", JSON.stringify(req.body));

    const { id } = req.params;
    const { date, amount, type, category, description } = req.body;

    const parsedDate = normalizeDate(date);
    if (!parsedDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing date",
      });
    }

    const parsedAmount = normalizeAmount(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        date: parsedDate,
        amount: parsedAmount,
        type,
        category,
        description: description != null ? String(description).trim() : "",
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      console.warn("[updateTransaction] not found:", id);
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    console.log("[updateTransaction] saved:", updated._id.toString());

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("[updateTransaction] error:", err.message);
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      message: "Transaction deleted",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const summaryArr = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          transactionCount: { $sum: 1 },
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpenses: 1,
          totalBalance: { $subtract: ["$totalIncome", "$totalExpenses"] },
          transactionCount: 1,
        },
      },
    ]);

    const summary = summaryArr[0] || {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: 0,
    };

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};

