// ============================================================================
// formatDate(date: Date | string): string
// Formats a date for display. Returns relative time for recent dates
// (e.g. "just now", "5m ago", "2h ago", "2d ago") and falls back to "Mon D, YYYY"
// for anything older than 7 days.
// ============================================================================

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
}
// ============================================================================
// formatExpiry(expiresAt: Date): string
// Converts a future expiry date into a human-readable duration string.
// Returns the time remaining until expiry (e.g. "45 minutes", "12 hours",
// "3 days", "2 weeks"). Intended for use in invite/magic link emails.
// ============================================================================

export function formatExpiry(expiresAt: Date): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  const minutes = Math.round(ms / (1000 * 60));
  const hours = Math.round(ms / (1000 * 60 * 60));
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  const weeks = Math.round(ms / (1000 * 60 * 60 * 24 * 7));

  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""}`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""}`;
  return `${weeks} week${weeks !== 1 ? "s" : ""}`;
}

// ============================================================================
// getStartOfToday(baseDate: Date = new Date()): Date
// Returns the start of today (midnight)
// ===========================================================================
export function getStartOfToday(baseDate: Date = new Date()): Date {
  const date = new Date(baseDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

// ============================================================================
// getDaysAgo(days: number, baseDate: Date = new Date()): Date
// Returns the start of the day N days ago
// ===========================================================================
export function getDaysAgo(days: number, baseDate: Date = new Date()): Date {
  const today = getStartOfToday(baseDate);
  const date = new Date(today);
  date.setDate(today.getDate() - days);
  return date;
}

// ============================================================================
// getStartOfWeek(baseDate: Date = new Date()): Date
// Returns the start of the current week (7 days ago)
// ===========================================================================
export function getStartOfWeek(baseDate: Date = new Date()): Date {
  return getDaysAgo(7, baseDate);
}

// ============================================================================
// getStartOfMonth(baseDate: Date = new Date()): Date
// Returns the start of the current month
// ===========================================================================
export function getStartOfMonth(baseDate: Date = new Date()): Date {
  const date = new Date(baseDate);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// ============================================================================
// formatDateForFilename(date: Date = new Date()): string
// Returns a YYYY-MM-DD string safe for filenames
// ============================================================================
export function formatDateForFilename(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// ============================================================================
// getStartOfYesterday(baseDate: Date = new Date()): Date
// Returns the start of yesterday (midnight)
// ============================================================================
export function getStartOfYesterday(baseDate: Date = new Date()): Date {
  return getDaysAgo(1, baseDate);
}

// ============================================================================
// getEndOfYesterday(baseDate: Date = new Date()): Date
// Returns the end of yesterday (23:59:59.999)
// ============================================================================
export function getEndOfYesterday(baseDate: Date = new Date()): Date {
  const date = getStartOfToday(baseDate);
  date.setMilliseconds(-1);
  return date;
}

// ============================================================================
// getStartOfLastWeek(baseDate: Date = new Date()): Date
// Returns the start of the previous 7-day period (14 days ago)
// ============================================================================
export function getStartOfLastWeek(baseDate: Date = new Date()): Date {
  return getDaysAgo(14, baseDate);
}

// ============================================================================
// getEndOfLastWeek(baseDate: Date = new Date()): Date
// Returns the end of the previous 7-day period (start of current week - 1ms)
// ============================================================================
export function getEndOfLastWeek(baseDate: Date = new Date()): Date {
  const date = getStartOfWeek(baseDate);
  date.setMilliseconds(-1);
  return date;
}

// ============================================================================
// getStartOfLastMonth(baseDate: Date = new Date()): Date
// Returns the start of the previous calendar month
// ============================================================================
export function getStartOfLastMonth(baseDate: Date = new Date()): Date {
  const date = new Date(baseDate);
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

// ============================================================================
// getEndOfLastMonth(baseDate: Date = new Date()): Date
// Returns the end of the previous calendar month (23:59:59.999)
// ============================================================================
export function getEndOfLastMonth(baseDate: Date = new Date()): Date {
  const date = new Date(baseDate);
  const end = new Date(date.getFullYear(), date.getMonth(), 1);
  end.setMilliseconds(-1);
  return end;
}
