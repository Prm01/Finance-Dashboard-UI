const axios = require("axios");

const SYSTEM_PROMPT = `You are Financer, a finance copilot inside a personal finance dashboard.
Rewrite the assistant reply to sound natural, concise, and professional (premium fintech tone).
Rules:
- Use ONLY facts and numbers that appear in DRAFT_ANSWER or FACTS_JSON. Never invent amounts, counts, dates, or categories.
- If information is missing, say exactly: "I can only answer using your dashboard data and current filters."
- Do not answer general knowledge or unrelated topics.
- Output plain text only (no markdown), max ~120 words.`;

/**
 * POST body: { userQuestion, draftAnswer, dataSnapshot, financeSubtype }
 * Requires GEMINI_API_KEY in environment (never commit keys).
 */
exports.polish = async (req, res, next) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    const { userQuestion, draftAnswer, dataSnapshot, financeSubtype } = req.body || {};
    const draft = String(draftAnswer || "").trim();

    if (!draft) {
      return res.status(400).json({ success: false, message: "draftAnswer required" });
    }

    if (!key) {
      console.warn("[copilot] GEMINI_API_KEY not set — returning draft only");
      return res.json({ success: true, text: draft, skipped: true });
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const userText = [
      `USER_QUESTION: ${String(userQuestion || "")}`,
      `FINANCE_SUBTYPE: ${String(financeSubtype || "general")}`,
      `FACTS_JSON: ${JSON.stringify(dataSnapshot || {})}`,
      `DRAFT_ANSWER (preserve every ₹ amount and number exactly): ${draft}`,
      "Rewrite DRAFT_ANSWER to be smoother. Do not change any numeric values.",
    ].join("\n\n");

    const { data } = await axios.post(
      url,
      {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: { temperature: 0.25, maxOutputTokens: 512 },
      },
      { params: { key }, headers: { "Content-Type": "application/json" }, timeout: 25000 }
    );

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("")?.trim() ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return res.json({ success: true, text: draft, skipped: true });
    }

    return res.json({ success: true, text });
  } catch (err) {
    console.error("[copilot] Gemini error:", err.response?.data || err.message);
    const draft = String(req.body?.draftAnswer || "").trim();
    return res.json({ success: true, text: draft, skipped: true, error: "polish_failed" });
  }
};
