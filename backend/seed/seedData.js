const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const connectDB = require("../config/db");

const randInt = (min, max) =>
  Math.floor(min + Math.random() * (max - min + 1));

const pick = (arr) => arr[randInt(0, arr.length - 1)];

const makeDateInMonth = (year, monthIndex, maxDay) => {
  const last = maxDay ?? new Date(year, monthIndex + 1, 0).getDate();
  const day = randInt(1, last);
  return new Date(year, monthIndex, day, randInt(0, 23), randInt(0, 59), 0);
};

const INCOME = [
  {
    category: "Salary",
    type: "income",
    description: "Monthly salary",
    makeAmount: () => 45000,
  },
  {
    category: "Freelance",
    type: "income",
    description: "Freelance project payment",
    makeAmount: () => randInt(15000, 50000),
  },
  {
    category: "Investment",
    type: "income",
    description: "Investment dividend/returns",
    makeAmount: () => randInt(5000, 30000),
  },
];

const EXPENSES = [
  { category: "Food", type: "expense", makeAmount: () => randInt(800, 2500) },
  { category: "Rent", type: "expense", makeAmount: () => 12000 },
  { category: "Transport", type: "expense", makeAmount: () => randInt(1000, 5000) },
  { category: "Shopping", type: "expense", makeAmount: () => randInt(1200, 8000) },
  { category: "Health", type: "expense", makeAmount: () => randInt(1500, 9000) },
  { category: "Utilities", type: "expense", makeAmount: () => randInt(1000, 5000) },
  { category: "Entertainment", type: "expense", makeAmount: () => randInt(1000, 7000) },
  { category: "Education", type: "expense", makeAmount: () => randInt(1000, 6000) },
];

const categoryDescription = {
  Food: () => pick(["Groceries", "Dining out", "Weekly groceries", "Food & essentials", "Restaurant meal"]),
  Rent: () => pick(["Apartment rent", "House rent", "Monthly rent"]),
  Transport: () => pick(["Metro & local travel", "Fuel & commute", "Ride-hailing", "Public transport"]),
  Shopping: () => pick(["Clothing & accessories", "Online shopping", "Household items", "Shopping spree"]),
  Health: () => pick(["Medical checkup", "Pharmacy & supplements", "Hospital visit", "Health expenses"]),
  Utilities: () => pick(["Electricity & water", "Internet bill", "Utility payments", "Maintenance charges"]),
  Entertainment: () => pick(["Movies & events", "Gaming subscriptions", "Concert tickets", "Weekend fun"]),
  Education: () => pick(["Course fees", "Books & materials", "Online learning", "Coaching expense"]),
  Salary: () => "Monthly salary",
  Freelance: () => "Freelance project payment",
  Investment: () => "Investment dividend/returns",
};

/** Rolling window from "now" so seeded DB matches dashboard time filters (today → 1y). */
const makeTransactionsForSeed = () => {
  const now = new Date();
  const txs = [];

  const requiredCategories = [
    "Salary",
    "Freelance",
    "Investment",
    "Food",
    "Rent",
    "Transport",
    "Shopping",
    "Health",
    "Utilities",
    "Entertainment",
    "Education",
  ];

  // One transaction per category in the last 12 months (spread by month index).
  requiredCategories.forEach((cat, idx) => {
    const ref = new Date(now.getFullYear(), now.getMonth() - (idx % 12), 1);
    const y = ref.getFullYear();
    const mi = ref.getMonth();
    const lastDom = new Date(y, mi + 1, 0).getDate();
    const isIncome = INCOME.some((x) => x.category === cat);
    const incomeDef = INCOME.find((x) => x.category === cat);
    const expenseDef = EXPENSES.find((x) => x.category === cat);
    const type = isIncome ? "income" : "expense";
    const amount = isIncome ? incomeDef.makeAmount() : expenseDef.makeAmount();
    const descFn = categoryDescription[cat] || (() => `${cat} expense`);
    txs.push({
      date: makeDateInMonth(y, mi, lastDom),
      amount,
      type,
      category: cat,
      description: descFn(),
    });
  });

  // Today + prior 6 days: extra activity for "Today" / "Last 7 days" demos.
  for (let d = 0; d < 7; d++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d);
    const count = d === 0 ? 5 : randInt(2, 4);
    for (let i = 0; i < count; i++) {
      const def = Math.random() < 0.12 ? pick(INCOME) : pick(EXPENSES);
      const descFn = categoryDescription[def.category] || (() => `${def.category} transaction`);
      txs.push({
        date: new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          randInt(8, 21),
          randInt(0, 59),
          0
        ),
        amount: def.makeAmount(),
        type: def.type,
        category: def.category,
        description: descFn(),
      });
    }
  }

  // Each of the last 12 months: salary + rent + random mix (respect current month max day).
  for (let mo = 0; mo < 12; mo++) {
    const ref = new Date(now.getFullYear(), now.getMonth() - mo, 1);
    const y = ref.getFullYear();
    const mi = ref.getMonth();
    const lastDom = mo === 0 ? now.getDate() : new Date(y, mi + 1, 0).getDate();

    txs.push({
      date: new Date(y, mi, Math.min(3, lastDom), 10, 10, 0),
      amount: 45000,
      type: "income",
      category: "Salary",
      description: "Monthly salary",
    });
    txs.push({
      date: new Date(y, mi, Math.min(5, lastDom), 12, 30, 0),
      amount: 12000,
      type: "expense",
      category: "Rent",
      description: pick(["Apartment rent", "House rent", "Monthly rent"]),
    });

    const extra = mo <= 2 ? 8 : 6;
    for (let k = 0; k < extra; k++) {
      const isIncome = Math.random() < 0.28;
      const def = isIncome ? pick(INCOME) : pick(EXPENSES);
      const dt = makeDateInMonth(y, mi, lastDom);
      if (mo === 0 && dt > now) continue;
      const descFn = categoryDescription[def.category] || (() => `${def.category} transaction`);
      txs.push({
        date: dt,
        amount: def.makeAmount(),
        type: def.type,
        category: def.category,
        description: descFn(),
      });
    }
  }

  return txs;
};

const runSeed = async () => {
  await connectDB(process.env.MONGODB_URI);
  await Transaction.deleteMany({});

  const transactions = makeTransactionsForSeed();
  await Transaction.insertMany(transactions);

  // eslint-disable-next-line no-console
  console.log(`Seeded ${transactions.length} transactions (rolling 12 months + recent week).`);

  await mongoose.connection.close();
};

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", err.message);
    process.exit(1);
  });
