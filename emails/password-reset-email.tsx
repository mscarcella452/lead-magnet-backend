import {
  Body,
  Button,
  // Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Hr,
} from "@react-email/components";

import { EmailButton, CopyLink } from "./ui/controls";

import {
  EmailHeading,
  EmailWrapper,
  EmailSeperator,
  EmailCard,
  EmailInfoCard,
  EmailFooter,
  EmailLogoHeader,
} from "./ui/layout";

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
  username: string;
  expiryDuration: string;
}

export default function PasswordResetEmail({
  name = "John",
  resetLink = "http://localhost:3000/auth/reset-password?token=0706ad1161ab87f78d63fc4cbd86281d872a3061488ee203e7904ebdc9d3e62e",
  username = "happy1234",
  expiryDuration,
}: PasswordResetEmailProps) {
  return (
    <EmailWrapper preview="Reset your password">
      <div className="mx-auto max-w-[600px]">
        <EmailLogoHeader />

        <div className="my-8">
          <EmailHeading
            heading={
              <>
                Trouble signing in, <span className="capitalize">{name}</span>?
              </>
            }
            subHeading="Here are your sign-in details."
            className="mb-4"
          />

          <EmailInfoCard label="Username" value={username} />

          <div className="my-8">
            <p className="leading-relaxed text-sm font-medium mb-4">
              If you also need to reset your password, click the button below.
            </p>

            <EmailButton href={resetLink}>Reset Password</EmailButton>
          </div>

          <CopyLink link={resetLink} />
        </div>
        <EmailFooter
          description={`This link expires in ${expiryDuration}. If you didn't request this, you can safely ignore this email`}
        />
      </div>
    </EmailWrapper>
  );
}
