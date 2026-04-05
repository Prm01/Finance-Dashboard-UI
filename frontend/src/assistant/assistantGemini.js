/**
 * Optional Gemini polish — facts must come from draftAnswer / dataSnapshot; never invent numbers.
 * Prefers backend proxy (keeps API key server-side). Falls back to client key only if configured.
 */

const SYSTEM_PROMPT = `You are Financer, a finance copilot inside a personal finance dashboard.
Rewrite the user's answer to sound natural, concise, and professional (fintech tone).
Rules:
- Use ONLY facts and numbers that appear in DRAFT_ANSWER or FACTS_JSON. Never invent amounts, counts, dates, or categories.
- If information is missing, say: "I can only answer using your dashboard data and current filters."
- Do not answer general knowledge or personal questions — the draft already reflects allowed scope.
- Output plain text only, no markdown bold markers, under 120 words.`;

import { formatApiUrl } from "../api/baseUrl.js";

export async function polishFinancerAnswer({
  userQuestion,
  draftAnswer,
  dataSnapshot,
  financeSubtype,
}) {
  const draft = String(draftAnswer || "").trim();
  if (!draft) return draft;

  const useProxy = import.meta.env.VITE_FINANCER_GEMINI_PROXY !== "false";
  const apiBase = API_BASE_URL;

  if (useProxy) {
    try {
      const url = formatApiUrl("/copilot/polish");
      console.log("[assistantGemini] POST", url);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuestion,
          draftAnswer: draft,
          dataSnapshot,
          financeSubtype: financeSubtype || "general",
        }),
      });
      if (res.ok) {
        const j = await res.json();
        if (j.success && typeof j.text === "string" && j.text.trim()) {
          return j.text.trim();
        }
      }
    } catch (e) {
      console.warn("[Financer] Gemini proxy unavailable, using draft answer.", e);
    }
  }

  const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!clientKey) {
    return draft;
  }

  try {
    const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(clientKey)}`;
    const userPayload = [
      `USER_QUESTION: ${userQuestion}`,
      `FINANCE_SUBTYPE: ${financeSubtype || "general"}`,
      `FACTS_JSON: ${JSON.stringify(dataSnapshot || {})}`,
      `DRAFT_ANSWER (preserve every ₹ amount and number exactly): ${draft}`,
      "Rewrite DRAFT_ANSWER to be smoother. Do not change any numeric values.",
    ].join("\n\n");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPayload }] }],
        generationConfig: { temperature: 0.25, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      console.warn("[Financer] Gemini HTTP", res.status);
      return draft;
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text && String(text).trim()) return String(text).trim();
  } catch (e) {
    console.warn("[Financer] Direct Gemini failed.", e);
  }

  return draft;
}
