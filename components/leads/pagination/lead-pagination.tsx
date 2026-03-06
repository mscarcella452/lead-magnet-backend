// ============================================================================
// Lead Pagination Component
// ============================================================================

"use client";

import { useCallback, memo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationButton,
  PaginationNextButton,
  PaginationPreviousButton,
} from "@/components/ui/controls/pagination";

interface LeadPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

// ============================================================================
// Helpers
// ============================================================================

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis-start" | "ellipsis-end")[] {
  const MAX_VISIBLE_PAGES = 5;

  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  const middle = Array.from({ length: end - start + 1 }, (_, i) => i + start);

  return [
    1,
    ...(currentPage > 3 ? ["ellipsis-start" as const] : []),
    ...middle,
    ...(currentPage < totalPages - 2 ? ["ellipsis-end" as const] : []),
    totalPages,
  ];
}

// ============================================================================
// LeadPagination
// ============================================================================

export const LeadPagination = memo(function LeadPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: LeadPaginationProps) {
  const handlePageChange = useCallback(
    (page: number) => {
      if (isLoading || page === currentPage) return;
      onPageChange(page);
    },
    [isLoading, currentPage, onPageChange],
  );

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Lead table pagination">
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPreviousButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              aria-label="Go to previous page"
            />
          </PaginationItem>

          {pages.map((page) =>
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationItem key={page}>
                <PaginationEllipsis aria-hidden="true" />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationButton
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </PaginationButton>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNextButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              aria-label="Go to next page"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </nav>
  );
});
