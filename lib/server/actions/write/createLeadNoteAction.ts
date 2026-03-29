"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createLeadNote } from "@/lib/server/write/createLeadNote";
import { ActionResult } from "@/types/server";
import { Note } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// createLeadNoteAction(leadId: string, content: string): Promise<ActionResult<Note>>
// Server action to create a new lead note
// Revalidates dashboard to update activity feed
// ============================================================================

export async function createLeadNoteAction(
  leadId: string,
  content: string,
): Promise<ActionResult<Note>> {
  try {
    const note = await createLeadNote(leadId, content);

    revalidateTag(CACHE_TAGS.LEADS);
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);

    return { success: true, data: note };
  } catch (error) {
    console.error("Error creating lead note:", error);
    return { success: false, error: "Failed to create note" };
  }
}
