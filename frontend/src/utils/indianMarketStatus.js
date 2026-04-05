/**
 * NSE/BSE cash session (regular hours) in Asia/Kolkata.
 * Open: Mon–Fri, 9:15 AM – 3:30 PM IST (inclusive at minute resolution).
 */

export const INDIAN_MARKET_TIMEZONE = "Asia/Kolkata";

const OPEN_START_MINUTES = 9 * 60 + 15; // 09:15
const OPEN_END_MINUTES = 15 * 60 + 30; // 15:30

/**
 * @param {Date} [now] — defaults to current instant (interpreted in IST for session rules)
 * @returns {{
 *   isOpen: boolean,
 *   label: string,
 *   message: string,
 *   tone: 'open' | 'closed',
 *   timezone: string,
 * }}
 */
export function getMarketStatus(now = new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: INDIAN_MARKET_TIMEZONE,
    weekday: "short",
  }).format(now);

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: INDIAN_MARKET_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const minutesSinceMidnight = hour * 60 + minute;

  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const inRegularSession =
    !isWeekend &&
    minutesSinceMidnight >= OPEN_START_MINUTES &&
    minutesSinceMidnight <= OPEN_END_MINUTES;

  const isOpen = inRegularSession;

  return {
    isOpen,
    label: isOpen ? "OPEN" : "CLOSED",
    message: isOpen ? "Closes at 3:30 PM" : "Opens at 9:15 AM",
    tone: isOpen ? "open" : "closed",
    timezone: INDIAN_MARKET_TIMEZONE,
  };
}
