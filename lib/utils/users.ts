//=========================================================
// getDeletedUserDisplay
//=========================================================
/**
 * Returns the display name for a user, appending "(deleted)" if the user has been deleted.
 * Uses the dual-field pattern where `id` is nullified on deletion but `name` is preserved.
 */

export function getDeletedUserDisplay(
  id: string | null,
  displayName: string | null,
) {
  if (!displayName) return null;
  return id === null ? `${displayName} (deleted)` : displayName;
}
