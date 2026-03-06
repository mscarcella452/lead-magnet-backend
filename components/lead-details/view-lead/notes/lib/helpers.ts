import { Note } from "@prisma/client";

// ============================================================================
// getTranslateYToCenter Helper
// ============================================================================

type CenteringOptions = {
  targetRect: DOMRect;
  containerRect?: DOMRect | null;
};

export function getTranslateYToCenter({
  targetRect,
  containerRect,
}: CenteringOptions): number {
  const containerCenter = containerRect
    ? containerRect.top + containerRect.height * 0.5
    : window.innerHeight * 0.5;

  const targetCenter = targetRect.top + targetRect.height * 0.5;

  return Math.round(-(targetCenter - containerCenter));
}

// ============================================================
// SORT NOTES BY PINNED AT
// Sorts notes to match server-side ordering:
// 1. Pinned notes first (by pinnedAt desc)
// 2. Unpinned notes after (by createdAt asc)
// ============================================================
export const sortNotesByPinnedAt = (notes: Note[]): Note[] => {
  return [...notes].sort((a, b) => {
    const pinnedA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : null;
    const pinnedB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : null;
    const createdA = new Date(a.createdAt).getTime();
    const createdB = new Date(b.createdAt).getTime();

    if (pinnedA && pinnedB) return pinnedB - pinnedA;
    if (pinnedA) return -1;
    if (pinnedB) return 1;
    return createdB - createdA;
  });
};
