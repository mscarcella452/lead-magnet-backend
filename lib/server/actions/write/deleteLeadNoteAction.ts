"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteLeadNote,
  type DeleteLeadNoteData,
} from "@/lib/server/write/deleteLeadNote";
import { ActionResult } from "@/types/server";
import { Note } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// updateLeadNoteAction(leadId: string, noteId: string, content: string, author?: string): Promise<ActionResult<Note>>
// Server action to update a lead note
// Revalidates dashboard to update activity feed
// ============================================================================

export async function deleteLeadNoteAction({
  leadId,
  noteId,
}: DeleteLeadNoteData): Promise<ActionResult<Note>> {
  try {
    const note = await deleteLeadNote({ leadId, noteId });

    revalidateTag(CACHE_TAGS.LEADS);
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);

    return { success: true, data: note };
  } catch (error) {
    console.error("Error deleting lead note:", error);
    return { success: false, error: "Failed to delete note" };
  }
}
