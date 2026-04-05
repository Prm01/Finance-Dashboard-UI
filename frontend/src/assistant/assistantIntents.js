/**
 * Top-level routing for Financer (strict order: help → out-of-scope → finance → vague finance fallback).
 */
import { normalizeQuery } from "./assistantParser.js";
import { extractCategory, extractType, extractTimeRange } from "./assistantParser.js";

export const TIER = {
  HELP: "HELP",
  OUT_OF_SCOPE: "OUT_OF_SCOPE",
  FINANCE: "FINANCE",
  FINANCE_FALLBACK: "FINANCE_FALLBACK",
};

/** Identity / usage — not finance summaries */
export function isAssistantMetaQuery(n) {
  if (!n) return true;
  return (
    /^help\??$/.test(n) ||
    /^(hi|hello|hey)\s*financer\??$/.test(n) ||
    /\bwho are you\b|\bwhat are you\b/.test(n) ||
    /\bwhat can you do\b|\bwhat can i ask\b|\bwhat can you\b/.test(n) ||
    /^help$|\bhow do i use (you|financer)\b/.test(n) ||
    /\bhow do you work\b|\bexplain your features\b|\byour features\b|\bcapabilities\b/.test(n) ||
    /\bhow does financer work\b/.test(n)
  );
}

/** Unrelated to dashboard finance — must not trigger summaries */
export function isOutOfScopeQuery(n) {
  if (!n) return false;
  if (isAssistantMetaQuery(n)) return false;

  return (
    /\bwhat('?s| is) my name\b|\bmy name\b/.test(n) ||
    /\byour number\b|\bphone number\b|\bcall me\b/.test(n) ||
    /\bwhere do you live\b|\bwhere are you based\b/.test(n) ||
    /\bwho made you\b|\bwho created you\b|\bwhich model\b|\bwhich llm\b/.test(n) ||
    /\btell me a joke\b|\bfunny story\b/.test(n) ||
    /\bweather\b|\brain today\b/.test(n) ||
    /\bprime minister\b|\bpresident of\b|\bcapital of\b/.test(n) ||
    /\bhello bro\b|\bhi bro\b|\bsup bro\b/.test(n) ||
    /^hello$|^hi$|^hey$/.test(n) ||
    /\brecipe for\b|\bhow to cook\b/.test(n) ||
    /\bwrite (a )?code\b|\bpython\b.*\btutorial\b/.test(n)
  );
}

/** Vague but clearly about this dashboard view (allowed finance fallback only) */
export function isVagueFinanceFallbackQuery(n) {
  if (!n) return false;
  if (/^(summary|overall|overview)\??$/.test(n)) return true;
  if (/^(explain\s*this|summari[sz]e\s*this|this\s*view|big\s*picture)\??$/.test(n)) return true;
  if (/\bwhat\s*(does\s*this\s*dashboard\s*show|is\s*going\s*on\s*here)\b/.test(n)) return true;
  if (/\b(summari[sz]e|summari[sz]ing)\s+(the\s*)?(dashboard|this|it)\b/.test(n)) return true;
  if (/^show\s*me$/.test(n)) return true;
  return false;
}

/** Explicit finance / data questions (not meta, not OOS) */
export function isFinanceQuery(n, now = new Date()) {
  if (!n || isAssistantMetaQuery(n) || isOutOfScopeQuery(n)) return false;
  if (isVagueFinanceFallbackQuery(n)) return false;

  if (extractCategory(n)) return true;
  if (extractType(n)) return true;

  const tr = extractTimeRange(n, now, null);
  if (tr.start && tr.end) return true;
  if (tr.label === "all time in your data") return true;

  if (
    /\b(financ|financial|dashboard|transaction|income|expense|spend|spent|saving|budget|salary|rent|food|shopping|transport|invest|earn|earning|net\s|cash\s*flow|category|categories)\b/.test(n)
  )
    return true;
  if (/\b(this|last)\s*month\b|\bthis\s*week\b|\blast\s*week\b|\btoday\b|\byesterday\b/.test(n)) return true;
  if (/\bcompare\b.*\bmonth\b|\bmonth\b.*\bvs\b/.test(n)) return true;
  if (/\b(top|highest)\s*(spending\s*)?categor|\bwhere\s*(am i|do i)\s*spend\b/.test(n)) return true;
  if (/\b(biggest|largest)\s*(expense|transaction)\b/.test(n)) return true;
  if (/\bwhat\s*stands\s*out\b|\bunusual\b|\brecurr/.test(n)) return true;
  if (/\bnext\s*month\b|\bforecast\b|\bproject(ed|ion)\b/.test(n)) return true;
  if (/\b(give|get|show)\s+me\s+(a\s+)?(summary|overview|breakdown)\b/.test(n)) return true;
  if (/\b(how am i doing|how's my|how is my)\b/.test(n)) return true;
  if (/\boverall\s+(summary|view|picture)\b|\bgive me summary\b/.test(n)) return true;
  if (/\bsummary\b/.test(n) && n.length > 8) return true;

  return false;
}

export function detectTopLevelTier(rawQuery, now = new Date()) {
  const n = normalizeQuery(rawQuery);
  if (!n) return TIER.HELP;

  if (isAssistantMetaQuery(n)) return TIER.HELP;
  if (isOutOfScopeQuery(n)) return TIER.OUT_OF_SCOPE;
  if (isFinanceQuery(n, now)) return TIER.FINANCE;
  if (isVagueFinanceFallbackQuery(n)) return TIER.FINANCE_FALLBACK;

  return TIER.OUT_OF_SCOPE;
}

export function isFinanceQueryLoose(rawQuery, now = new Date()) {
  const t = detectTopLevelTier(rawQuery, now);
  return t === TIER.FINANCE || t === TIER.FINANCE_FALLBACK;
}
