"use client";

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

export function LeadPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: LeadPaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationButton
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                if (!isLoading) onPageChange(i);
              }}
            >
              {i}
            </PaginationButton>
          </PaginationItem>,
        );
      }
    } else {
      // Show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationButton
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading) onPageChange(1);
            }}
          >
            1
          </PaginationButton>
        </PaginationItem>,
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationButton
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                if (!isLoading) onPageChange(i);
              }}
            >
              {i}
            </PaginationButton>
          </PaginationItem>,
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Show last page
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationButton
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading) onPageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationButton>
        </PaginationItem>,
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPreviousButton
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading) onPageChange(currentPage - 1);
            }}
            disabled={currentPage === 1 || isLoading}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNextButton
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading) onPageChange(currentPage + 1);
            }}
            disabled={currentPage === totalPages || isLoading}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
