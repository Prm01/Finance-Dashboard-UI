/**
 * Financer — rule-based finance answers grounded in analytics; optional Gemini polish.
 */
import { formatCurrency, formatCurrencyNoSign } from "../utils/formatCurrency.js";
import { DATE_RANGE_LABELS } from "../utils/dateFilterUtils.js";
import { getMonthlyTotals } from "../utils/getMonthlyTotals.js";
import {
  getFilteredTransactions,
  getSummaryStats,
  getCategoryBreakdown,
  getTopSpendingCategory,
  getMonthlyComparison,
  getLargestTransaction,
  detectRecurringExpenses,
  detectUnusualSpending,
  getCategoryIncreaseMonthOverMonth,
  getNextMonthForecast,
  getYearForecastFromAverages,
  applyContextualFilters,
  filterTransactionsByDateWindow,
} from "../analytics/transactionAnalytics.js";
import {
  normalizeQuery,
  parseAssistantIntent,
  extractTimeRange,
  extractCategory,
  extractType,
  isContextualVagueQuery,
  INTENTS,
} from "./assistantParser.js";
import { detectTopLevelTier, TIER } from "./assistantIntents.js";
import { polishFinancerAnswer } from "./assistantGemini.js";

const stripMd = (s) => String(s || "").replace(/\*\*/g, "");

export function generateHelpResponse() {
  return `Hi — I'm Financer, your finance copilot. I answer using your dashboard data and current filters only. You can ask for summaries, category spending, savings, trends, and comparisons — or tap a suggestion below.`;
}

export function generateOutOfScopeResponse() {
  return `I can't answer that — I only work with your finance dashboard data and filters. Try "overall summary", "this month", "how much on food?", or "compare this month and last month".`;
}

function shortCategoryOnly(n) {
  return /^(food|rent|shopping|transport|health|utilities|entertainment|education|salary|freelance|investment)\??$/.test(
    n
  );
}

function forecastReply(normalized, txs, now) {
  if (/\bnext\s*month\b/.test(normalized)) {
    const proj = getNextMonthForecast(txs, now);
    return `${proj.monthLabel}: from your historical monthly averages for that calendar month, income ≈ ${formatCurrency(
      proj.income
    )}, expenses ≈ ${formatCurrencyNoSign(proj.expenses)}, net ≈ ${formatCurrency(proj.net)} (estimate from past data).`;
  }
  const ym = normalized.match(/\b(20\d{2}|19\d{2})\b/);
  const y = ym ? Number(ym[1]) : now.getFullYear() + 1;
  const yproj = getYearForecastFromAverages(txs, y);
  return `For ${y}, summing month-by-month historical averages: income ≈ ${formatCurrency(
    yproj.totalIncome
  )}, expenses ≈ ${formatCurrencyNoSign(yproj.totalExpenses)}, net ≈ ${formatCurrency(yproj.net)}.`;
}

function standsOutReply(data, fullTxs) {
  const parts = [];
  const top = getTopSpendingCategory(data);
  if (top && top.expenseTotal > 0) {
    parts.push(
      `${top.category} leads spending at ${formatCurrencyNoSign(top.total)} (${top.share.toFixed(0)}% of expenses here).`
    );
  }
  const { outliers, median } = detectUnusualSpending(data);
  if (outliers.length > 0) {
    const o = outliers.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))[0];
    parts.push(
      `A large line: ${o.description || o.category} (${formatCurrencyNoSign(o.amount)}); typical expense median ≈ ${formatCurrencyNoSign(median)}.`
    );
  }
  const inc = getCategoryIncreaseMonthOverMonth(fullTxs, new Date());
  if (inc && inc.pct > 15 && inc.previous > 0) {
    parts.push(`${inc.category} is up ${inc.pct.toFixed(0)}% vs last month (${formatCurrencyNoSign(inc.previous)} → ${formatCurrencyNoSign(inc.current)}).`);
  }
  if (!parts.length) return "Nothing dramatic stands out in this slice — spending looks steady.";
  return parts.join(" ");
}

function overspendingReply(stats, top) {
  if (stats.totalExpenses > stats.totalIncome && stats.totalIncome > 0) {
    return `Expenses (${formatCurrencyNoSign(stats.totalExpenses)}) exceed income (${formatCurrencyNoSign(
      stats.totalIncome
    )}) by ${formatCurrencyNoSign(stats.totalExpenses - stats.totalIncome)}.${top ? ` Largest pressure: ${top.category} (${formatCurrencyNoSign(top.total)}).` : ""}`;
  }
  if (stats.totalIncome > 0 && stats.net < stats.totalIncome * 0.05) {
    return `Net is only ${formatCurrency(stats.net)} — little cushion if a big expense hits.`;
  }
  return `Spending isn't clearly above income here${stats.net >= 0 ? `; net ${formatCurrency(stats.net)}.` : "."}`;
}

