// ============================================================================
// Types
// ============================================================================

export interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}
