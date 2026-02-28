import {
  Avatar,
  type AvatarProps,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface LogoAvatarProps extends AvatarProps {
  className?: string;
}

const LogoAvatar = ({ size, radius, ...props }: LogoAvatarProps) => {
  return (
    <Avatar size={size} radius={radius} {...props}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export { LogoAvatar };
