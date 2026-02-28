"use client";
import { usePopoverContext } from "@/components/motion-primitives/morphing-popover";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { useRef, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/layout/card";

// ============================================================================
// Types
// ============================================================================

interface NoteFormCardProps {
  onSubmit: (newNote: string) => Promise<void>;
  placeholderLabel: string;
  submitLabel: string;
  initialNote?: string;
}

// ============================================================================
// Constants
// ============================================================================

const MAX_LENGTH = 225;

const MAX_LENGTH_THRESHOLD = MAX_LENGTH - 15;

// ============================================================================
// CharacterLimitDisplay Component
// ============================================================================

function CharacterLimitDisplay({ length }: { length: number }) {
  const isOverThreshold = length >= MAX_LENGTH_THRESHOLD;
  if (!isOverThreshold) return null;
  return (
    <span className=" text-subtle-foreground text-caption">
      {length}/{MAX_LENGTH}
    </span>
  );
}

// ============================================================================
// NoteForm Component
// ============================================================================

function NoteFormCard({
  onSubmit,
  placeholderLabel,
  submitLabel,
  initialNote = "",
}: NoteFormCardProps) {
  const [newNote, setNewNote] = useState(initialNote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const context = usePopoverContext("NoteFormCard");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNote.trim()) return;

    setIsSubmitting(true);

    try {
      await onSubmit(newNote);
    } finally {
      setIsSubmitting(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  }, []);

  return (
    <Card size="sm" className="bg-input!" border={true}>
      <CardTitle className="sr-only">{placeholderLabel}</CardTitle>

      <form className="flex h-full w-full flex-col" onSubmit={handleSubmit}>
        <motion.span
          layoutId={context?.labelId}
          aria-hidden="true"
          style={{
            opacity: newNote ? 0 : 1,
          }}
          className="absolute top-card-y-sm left-card-x-sm text-sm text-subtle-foreground select-none"
        >
          {placeholderLabel}
        </motion.span>
        <textarea
          className="w-full resize-none h-[100px] rounded-md bg-transparent text-xs @lg:text-sm leading-relaxed outline-hidden z-50"
          ref={textareaRef}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={isSubmitting}
          maxLength={MAX_LENGTH}
        />
        <Container
          key="close"
          spacing="group"
          className="flex flex-row items-center justify-start"
        >
          <Button
            type="button"
            intent="ghost"
            size="responsive-sm"
            mode="iconOnly"
            className="-translate-x-2"
            onClick={context?.close}
            aria-label="Close popover"
          >
            <ArrowLeftIcon size={16} className="text-base" />
          </Button>
          <CharacterLimitDisplay length={newNote.length} />
          <Button
            type="submit"
            intent="outline"
            size="responsive-sm"
            aria-label={placeholderLabel}
            className="ml-auto"
            disabled={newNote.trim() === initialNote || isSubmitting}
          >
            {submitLabel}
          </Button>
        </Container>
      </form>
    </Card>
  );
}

export { NoteFormCard };
