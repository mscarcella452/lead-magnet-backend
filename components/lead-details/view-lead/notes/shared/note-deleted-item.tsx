import { Container } from "@/components/ui/layout/containers";
import { formatDate } from "@/lib/utils/dates";

// ============================================================================
// NoteDeletedItem(deletedBy: string, deletedDate: Date): JSX.Element
// Renders a note deleted item
// ============================================================================

interface NoteDeletedItemProps {
  deletedBy: string;
  deletedDate: Date;
}

const NoteDeletedItem = ({ deletedBy, deletedDate }: NoteDeletedItemProps) => {
  const formattedDate = formatDate(deletedDate);

  // ADDD TIMELIMIT UNTIL DISAPPEARS
  //   if (deletedDate < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
  //     return null;
  //   }

  return (
    <Container
      spacing="item"
      className="flex flex-row items-center text-xs text-muted-foreground"
    >
      <span className=" italic">🗑️ Note deleted by {deletedBy}</span>
      <span aria-hidden="true">•</span>
      <span className="text-subtle-foreground">{formattedDate}</span>
    </Container>
  );
};

export { NoteDeletedItem };
