import "server-only";
import { prisma } from "@/lib/db";
import { Note } from "@prisma/client";

// In /app/admin/actions.ts
export async function getLeadNotes(leadId: string): Promise<Note[]> {
  const notes = await prisma.note.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      leadId: true,
      content: true,
      author: true,
      createdAt: true,
    },
  });
  return notes;
}
