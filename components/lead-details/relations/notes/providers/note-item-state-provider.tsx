"use client";
import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ============================================================================
// Constants & Types
// ============================================================================
enum NoteItemState {
  RESTING,
  OPENING,
  OPEN,
  CLOSING,
}

type PopoverContent = "update" | "delete";

type NoteItemViewState = {
  viewState: NoteItemState;
  translateY: number;
  popoverContent: PopoverContent;
};

const INITIAL_NOTE_ITEM_STATE: NoteItemViewState = {
  viewState: NoteItemState.RESTING,
  translateY: 0,
  popoverContent: "update",
};

type NoteItemAction =
  | { type: "OPEN"; translateY: number }
  | { type: "CLOSE" }
  | { type: "CLOSING_COMPLETE" }
  | { type: "SET_POPOVER_CONTENT"; content: PopoverContent };

function noteItemReducer(
  state: NoteItemViewState,
  action: NoteItemAction,
): NoteItemViewState {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        translateY: action.translateY,
        viewState: NoteItemState.OPENING,
      };
    case "CLOSE":
      return { ...state, viewState: NoteItemState.CLOSING };
    case "CLOSING_COMPLETE":
      return { ...state, viewState: NoteItemState.RESTING };
    case "SET_POPOVER_CONTENT":
      return { ...state, popoverContent: action.content };
    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================
type NoteItemStateContextValue = {
  noteState: NoteItemViewState;
  isOpen: boolean;
  isTranslated: boolean;
  close: () => void;
  open: (translateY: number) => void;
  setPopoverContent: (content: PopoverContent) => void;
  setPendingAction: (action: (() => void) | null) => void;
  onClosingComplete: () => void;
};

export const NoteItemStateContext =
  createContext<NoteItemStateContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================
export function NoteItemStateProvider({ children }: { children: ReactNode }) {
  const [noteState, dispatch] = useReducer(
    noteItemReducer,
    INITIAL_NOTE_ITEM_STATE,
  );
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const isOpen =
    noteState.viewState === NoteItemState.OPEN ||
    noteState.viewState === NoteItemState.OPENING;
  const isTranslated = noteState.viewState !== NoteItemState.RESTING;

  useEffect(() => {
    if (noteState.viewState === NoteItemState.RESTING && pendingAction) {
      // Snapshot and clear before invoking to prevent double-firing if action()
      // triggers a re-render before setPendingAction(null) has settled
      const action = pendingAction;
      setPendingAction(null);
      action();
    }
  }, [noteState.viewState, pendingAction]);

  const open = useCallback((translateY: number) => {
    dispatch({ type: "OPEN", translateY });
  }, []);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  const onClosingComplete = useCallback(() => {
    if (noteState.viewState === NoteItemState.CLOSING) {
      dispatch({ type: "CLOSING_COMPLETE" });
    }
  }, [noteState.viewState]);

  const setPopoverContent = useCallback((content: PopoverContent) => {
    dispatch({ type: "SET_POPOVER_CONTENT", content });
  }, []);

  return (
    <NoteItemStateContext.Provider
      value={{
        noteState,
        isOpen,
        isTranslated,
        close,
        open,
        setPopoverContent,
        setPendingAction,
        onClosingComplete,
      }}
    >
      {children}
    </NoteItemStateContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================
export function useNoteItemState(): NoteItemStateContextValue {
  const context = useContext(NoteItemStateContext);
  if (!context) {
    throw new Error(
      "useNoteItemState must be used within a NoteItemStateProvider",
    );
  }
  return context;
}
