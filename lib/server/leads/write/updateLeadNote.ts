import "server-only";
import { Note, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";

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

// if add activity update side effect

// export async function updateLeadNote({
//   leadId,
//   noteId,
//   content,

// }: UpdateLeadNoteData): Promise<Note> {
// const currentUser = await getCurrentUser();
// if (!currentUser) throw new Error("Unauthorized");

//   const [note] = await prisma.$transaction(async (tx) => {
//     const note = await tx.note.update({
//       where: { id: noteId, leadId },
//       data: {
//         content: content.trim(),
//       },
//     });

//     await tx.activity.create({
//       data: {
//         leadId,
//         type: ActivityType.NOTE_UPDATED,
//         performedBy: currentUser.role,
//         metadata: { noteContent: content.trim().substring(0, 100) },
//       },
//     });

//     return [note];
//   });

//   return note;
// }
