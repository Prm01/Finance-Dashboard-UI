/**
 * Derives 2–3 compact insight lines for Insights page (no heavy list UI).
 */
import { groupByCategory } from "./groupByCategory.js";
import { formatCurrencyNoSign } from "./formatCurrency.js";
import { EXPENSE_CATEGORIES } from "../constants/index.js";

const monthKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const addMonths = (date, delta) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return d;
};

function sumByCategory(txs) {
  const g = groupByCategory(txs);
  const out = {};
  EXPENSE_CATEGORIES.forEach((c) => {
    out[c] = Number(g[c] || 0);
  });
  return out;
}

/**
 * @returns {{ cards: Array<{ kind: string; title: string; subtitle: string; tone: 'indigo'|'emerald'|'rose' }>, periodLabel: string } | null}
 */
export function buildSmartInsightCards(expenseTxs) {
  const txs = Array.isArray(expenseTxs) ? expenseTxs : [];
  if (txs.length === 0) {
    return {
      periodLabel: "",
      cards: [
        {
          kind: "empty",
          title: "No expenses yet",
          subtitle: "Add transactions to see personalized insights here.",
          tone: "indigo",
        },
      ],
    };
  }

  let latest = null;
  for (const t of txs) {
    const d = t.date ? new Date(t.date) : null;
    if (!d || Number.isNaN(d.getTime())) continue;
    if (!latest || d > latest) latest = d;
  }

  const cards = [];
  let periodLabel = "all data in view";

  if (latest) {
    const currentKey = monthKey(latest);
    const prevKey = monthKey(addMonths(latest, -1));
    const currTxs = txs.filter((t) => {
      const d = t.date ? new Date(t.date) : null;
      return d && !Number.isNaN(d.getTime()) && monthKey(d) === currentKey;
    });
    const prevTxs = txs.filter((t) => {
      const d = t.date ? new Date(t.date) : null;
      return d && !Number.isNaN(d.getTime()) && monthKey(d) === prevKey;
    });

    const currMap = sumByCategory(currTxs.length ? currTxs : txs);
    const prevMap = sumByCategory(prevTxs);

    const totalCurr = Object.values(currMap).reduce((a, b) => a + b, 0);
    const usePeriod = currTxs.length > 0;
    const activeMap = currMap;
    const activeTotal = totalCurr;

    if (usePeriod) {
      periodLabel = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(latest);
    }

    // 1) Top category (current month if available, else all-time from map)
    const ranked = EXPENSE_CATEGORIES.map((c) => ({ category: c, value: activeMap[c] || 0 }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value);
    const top = ranked[0];
    if (top && activeTotal > 0) {
      const pct = (top.value / activeTotal) * 100;
      cards.push({
        kind: "top_category",
        category: top.category,
        title: `Top spending category is ${top.category} (${pct.toFixed(0)}%)`,
        subtitle: `${formatCurrencyNoSign(top.value)} spent ${usePeriod ? "this period" : "overall"}`,
        tone: "indigo",
      });
    }

    // MoM category deltas (only when we have two months)
    if (usePeriod && prevTxs.length > 0) {
      const deltas = [];
      for (const c of EXPENSE_CATEGORIES) {
        const cur = currMap[c] || 0;
        const prev = prevMap[c] || 0;
        if (cur === 0 && prev === 0) continue;
        if (prev <= 0 && cur > 0) {
          deltas.push({ category: c, pct: 100, cur, prev, dir: "up" });
          continue;
        }
        if (prev > 0) {
          const pct = ((cur - prev) / prev) * 100;
          deltas.push({ category: c, pct, cur, prev, dir: pct >= 0 ? "up" : "down" });
        }
      }

      const decreases = deltas.filter((d) => d.dir === "down" && d.prev >= 200);
      const increases = deltas.filter((d) => d.dir === "up" && d.pct >= 15 && d.cur >= 200);

      decreases.sort((a, b) => a.pct - b.pct);
      increases.sort((a, b) => b.pct - a.pct);

      const bestDown = decreases[0];
      if (bestDown && cards.length < 3) {
        cards.push({
          kind: "trend_down",
          category: bestDown.category,
          title: `${bestDown.category} spending decreased by ${Math.abs(bestDown.pct).toFixed(0)}% vs last period`,
          subtitle: `Compared to the previous month in your data.`,
          tone: "emerald",
        });
      }

      const bestUp = increases[0];
      if (bestUp && cards.length < 3) {
        cards.push({
          kind: "trend_up",
          category: bestUp.category,
          title: `${bestUp.category} spending increased by ${bestUp.pct.toFixed(0)}% compared to last period`,
          subtitle: `Last period ${formatCurrencyNoSign(bestUp.prev)} → this period ${formatCurrencyNoSign(bestUp.cur)}.`,
          tone: "rose",
        });
      }
    }

    // Fallback if only top card
    if (cards.length === 1 && ranked.length > 1) {
      const second = ranked[1];
      const pct2 = activeTotal > 0 ? (second.value / activeTotal) * 100 : 0;
      cards.push({
        kind: "runner_up",
        title: `${second.category} is your second-largest category`,
        subtitle: `${pct2.toFixed(0)}% of expenses · focus area for budgeting.`,
        tone: "indigo",
      });
    }
  }

  if (cards.length === 0) {
    cards.push({
      kind: "fallback",
      title: "Not enough expense data yet",
      subtitle: "Once you have categorized expenses, insights will appear here.",
      tone: "indigo",
    });
  }

  return {
    periodLabel,
    cards: cards.slice(0, 3),
  };
}
