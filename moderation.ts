/**
 * Shared content moderation utility.
 * Used by both frontend (comment filtering) and tests.
 */

export const BANNED_WORDS = [
  "terrorism",
  "terrorist",
  "pedophil",
  "rape",
  "child abuse",
  "bomb threat",
  "child porn",
  "sexual assault",
] as const;

/**
 * Check if a text string contains any banned words.
 * Case-insensitive matching.
 * @returns The first matched banned word, or null if clean.
 */
export function checkForBannedContent(text: string): string | null {
  const lower = text.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (lower.includes(word)) {
      return word;
    }
  }
  return null;
}

/**
 * Returns true if the text is clean (no banned content).
 */
export function isContentClean(text: string): boolean {
  return checkForBannedContent(text) === null;
}
