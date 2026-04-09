"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  updateLeadNote,
  type UpdateLeadNoteData,
} from "@/lib/server/leads/write/updateLeadNote";
import { ActionResult } from "@/types/server/actions";
import { Note } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// updateLeadNoteAction(leadId: string, noteId: string, content: string, author?: string): Promise<ActionResult<Note>>
// Server action to update a lead note
// Revalidates dashboard to update activity feed
// ============================================================================

export async function updateLeadNoteAction({
  leadId,
  noteId,
  content,
  isPinned,
}: UpdateLeadNoteData): Promise<ActionResult<Note>> {
  try {
    const note = await updateLeadNote({ leadId, noteId, content, isPinned });

    revalidateTag(CACHE_TAGS.LEADS, {});
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);

    return { success: true, data: note };
  } catch (error) {
    console.error("Error updating lead note:", error);
    return { success: false, error: "Failed to update note" };
  }
}
