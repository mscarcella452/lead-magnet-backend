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
import { Container } from "@/components/ui/layout/containers";
import { Card } from "@/components/ui/layout/card";
import { Label } from "@/components/ui/forms/label";

interface InviteEmailProps {
  name: string;
  magicLink: string;
  expiryDuration: string;
}

export default function InviteEmail({
  name = "John",
  magicLink = "http://localhost:3000/auth/reset-password?token=0706ad1161ab87f78d63fc4cbd86281d872a3061488ee203e7904ebdc9d3e62e",
  expiryDuration,
}: InviteEmailProps) {
  return (
    <EmailWrapper preview="Welcome! Set your password to get started">
      <div className="mx-auto max-w-[600px]">
        <EmailLogoHeader />

        <div className="my-8">
          <EmailHeading
            heading={
              <>
                Welcome, <span className="capitalize">{name}</span>!
              </>
            }
            subHeading="You've been invited to join our lead dashboard. Click the button below to set your password and get started."
          />

          <Section className="mt-4 mb-6">
            <Button
              className="inline-block bg-brand text-brand-foreground hover:bg-brand-hover border border-[#333] px-4 py-3 rounded-lg no-underline font-medium text-sm"
              href={magicLink}
            >
              Set Your Password
            </Button>
          </Section>

          <CopyLink link={magicLink} />
        </div>
        <EmailFooter
          description={`This link expires in ${expiryDuration}. If you didn't request this, you can safely ignore this email`}
        />
      </div>
    </EmailWrapper>
  );
}
