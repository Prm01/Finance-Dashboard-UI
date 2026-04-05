const mongoose = require("mongoose");

const EXPENSE_CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Health",
  "Utilities",
  "Entertainment",
  "Education",
];

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment"];

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const TransactionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return typeof v === "number" && v > 0;
        },
        message: "Amount must be a number greater than 0",
      },
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      enum: ALL_CATEGORIES,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
  },
  { timestamps: true }
);

// Ensure date precision is consistent for querying.
TransactionSchema.index({ date: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);

