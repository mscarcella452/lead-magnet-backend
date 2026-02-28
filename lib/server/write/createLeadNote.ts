import "server-only";

import { Note } from "@prisma/client";
import { prisma } from "@/lib/db";

// ============================================================================
// createLeadNote(leadId: string, content: string, author?: string): Promise<Note>
// Creates a new note for a lead and logs activity as side Effect
// ============================================================================

export async function createLeadNote(
  leadId: string,
  content: string,
  author: string = "You",
): Promise<Note> {
  const note = await prisma.note.create({
    data: { leadId, content: content.trim(), author },
  });

  return note;
}

// Uses transaction to ensure both note and activity are created atomically
// const [note, _activity] = await prisma.$transaction([
//   prisma.note.create({
//     data: { leadId, content: content.trim(), author },
//   }),
//   prisma.activity.create({
//     data: {
//       leadId,
//       type: "NOTE_ADDED",
//       metadata: { noteContent: content.trim().substring(0, 100) },
//     },
//   }),
// ]);
