"use server";
import { getLeadNotes } from "@/lib/server/read/getLeadNotes";
import { ActionResult } from "@/types/server";
import { Note } from "@prisma/client";

export async function getLeadNotesAction(
  leadId: string,
): Promise<ActionResult<Note[]>> {
  try {
    const notes = await getLeadNotes(leadId);
    return { success: true, data: notes };
  } catch (error) {
    console.error("Error fetching lead notes:", error);
    return { success: false, error: "Failed to fetch notes" };
  }
}
