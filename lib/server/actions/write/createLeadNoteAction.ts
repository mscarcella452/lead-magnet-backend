"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createLeadNote } from "@/lib/server/write/createLeadNote";
import { ActionResult } from "@/types/server";
import { Note } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// createLeadNoteAction(leadId: string, content: string, author?: string): Promise<ActionResult<Note>>
// Server action to create a new lead note
// Revalidates dashboard to update activity feed
// ============================================================================

export async function createLeadNoteAction(
  leadId: string,
  content: string,
  author: string = "You",
): Promise<ActionResult<Note>> {
  try {
    const note = await createLeadNote(leadId, content, author);

    revalidateTag(CACHE_TAGS.LEADS);
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);

    return { success: true, data: note };
  } catch (error) {
    console.error("Error creating lead note:", error);
    return { success: false, error: "Failed to create note" };
  }
}

// /app/admin/components/NotesDialog.tsx

// "use client";

// import { useState } from "react";
// import { createLeadNoteAction, getLeadNotesAction } from "@/app/admin/actions";
// import { toast } from "sonner";

// export function NotesDialog({ leadId }: { leadId: string }) {
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [newNote, setNewNote] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleAddNote = async () => {
//     if (!newNote.trim()) return;

//     setIsSubmitting(true);
//     const result = await createLeadNoteAction(leadId, newNote);

//     if (result.success) {
//       toast.success("Note added");
//       setNewNote("");

//       // Refresh notes list
//       const notesResult = await getLeadNotesAction(leadId);
//       if (notesResult.success) {
//         setNotes(notesResult.data);
//       }
//     } else {
//       toast.error(result.error);
//     }

//     setIsSubmitting(false);
//   };

//   return (
//     <div>
//       {/* Display existing notes (read-only) */}
//       <div className="space-y-2">
//         {notes.map((note) => (
//           <div key={note.id} className="border p-3 rounded">
//             <p className="text-sm">{note.content}</p>
//             <p className="text-xs text-muted-foreground mt-1">
//               {note.author} • {formatDate(note.createdAt)}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Add new note */}
//       <div className="mt-4">
//         <textarea
//           value={newNote}
//           onChange={(e) => setNewNote(e.target.value)}
//           placeholder="Add a note..."
//           className="w-full p-2 border rounded"
//         />
//         <button
//           onClick={handleAddNote}
//           disabled={isSubmitting || !newNote.trim()}
//           className="mt-2"
//         >
//           Add Note
//         </button>
//       </div>
//     </div>
//   );
// }