function buildDataSnapshot({
  pathname,
  filters,
  assistantDashboardRange,
  rangeLabel,
  stats,
  top,
  dataSlice,
}) {
  const expenseBreakdown = getCategoryBreakdown(dataSlice, true);
  const top5 = Object.entries(expenseBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }));

  const trend = getMonthlyTotals(Array.isArray(dataSlice) ? dataSlice : [], 6).map((m) => ({
    label: m.monthLabel,
    income: m.income,
    expenses: m.expenses,
    net: m.net,
  }));

  return {
    currentPage: pathname,
    filters: {
      type: filters?.type ?? "all",
      category: filters?.category ?? "all",
      search: filters?.search ?? "",
      dashboardRange: assistantDashboardRange ?? null,
    },
    rangeLabel,
    summary: {
      transactionCount: stats.count,
      totalIncome: stats.totalIncome,
      totalExpenses: stats.totalExpenses,
      net: stats.net,
      avgAmount: stats.avgAmount,
    },
    topExpenseCategory: top ? { category: top.category, amount: top.total, sharePct: top.share } : null,
    expenseBreakdownTop5: top5,
    monthlyTrend6: trend,
  };
}

/**
 * Pure rule-based finance answer (+ subtype for Gemini). No tier checks.
 */
export function buildRuleBasedFinanceAnswer(query, transactions, context, options = {}) {
  const {
    loading = false,
    pathname = "/",
    filters = {},
    assistantDashboardRange = null,
    now = new Date(),
  } = context;

  const { forceIntent = null, tier = null } = options;

  if (loading) {
    return { text: "Loading your transactions… try again in a moment.", subtype: "loading", slice: null };
  }

  const txs = Array.isArray(transactions) ? transactions : [];
  if (txs.length === 0) {
    return {
      text: "I don't see any transactions yet. Add data from Transactions (Admin) or connect your backend.",
      subtype: "empty",
      slice: null,
    };
  }

  const normalized = normalizeQuery(query);
  const parsed = parseAssistantIntent(normalized, {
    now,
    dashboardRangeHint: assistantDashboardRange,
  });

  let intent = forceIntent || parsed.intent;
  if (tier === TIER.FINANCE_FALLBACK) {
    intent = INTENTS.OVERALL;
  }

  let tr = parsed.timeRange;
  const timeAlt = extractTimeRange(normalized, now, assistantDashboardRange);
  if (!tr.start && timeAlt.start) tr = timeAlt;

  const explicitTime = Boolean(tr.start && tr.end) || tr.label === "all time in your data";

  const categoryFromPhrase = extractCategory(normalized) || parsed.category;
  const typeFromPhrase = extractType(normalized) || parsed.typeHint;
  const vague = isContextualVagueQuery(normalized);

  let base = txs;
  let contextNote = "";

  if (
    vague &&
    !explicitTime &&
    (intent === INTENTS.OVERALL ||
      intent === INTENTS.FALLBACK ||
      intent === INTENTS.STANDS_OUT ||
      normalized.length < 22)
  ) {
    base = applyContextualFilters(txs, {
      pathname,
      filters,
      dashboardRange: pathname === "/" ? assistantDashboardRange : null,
    });
    if (pathname === "/" && assistantDashboardRange) {
      contextNote = `Using your dashboard range (${DATE_RANGE_LABELS[assistantDashboardRange] || assistantDashboardRange}). `;
    } else if (pathname.startsWith("/transactions")) {
      contextNote = "Using your current Transactions filters. ";
    } else if (pathname.startsWith("/insights")) {
      contextNote = "On Insights — using your full loaded list unless you specify a time range. ";
    }
  }

  const timeSource = explicitTime ? txs : base;
  let data = base;
  if (tr.start && tr.end) {
    data = filterTransactionsByDateWindow(timeSource, tr.start, tr.end);
  } else if (tr.label === "all time in your data") {
    data = txs;
  } else if (
    intent === INTENTS.TIME ||
    intent === INTENTS.SAVINGS ||
    intent === INTENTS.OVERSPENDING ||
    /\bthis\s*month\b|\blast\s*month\b/.test(normalized)
  ) {
    if (!tr.start && /\blast\s*month\b/.test(normalized)) {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      data = filterTransactionsByDateWindow(timeSource, first, last);
      tr = { ...tr, label: "last month" };
    } else if (!tr.start) {
      data = filterTransactionsByDateWindow(timeSource, new Date(now.getFullYear(), now.getMonth(), 1), now);
      tr = { ...tr, label: "this month" };
    }
  }

  let typeF = typeFromPhrase;
  if (intent === INTENTS.INCOME) typeF = "income";
  if (intent === INTENTS.EXPENSE) typeF = "expense";

  if (typeF === "income" || typeF === "expense") {
    data = getFilteredTransactions(data, { type: typeF });
  }

  const useCategory =
    categoryFromPhrase &&
    (intent === INTENTS.CATEGORY ||
      shortCategoryOnly(normalized) ||
      /\bhow\s*much\b|\bspent\b|\bspend\b|\bexpenses?\s*for\b/.test(normalized));

  if (useCategory && categoryFromPhrase) {
    const spendOnly =
      /\bspend|spent|expenses?\b/.test(normalized) && !/\bincome|\bearn\b/.test(normalized);
    data = getFilteredTransactions(data, {
      categories: [categoryFromPhrase],
      type: spendOnly ? "expense" : null,
    });
  }

  const stats = getSummaryStats(data);
  const top = getTopSpendingCategory(data);
  const rangeLabel = tr.label || (tr.start && tr.end ? "selected period" : "this view");

  const slice = { data, stats, top, rangeLabel, contextNote };

  const finish = (text, subtype) => ({
    text: contextNote + text,
    subtype: subtype || intent,
    slice,
  });

  switch (intent) {
    case INTENTS.FORECAST:
      return finish(forecastReply(normalized, txs, now), "forecast");

    case INTENTS.MONTHLY_COMPARISON: {
      let scopeTxs = txs;
      if (categoryFromPhrase) {
        scopeTxs = txs.filter((t) => t.type === "expense" && t.category === categoryFromPhrase);
      }
      const cmp = getMonthlyComparison(scopeTxs, now);
      const c = cmp.current;
      const p = cmp.previous;
      const expDelta = p.expenses ? ((c.expenses - p.expenses) / p.expenses) * 100 : null;
      const label = categoryFromPhrase ? `${categoryFromPhrase} — ` : "";
      const line1 = `${label}${cmp.thisMonthLabel}: income ${formatCurrencyNoSign(c.income)}, expenses ${formatCurrencyNoSign(
        c.expenses
      )}, net ${formatCurrency(c.net)}.`;
      const line2 = `${cmp.prevMonthLabel}: income ${formatCurrencyNoSign(p.income)}, expenses ${formatCurrencyNoSign(
        p.expenses
      )}, net ${formatCurrency(p.net)}.`;
      const line3 =
        expDelta !== null && Number.isFinite(expDelta)
          ? ` Expenses ${expDelta >= 0 ? "up" : "down"} ${Math.abs(expDelta).toFixed(0)}% vs prior month.`
          : "";
      return finish(`${line1} ${line2}${line3}`, "comparison");
    }

    case INTENTS.RECURRING: {
      const rec = detectRecurringExpenses(data, 3);
      if (!rec.length) return finish("No category shows 3+ expense lines here — widen the range or try all time.", "recurring");
      const topR = rec[0];
      return finish(
        `${topR.category}: ${topR.count} expense entries, total ${formatCurrencyNoSign(topR.total)} (frequent / recurring pattern).`,
        "recurring"
      );
    }

    case INTENTS.UNUSUAL: {
      const { outliers, median } = detectUnusualSpending(data);
      if (!outliers.length) return finish(`No large outliers vs median (${formatCurrencyNoSign(median)}) here.`, "unusual");
      const o = outliers.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))[0];
      return finish(
        `${o.description || "Entry"} (${formatCurrencyNoSign(o.amount)}) stands out; median expense ≈ ${formatCurrencyNoSign(median)}.`,
        "unusual"
      );
    }

    case INTENTS.LARGEST: {
      const largest = getLargestTransaction(data);
      if (!largest) return finish(`No expenses in ${rangeLabel}.`, "largest");
      return finish(
        `Largest expense (${rangeLabel}): ${largest.description || largest.category} — ${formatCurrencyNoSign(largest.amount)} (${largest.category}).`,
        "largest"
      );
    }

    case INTENTS.TOP_CATEGORY: {
      if (!top || top.expenseTotal <= 0) return finish(`No expense categories in ${rangeLabel}.`, "top_category");
      return finish(
        `Top spending (${rangeLabel}): ${top.category} at ${formatCurrencyNoSign(top.total)} (${top.share.toFixed(0)}% of expenses).`,
        "top_category"
      );
    }

    case INTENTS.OVERSPENDING:
      return finish(overspendingReply(stats, top), "overspending");

    case INTENTS.SAVINGS: {
      if (stats.totalIncome === 0 && stats.totalExpenses === 0) {
        return finish(`No income/expense rows in ${rangeLabel}.`, "savings");
      }
      const saved = stats.net >= 0;
      return finish(
        `${rangeLabel}: income ${formatCurrencyNoSign(stats.totalIncome)}, expenses ${formatCurrencyNoSign(stats.totalExpenses)}. Net ${formatCurrency(stats.net)} — ${saved ? "positive in this slice." : "expenses exceed income here."}`,
        "savings"
      );
    }

    case INTENTS.INCOME:
      return finish(`Income (${rangeLabel}): ${formatCurrencyNoSign(stats.totalIncome)} across ${stats.count} entries.`, "income");

    case INTENTS.EXPENSE:
      return finish(
        `Expenses (${rangeLabel}): ${formatCurrencyNoSign(stats.totalExpenses)} across ${stats.count} entries.${
          top && top.expenseTotal > 0 ? ` Top: ${top.category} (${formatCurrencyNoSign(top.total)}).` : ""
        }`,
        "expense"
      );

    case INTENTS.CATEGORY: {
      if (!categoryFromPhrase) {
        return { text: "Name a category (food, rent, transport) or say top category.", subtype: "category", slice };
      }
      if (stats.count === 0) {
        return finish(`No ${categoryFromPhrase} in ${rangeLabel}. Try another range or clear filters.`, "category");
      }
      const br = getCategoryBreakdown(data, false);
      const catTotal = br[categoryFromPhrase] || 0;
      return finish(
        `${categoryFromPhrase} (${rangeLabel}): ${formatCurrencyNoSign(catTotal)} over ${stats.count} matching lines.`,
        "category"
      );
    }

    case INTENTS.TIME:
      return finish(
        `${rangeLabel}: income ${formatCurrencyNoSign(stats.totalIncome)}, expenses ${formatCurrencyNoSign(
          stats.totalExpenses
        )}, net ${formatCurrency(stats.net)}, ${stats.count} transactions.${
          top && top.expenseTotal > 0 ? ` Top expense: ${top.category} (${formatCurrencyNoSign(top.total)}).` : ""
        }`,
        "time"
      );

    case INTENTS.STANDS_OUT:
      return finish(standsOutReply(data, txs), "stands_out");

    case INTENTS.OVERALL:
    case INTENTS.FALLBACK:
    default: {
      if (stats.count === 0) {
        return finish(`Nothing matches ${rangeLabel} in this slice. Adjust filters or widen the time range.`, "overall");
      }
      const breakdown = getCategoryBreakdown(data, true);
      const top3 = Object.entries(breakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([c, v]) => `${c} ${formatCurrencyNoSign(v)}`)
        .join(", ");
      return finish(
        `${rangeLabel}: income ${formatCurrencyNoSign(stats.totalIncome)}, expenses ${formatCurrencyNoSign(
          stats.totalExpenses
        )}, net ${formatCurrency(stats.net)}, ${stats.count} transactions.${top3 ? ` Main expense areas: ${top3}.` : ""}`,
        "overall"
      );
    }
  }
}

