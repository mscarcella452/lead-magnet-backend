// ============================================================================
// Helpers
// ============================================================================

export function buildUpdatedParams(
  searchParams: URLSearchParams,
  updates: Record<string, string>,
): string {
  const params = new URLSearchParams(searchParams.toString());
  Object.entries(updates).forEach(([key, value]) => params.set(key, value));
  return params.toString();
}
