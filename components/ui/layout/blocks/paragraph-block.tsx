import { Container } from '@/components/ui/layout/containers/container';
import { cn } from '@/lib/utils/classnames';

const ParagraphBlock = ({
  content,
  className,
}: {
  content: string[];
  className?: string;
}) => {
  return (
    <Container spacing="group" className={className}>
      {content.map((paragraph, index) => (
        <p
          className={cn('leading-relaxed', {
            'font-medium': index === 0,
            'text-muted-foreground font-normal': index !== 0,
          })}
          key={index}
        >
          {paragraph}
        </p>
      ))}
    </Container>
  );
};

export { ParagraphBlock };