export async function generateFinalCopilotResponse(query, transactions, context = {}) {
  const now = context.now || new Date();
  const tier = detectTopLevelTier(query, now);

  if (tier === TIER.HELP) {
    return { text: stripMd(generateHelpResponse()), tier, usedGemini: false };
  }
  if (tier === TIER.OUT_OF_SCOPE) {
    return { text: stripMd(generateOutOfScopeResponse()), tier, usedGemini: false };
  }

  if (context.loading) {
    return { text: "Loading your transactions… one moment.", tier, usedGemini: false };
  }

  const rule = buildRuleBasedFinanceAnswer(query, transactions, context, { tier });
  if (rule.subtype === "loading" || rule.subtype === "empty") {
    return { text: stripMd(rule.text), tier, usedGemini: false };
  }

  const s = rule.slice;
  const snapshot = buildDataSnapshot({
    pathname: context.pathname || "/",
    filters: context.filters || {},
    assistantDashboardRange: context.assistantDashboardRange,
    rangeLabel: s?.rangeLabel || "this view",
    stats: s?.stats || getSummaryStats(transactions),
    top: s?.top ?? getTopSpendingCategory(transactions),
    dataSlice: s?.data ?? transactions,
  });

  const polished = await polishFinancerAnswer({
    userQuestion: query,
    draftAnswer: rule.text,
    dataSnapshot: snapshot,
    financeSubtype: rule.subtype,
  });

  return {
    text: stripMd(polished),
    tier,
    usedGemini: stripMd(polished) !== stripMd(rule.text),
  };
}
