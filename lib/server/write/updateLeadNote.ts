import "server-only";

import { Note } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ActivityType } from "@prisma/client";

// ============================================================================
// updateLeadNote(leadId: string, noteId: string, content: string, author?: string): Promise<Note>
// Updates a note for a lead and logs activity as side Effect
// ============================================================================

export interface UpdateLeadNoteData {
  leadId: string;
  noteId: string;
  content?: string;
  isPinned?: boolean;
  // editedBy: string;
}

export async function updateLeadNote({
  leadId,
  noteId,
  content,
  isPinned,
}: UpdateLeadNoteData): Promise<Note> {
  const data: any = {};
  if (content !== undefined) {
    data.content = content.trim();
    data.contentUpdatedAt = new Date();
  }
  if (isPinned !== undefined) {
    data.isPinned = isPinned;
    data.pinnedAt = isPinned ? new Date() : null;
  }

  const note = await prisma.note.update({
    where: { id: noteId, leadId },
    data,
  });

  return note;
}

// if you want activity update side effect

// export async function updateLeadNote({
//   leadId,
//   noteId,
//   content,
//   editedBy,
// }: UpdateLeadNoteData): Promise<Note> {
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
//         performedBy: editedBy,
//         metadata: { noteContent: content.trim().substring(0, 100) },
//       },
//     });

//     return [note];
//   });

//   return note;
// }
