import "server-only";

import { Note } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";

// ============================================================================
// createLeadNote(leadId: string, content: string, author?: string): Promise<Note>
// Creates a new note for a lead and logs activity as side Effect
// ============================================================================

export async function createLeadNote(
  leadId: string,
  content: string,
): Promise<Note> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const note = await prisma.note.create({
    data: {
      lead: { connect: { id: leadId } },
      content: content.trim(),
      authorUser: {
        connect: { id: user.id },
      },
      author: user.username,
    },
  });

  return note;
}
