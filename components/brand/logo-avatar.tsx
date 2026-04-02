import {
  Avatar,
  type AvatarProps,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/layout/avatar";
import { SITE_CONFIG } from "@/config";
import { getInitials } from "@/lib/utils/strings";

interface LogoAvatarProps extends AvatarProps {
  className?: string;
}

const LogoAvatar = ({ size, radius, ...props }: LogoAvatarProps) => {
  const altText = `${SITE_CONFIG.business_name} Logo`;
  const fallbackText = getInitials(SITE_CONFIG.business_name);

  return (
    <Avatar size={size} radius={radius} {...props}>
      <AvatarImage src={SITE_CONFIG.logo} alt={altText} />
      <AvatarFallback delayMs={600}>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};

export { LogoAvatar };
