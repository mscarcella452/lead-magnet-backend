// ============================================================================
// Empty State Component
// ============================================================================

export function EmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-center py-12 text-muted-foreground"
    >
      No leads yet. Waiting for submissions...
    </div>
  );
}
