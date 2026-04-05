/**
 * Demo transactions dated relative to "now" so every time-range pill
 * (Today → 1 Year) shows a realistic slice of activity after a refresh.
 */

const EXPENSE_MIX = [
  { category: "Food", min: 120, max: 2800, desc: ["Groceries", "Coffee & breakfast", "Dining out", "Meal delivery"] },
  { category: "Transport", min: 80, max: 2200, desc: ["Metro pass", "Fuel", "Ride share", "Parking"] },
  { category: "Shopping", min: 350, max: 6500, desc: ["Household items", "Clothing", "Online order", "Electronics accessory"] },
  { category: "Health", min: 400, max: 5500, desc: ["Pharmacy", "Gym", "Checkup copay", "Supplements"] },
  { category: "Utilities", min: 900, max: 4200, desc: ["Electricity", "Internet", "Water bill", "Mobile plan"] },
  { category: "Entertainment", min: 200, max: 3800, desc: ["Streaming", "Movies", "Concert", "Games"] },
  { category: "Education", min: 500, max: 9000, desc: ["Course fee", "Books", "Certification prep", "Workshop"] },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

/** Local calendar date at midday (stable vs UTC when filtering by local day). */
function atLocalDay(base, dayOffset = 0, hour = 12, minute = 0) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayOffset, hour, minute, 0, 0);
  return d;
}

function pushTx(out, seqRef, date, amount, type, category, description) {
  const iso = date.toISOString();
  seqRef.n += 1;
  out.push({
    _id: `mock-${seqRef.n}`,
    date: iso,
    amount,
    type,
    category,
    description,
    createdAt: iso,
  });
}

function addExpenseOnDay(out, seq, dayDate, templateIndex) {
  const t = EXPENSE_MIX[templateIndex % EXPENSE_MIX.length];
  const amount = randInt(t.min, t.max);
  pushTx(out, seq, dayDate, amount, "expense", t.category, pick(t.desc));
}

/**
 * @returns {Array<object>} transactions sorted newest first
 */
export function getMockTransactions() {
  const now = new Date();
  const seq = { n: 0 };
  const out = [];

  // —— Today: several line items so "Today" is never empty
  const todayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  pushTx(out, seq, atLocalDay(todayBase, 0, 8, 10), 185, "expense", "Food", "Coffee & breakfast");
  pushTx(out, seq, atLocalDay(todayBase, 0, 11, 40), 420, "expense", "Transport", "Ride to meeting");
  pushTx(out, seq, atLocalDay(todayBase, 0, 13, 25), 265, "expense", "Food", "Lunch with team");
  pushTx(out, seq, atLocalDay(todayBase, 0, 16, 5), 1299, "expense", "Shopping", "Desk accessory");
  pushTx(out, seq, atLocalDay(todayBase, 0, 18, 50), 3500, "income", "Freelance", "Invoice partial payment");
  pushTx(out, seq, atLocalDay(todayBase, 0, 19, 15), 680, "expense", "Entertainment", "Streaming annual proration");

  // —— Last 7 days (excluding some overlap with today): 2–3 per day
  for (let daysAgo = 1; daysAgo <= 6; daysAgo++) {
    const d0 = atLocalDay(now, -daysAgo, 9, 20);
    addExpenseOnDay(out, seq, d0, daysAgo);
    const d1 = atLocalDay(now, -daysAgo, 14, 35);
    addExpenseOnDay(out, seq, d1, daysAgo + 3);
    if (daysAgo % 2 === 0) {
      const d2 = atLocalDay(now, -daysAgo, 19, 10);
      addExpenseOnDay(out, seq, d2, daysAgo + 5);
    }
  }

  // —— Rest of current month (older than ~7d): fill a few days
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  for (let daysAgo = 8; daysAgo <= 28; daysAgo++) {
    const candidate = atLocalDay(now, -daysAgo);
    if (candidate < startOfMonth) break;
    if (daysAgo % 3 === 0) {
      addExpenseOnDay(out, seq, atLocalDay(now, -daysAgo, 11, 15), daysAgo + 1);
      addExpenseOnDay(out, seq, atLocalDay(now, -daysAgo, 17, 40), daysAgo + 2);
    }
  }

  // —— Rolling 12 calendar months: salary, rent, plus scattered expenses
  for (let mo = 0; mo < 12; mo++) {
    const ref = new Date(now.getFullYear(), now.getMonth() - mo, 1);
    const y = ref.getFullYear();
    const m = ref.getMonth();
    const lastDom = mo === 0 ? now.getDate() : new Date(y, m + 1, 0).getDate();

    const salaryDay = Math.min(3, lastDom);
    const rentDay = Math.min(5, lastDom);
    pushTx(
      out,
      seq,
      new Date(y, m, salaryDay, 10, 10, 0, 0),
      45000,
      "income",
      "Salary",
      mo === 0 ? "Monthly salary" : `Monthly salary (${ref.toLocaleString("en-US", { month: "short" })})`
    );
    pushTx(out, seq, new Date(y, m, rentDay, 12, 30, 0, 0), 12000, "expense", "Rent", "Rent payment");

    const extras = mo === 0 ? 10 : mo <= 2 ? 9 : 7;
    for (let k = 0; k < extras; k++) {
      const day = randInt(6, lastDom);
      const hr = randInt(8, 21);
      const min = randInt(0, 59);
      const dt = new Date(y, m, day, hr, min, 0, 0);
      if (mo === 0 && dt > now) continue;
      if (day === salaryDay && hr < 12) continue;
      addExpenseOnDay(out, seq, dt, k + mo * 7);
    }

    if (mo === 2) {
      pushTx(out, seq, new Date(y, m, Math.min(18, lastDom), 11, 30, 0, 0), 18000, "income", "Freelance", "Project milestone");
    }
    if (mo === 4) {
      pushTx(out, seq, new Date(y, m, Math.min(22, lastDom), 9, 0, 0, 0), 8500, "income", "Investment", "Dividend payout");
    }
  }

  out.sort((a, b) => new Date(b.date) - new Date(a.date));
  return out;
}

/** Snapshot at module load; prefer `getMockTransactions()` when loading demo fallback. */
export const mockTransactions = getMockTransactions();
