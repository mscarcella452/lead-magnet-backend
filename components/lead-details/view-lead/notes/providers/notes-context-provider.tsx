"use client";
import React, { createContext, useContext, useReducer, RefObject } from "react";
import { Note } from "@/types/leads/lead";

// ============================================================
// TYPES
// ============================================================
type NoteAction =
  | { type: "ADD"; payload: Note }
  | {
      type: "UPDATE";
      payload: { id: string; updates: Omit<Partial<Note>, "updatedAt"> };
    }
  | { type: "DELETE"; payload: string }; // noteId

type NotesContextValue = {
  notes: Note[];
  dispatch: React.Dispatch<NoteAction>;
  leadId: string;
  contentRef: RefObject<HTMLDivElement | null>;
};

interface NotesContextProviderProps {
  children: React.ReactNode;
  initialNotes: Note[];
  leadId: string;
  contentRef: RefObject<HTMLDivElement | null>;
}

// ============================================================
// REDUCER
// ============================================================
const notesReducer = (state: Note[], action: NoteAction): Note[] => {
  switch (action.type) {
    // ============================================================
    // ADD NOTE
    // Prepends a note to the beginning of the list.
    // ============================================================
    case "ADD":
      return [action.payload, ...state];
    // ============================================================
    // UPDATE NOTE
    // Updates a note's properties in place.
    // Always sets updatedAt to now — cannot be overridden.
    // ============================================================
    case "UPDATE":
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, ...action.payload.updates }
          : note,
      );
    // ============================================================
    // DELETE NOTE
    // Removes a note from the list by ID.
    // ============================================================
    case "DELETE":
      return state.filter((note) => note.id !== action.payload);

    default:
      return state;
  }
};

// ============================================================
// CONTEXT
// ============================================================
const NotesContext = createContext<NotesContextValue | null>(null);

// ============================================================
// HOOK
// ============================================================
export function useNotesContext() {
  const ctx = useContext(NotesContext);
  if (!ctx)
    throw new Error("useNotesContext must be used within NotesContextProvider");
  return ctx;
}

// ============================================================
// PROVIDER
// ============================================================
export function NotesContextProvider({
  children,
  initialNotes,
  leadId,
  contentRef,
}: NotesContextProviderProps) {
  const [notes, dispatch] = useReducer(notesReducer, initialNotes);

  return (
    <NotesContext.Provider
      value={{
        notes,
        dispatch,
        leadId,
        contentRef,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
