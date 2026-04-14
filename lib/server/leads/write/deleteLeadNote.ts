import "server-only";

import { Note } from "@prisma/client";
import { prisma } from "@/lib/db";

// ============================================================================
// deleteLeadNote(leadId: string, noteId: string): Promise<Note>

// ============================================================================

export interface DeleteLeadNoteData {
  leadId: string;
  noteId: string;
}

export async function deleteLeadNote({
  leadId,
  noteId,
}: DeleteLeadNoteData): Promise<Note> {
  const note = await prisma.note.delete({
    where: { id: noteId, leadId },
  });

  return note;
}
