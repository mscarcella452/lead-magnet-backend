// ============================================================================
// ActionResult<T> is a type that can be used to return a result from a server action
// It is used in the server actions to return a result from a server action
// ===========================================================================

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
