import { Badge } from '@/components/ui/feedback/badge';
import { BadgeProps } from '@/components/ui/feedback/badge';
import { cn } from '@/lib/utils/classnames';
interface TagBlockProps extends BadgeProps {
  tags: string[];
  className?: string;
}

const TagBlock = ({ tags, className, ...props }: TagBlockProps) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Badge variant="muted" key={tag} {...props}>
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export { TagBlock };
