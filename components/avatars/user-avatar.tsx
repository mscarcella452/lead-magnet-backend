import {
  Avatar,
  type AvatarProps,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/layout/avatar";
import { getInitials } from "@/lib/utils/strings";

interface UserAvatarProps extends AvatarProps {
  src?: string | null;
  delayMs?: number;
  name: string; // used for alt text and initials fallback
  priority?: boolean;
}

export const UserAvatar = ({
  src,
  name,
  delayMs,
  priority = false,
  ...props
}: UserAvatarProps) => (
  <Avatar radius="pill" {...props}>
    <AvatarImage src={src ?? ""} alt={`${name}'s avatar`} priority={priority} />
    <AvatarFallback delayMs={delayMs} className="capitalize">
      {getInitials(name)}
    </AvatarFallback>
  </Avatar>
);
