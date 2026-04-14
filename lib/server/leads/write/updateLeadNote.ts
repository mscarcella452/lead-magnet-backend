import "server-only";
import { Note, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";

// ============================================================
// Types
// ============================================================

export interface UpdateLeadNoteData {
  leadId: string;
  noteId: string;
  content?: string;
  isPinned?: boolean;
}

// ============================================================
// updateLeadNote
// ============================================================

/**
 * Updates a lead note's content or pinned state.
 * When content is updated, records the current user as updatedBy.
 * Requires an authenticated user.
 */
export async function updateLeadNote({
  leadId,
  noteId,
  content,
  isPinned,
}: UpdateLeadNoteData): Promise<Note> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  const data: Prisma.NoteUpdateInput = {};

  if (content !== undefined) {
    data.content = content.trim();
    data.contentUpdatedAt = new Date();
    data.updatedByUser = {
      connect: { id: currentUser.id },
    };
    data.updatedBy = currentUser.username;
  }

  if (isPinned !== undefined) {
    data.isPinned = isPinned;
    data.pinnedAt = isPinned ? new Date() : null;
  }

  return prisma.note.update({
    where: { id: noteId, leadId },
    data,
  });
}
