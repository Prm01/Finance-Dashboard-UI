/**
 * Intent + entity extraction for the finance copilot (flexible, deterministic).
 */
import { ALL_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../constants/index.js";
import { getStartDate } from "../utils/dateFilterUtils.js";

export const INTENTS = {
  FORECAST: "forecast_projection",
  MONTHLY_COMPARISON: "monthly_comparison",
  RECURRING: "recurring_expenses",
  UNUSUAL: "unusual_spending",
  LARGEST: "largest_transaction",
  TOP_CATEGORY: "top_spending_category",
  OVERSPENDING: "overspending_check",
  SAVINGS: "savings_summary",
  INCOME: "income_summary",
  EXPENSE: "expense_summary",
  CATEGORY: "category_summary",
  TIME: "time_summary",
  OVERALL: "overall_summary",
  STANDS_OUT: "stands_out_insight",
  FALLBACK: "fallback_summary",
};

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const MONTH_SHORT = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export function normalizeQuery(q) {
  return String(q || "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\w\s?₹$%-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map natural phrases to canonical app categories. */
const CATEGORY_ALIAS_GROUPS = [
  { cats: ["Food"], patterns: [/\bfood\b/, /\bmeal\b/, /\bmeals\b/, /\bdining\b/, /\brestaurant\b/, /\bgrocer/, /\bgrocery\b/] },
  { cats: ["Rent"], patterns: [/\brent\b/, /\bhousing\b/, /\bhouse rent\b/, /\blandlord\b/] },
  {
    cats: ["Transport"],
    patterns: [/\btransport\b/, /\btravel\b/, /\bcommute\b/, /\bcab\b/, /\bfuel\b/, /\buber\b/, /\bpetrol\b/, /\bmetro\b/],
  },
  { cats: ["Shopping"], patterns: [/\bshopping\b/, /\bonline shopping\b/, /\bamazon\b/, /\becommerce\b/] },
  { cats: ["Health"], patterns: [/\bhealth\b/, /\bmedical\b/, /\bmedicine\b/, /\bdoctor\b/, /\bhospital\b/, /\bpharma\b/] },
  { cats: ["Entertainment"], patterns: [/\bentertainment\b/, /\bmovie\b/, /\bmovies\b/, /\bott\b/, /\bnetflix\b/, /\bgame\b/] },
  { cats: ["Utilities"], patterns: [/\butilit/, /\belectricity\b/, /\bwater bill\b/, /\bbills?\b/, /\bwifi\b/, /\binternet bill\b/] },
  { cats: ["Education"], patterns: [/\beducation\b/, /\bcourse\b/, /\btuition\b/, /\bschool\b/] },
  { cats: ["Salary"], patterns: [/\bsalary\b/, /\bpaycheck\b/, /\bpay roll\b/, /\bpayroll\b/] },
  { cats: ["Freelance"], patterns: [/\bfreelance\b/, /\bside income\b/, /\bcontract work\b/] },
  { cats: ["Investment"], patterns: [/\binvestment\b/, /\bsip\b/, /\bmutual fund\b/, /\breturns\b/, /\bdividend\b/] },
];

export function extractCategory(normalized) {
  if (!normalized) return null;

  for (const cat of ALL_CATEGORIES) {
    const re = new RegExp(`\\b${cat.toLowerCase()}\\b`, "i");
    if (re.test(normalized)) return cat;
  }

  for (const { cats, patterns } of CATEGORY_ALIAS_GROUPS) {
    for (const p of patterns) {
      if (p.test(normalized)) return cats[0];
    }
  }

  return null;
}

/** income | expense | null (all) */
export function extractType(normalized) {
  if (!normalized) return null;
  if (/\bonly\s+income\b|\bincome only\b|\bshow\s+income\b|\bearn(ed|ing)?\b|\bsalary in\b|\bincome overview\b|\bhow much did i earn\b/.test(normalized))
    return "income";
  if (/\bonly\s+expense\b|\bexpenses only\b|\bshow\s+expense\b|\bspend(ing)?\b(?!\s+on)|\bexpense overview\b|\bwhat are my expenses\b/.test(normalized))
    return "expense";
  if (/\bincome\b/.test(normalized) && !/\bexpense|\bspend/.test(normalized)) return "income";
  if (/\bexpense|\bspent\b/.test(normalized) && !/\bincome|\bearn/.test(normalized)) return "expense";
  return null;
}

function addMonths(d, delta) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + delta);
  return x;
}

/**
 * Returns { start: Date|null, end: Date|null, label: string, preset: string|null }
 * preset matches dateFilterUtils: 'today'|'7d'|'this_month'|'30d'|'3m'|'6m'|'1y' when applicable
 */
export function extractTimeRange(normalized, now = new Date(), dashboardRangeHint = null) {
  const n = normalized || "";
  const today = startOfDay(now);
  const endToday = endOfDay(now);

  const labelFor = (start, end, text) => ({ start, end, label: text, preset: null });

  if (/\ball\s*time\b|\bentire\s*history\b|\beverything\b|\bsince\s*the\s*beginning\b/.test(n) && !/\bthis\b/.test(n)) {
    return { start: null, end: null, label: "all time in your data", preset: null };
  }

  if (/\blast\s*30\s*days\b|\bpast\s*30\s*days\b|\b30\s*day/.test(n)) {
    const s = new Date(now);
    s.setDate(s.getDate() - 30);
    return labelFor(startOfDay(s), endToday, "the last 30 days");
  }

  if (/\blast\s*7\s*days\b|\bpast\s*week\b|\blast\s*week\b(?!\s*end)/.test(n) && !/\bthis\s*week\b/.test(n)) {
    const s = new Date(now);
    s.setDate(s.getDate() - 7);
    return labelFor(startOfDay(s), endToday, "the last 7 days");
  }

  if (/\blast\s*3\s*months\b|\bpast\s*3\s*months\b|\bthree\s*months\b/.test(n)) {
    const s = addMonths(now, -3);
    return labelFor(startOfDay(s), endToday, "the last 3 months");
  }

  if (/\blast\s*6\s*months\b|\bpast\s*6\s*months\b|\bsix\s*months\b/.test(n)) {
    const s = addMonths(now, -6);
    return labelFor(startOfDay(s), endToday, "the last 6 months");
  }

  if (/\blast\s*year\b|\bpast\s*year\b/.test(n) && !/\bthis\s*year\b/.test(n)) {
    const s = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    return labelFor(startOfDay(s), endToday, "the last 12 months");
  }

  if (/\bthis\s*year\b|\bytd\b|\byear to date\b/.test(n)) {
    const s = new Date(now.getFullYear(), 0, 1);
    return labelFor(startOfDay(s), endToday, "this calendar year");
  }

  if (/\blast\s*month\b|\bprevious\s*month\b/.test(n)) {
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return labelFor(first, last, first.toLocaleDateString("en-IN", { month: "long", year: "numeric" }));
  }

  if (/\bthis\s*month\b|\bcurrent\s*month\b/.test(n)) {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    return labelFor(startOfDay(s), endToday, "this month");
  }

  if (/\btoday\b|\bright\s*now\b/.test(n)) {
    return labelFor(today, endToday, "today");
  }

  if (/\byesterday\b/.test(n)) {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return labelFor(startOfDay(y), endOfDay(y), "yesterday");
  }

  if (/\bthis\s*week\b/.test(n)) {
    const dow = now.getDay();
    const monOffset = dow === 0 ? -6 : 1 - dow;
    const s = new Date(now);
    s.setDate(s.getDate() + monOffset);
    return labelFor(startOfDay(s), endToday, "this week (Mon–today)");
  }

  if (/\blast\s*week\b/.test(n)) {
    const dow = now.getDay();
    const monOffset = dow === 0 ? -6 : 1 - dow;
    const thisMon = new Date(now);
    thisMon.setDate(thisMon.getDate() + monOffset);
    thisMon.setHours(0, 0, 0, 0);
    const lastSun = new Date(thisMon);
    lastSun.setDate(lastSun.getDate() - 1);
    const lastMon = new Date(lastSun);
    lastMon.setDate(lastSun.getDate() - 6);
    return labelFor(startOfDay(lastMon), endOfDay(lastSun), "last week (Mon–Sun)");
  }

  // Named month + optional year (e.g. "january", "jan 2025")
  for (let i = 0; i < 12; i++) {
    if (n.includes(MONTH_NAMES[i]) || new RegExp(`\\b${MONTH_SHORT[i]}\\b`).test(n)) {
      let y = now.getFullYear();
      const ym = n.match(/\b(20\d{2}|19\d{2})\b/);
      if (ym) y = Number(ym[1]);
      const s = new Date(y, i, 1);
      const e = new Date(y, i + 1, 0, 23, 59, 59, 999);
      return labelFor(s, e, s.toLocaleDateString("en-IN", { month: "long", year: "numeric" }));
    }
  }

  if (/\bdashboard\s*range\b|\bselected\s*range\b|\bchart\s*range\b/.test(n) && dashboardRangeHint) {
    if (dashboardRangeHint === "overall") {
      return {
        start: null,
        end: null,
        label: "all loaded transactions (Overall)",
        preset: "overall",
      };
    }
    const start = getStartDate(dashboardRangeHint);
    return {
      start,
      end: endToday,
      label: `your dashboard time range (${dashboardRangeHint})`,
      preset: dashboardRangeHint,
    };
  }

  return { start: null, end: null, label: "", preset: null };
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function isContextualVagueQuery(normalized) {
  if (!normalized) return true;
  if (normalized.length <= 18) {
    if (/^(summary|overall|overview|explain|show\s*me|\?)$/.test(normalized)) return true;
    if (/^(food|rent|shopping|transport|health)\??$/.test(normalized)) return true;
    if (/^(this\s*month|spending|income)\??$/.test(normalized)) return true;
  }
  return /\b(this|these|current|visible|here|dashboard|what\s*does\s*this)\b/.test(normalized);
}

function scoreIntent(normalized, { category, typeHint, hasExplicitTime }) {
  const scores = {};
  const add = (k, w) => {
    scores[k] = (scores[k] || 0) + w;
  };

  if (/\bnext\s*month\b|\bforecast\b|\bproject(ed|ion)\b/.test(normalized)) add(INTENTS.FORECAST, 6);
  if (/\b20\d{2}\b/.test(normalized) && /\b(year|fy)\b/.test(normalized)) add(INTENTS.FORECAST, 4);

  if (/\bcompare\b.*\bmonth\b|\bmonth\b.*\bvs\b|\bthis\s*month\b.*\b(last|previous)\s*month\b/.test(normalized)) {
    add(INTENTS.MONTHLY_COMPARISON, 7);
  }

  if (/\brecurr(ing|ent)\b|\brepeated\b|\bsame\s*bill\b/.test(normalized)) add(INTENTS.RECURRING, 6);
  if (/\bunusual\b|\boutlier\b|\bweird\b|\bstrange\b/.test(normalized)) add(INTENTS.UNUSUAL, 6);
  if (/\b(biggest|largest|max|single)\b.*\b(transactions?|expense|payment)\b|\bwhich\s*transaction\b/.test(normalized))
    add(INTENTS.LARGEST, 6);
  if (/\b(biggest|largest)\s*expenses?\b|\btop\s*3\b.*\bexpense/.test(normalized)) add(INTENTS.LARGEST, 4);

  if (/\btop\s*(spending\s*)?categor|\bwhere\s*(am\s*i|do\s*i)\s*spend\b|\bhighest\s*categor/.test(normalized)) {
    add(INTENTS.TOP_CATEGORY, 7);
  }

  if (/\boverspend|\btoo\s*much\b|\bover\s*budget\b/.test(normalized)) add(INTENTS.OVERSPENDING, 5);

  if (/\bsave(d|s)?\s*money\b|\bsavings\b|\bnet\s*(positive|negative)\b|\bdid i save\b/.test(normalized)) {
    add(INTENTS.SAVINGS, 5);
  }

  if (/\bwhat\s*stands\s*out\b|\bpay\s*attention\b|\bwhat\s*should\s*i\s*watch\b/.test(normalized)) {
    add(INTENTS.STANDS_OUT, 6);
  }

  if (typeHint === "income") add(INTENTS.INCOME, 4);
  if (typeHint === "expense") add(INTENTS.EXPENSE, 4);

  if (category && /\bhow\s*much\b|\bspend\b|\bspent\b|\bexpense\b|\bcost\b/.test(normalized)) {
    add(INTENTS.CATEGORY, 8);
  }

  if (hasExplicitTime && !category) add(INTENTS.TIME, 3);

  if (
    /\bsummary\b|\boverview\b|\bbig\s*picture\b|\boverall\b|\bexplain\b|\bfinances?\b|\bhow am i doing\b|\bdashboard\b/.test(
      normalized
    )
  ) {
    add(INTENTS.OVERALL, 5);
  }

  add(INTENTS.FALLBACK, 1);

  let best = INTENTS.FALLBACK;
  let max = -1;
  for (const [k, v] of Object.entries(scores)) {
    if (v > max) {
      max = v;
      best = k;
    }
  }
  return { intent: best, scores };
}

export function parseAssistantIntent(normalized, meta = {}) {
  const typeHint = extractType(normalized);
  const category = extractCategory(normalized);
  const tr = extractTimeRange(normalized, meta.now || new Date(), meta.dashboardRangeHint);
  const hasExplicitTime =
    Boolean(tr.start && tr.end) || tr.label === "all time in your data" || tr.preset === "overall";

  let { intent } = scoreIntent(normalized, { category, typeHint, hasExplicitTime });

  // Short vague fragments → overall or category
  if (/^(food|rent|shopping|transport|health|utilities|entertainment|education|salary)\??$/.test(normalized)) {
    intent = INTENTS.CATEGORY;
  }
  if (/^(summary|overall|overview)\??$/.test(normalized)) {
    intent = INTENTS.OVERALL;
  }
  if (/^(this\s*month|last\s*month)\??$/.test(normalized)) {
    intent = INTENTS.TIME;
  }
  if (/\btop\s*categor/.test(normalized)) intent = INTENTS.TOP_CATEGORY;

  return {
    intent,
    typeHint,
    category,
    timeRange: tr,
    hasExplicitTime,
  };
}
