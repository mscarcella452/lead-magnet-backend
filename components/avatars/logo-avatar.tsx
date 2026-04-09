import {
  Avatar,
  type AvatarProps,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/layout/avatar";
import { SITE_CONFIG } from "@/config";
import { getInitials } from "@/lib/utils/strings";

interface LogoAvatarProps extends AvatarProps {
  delayMs?: number;
  priority?: boolean;
}

export const LogoAvatar = ({
  delayMs,
  priority = true,
  ...props
}: LogoAvatarProps) => {
  const altText = `${SITE_CONFIG.business_name} Logo`;
  const fallbackText = getInitials(SITE_CONFIG.business_name);

  return (
    <Avatar {...props}>
      <AvatarImage src={SITE_CONFIG.logo} alt={altText} priority={priority} />
      <AvatarFallback delayMs={delayMs}>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};
