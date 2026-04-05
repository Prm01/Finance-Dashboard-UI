const express = require("express");
const {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", listTransactions);
router.post("/", createTransaction);

// Must be before /:id routes to avoid "summary" being treated as an ID
router.get("/summary", getSummary);

router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;

