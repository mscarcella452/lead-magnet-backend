import "server-only";

import { Note } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ActivityType } from "@prisma/client";

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

// if you want activity update side effect

// Deletes a note for a lead and logs activity as side Effect
